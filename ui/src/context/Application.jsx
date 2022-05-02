import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { makeCapTP, E } from '@agoric/captp';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { Far } from '@agoric/marshal';

import {
  activateWebSocket,
  deactivateWebSocket,
  getActiveSocket,
} from '../utils/fetch-websocket.js';

import dappConstants from '../lib/constants.js';
import {
  reducer,
  defaultState,
  setApproved,
  setConnected,
  setOpenEnableAppDialog,
  setAvailableCards,
  setCardPurse,
  setTokenDisplayInfo,
  setTokenPetname,
  setTokenPurses,
  setUserCards,
  setInvitationPurse,
  setIsSeller,
  setWalletOffers,
  setPreviousOfferId,
} from '../store/store';
import { handleInitialOffers } from '../helpers/wallet.js';
import { mapSellingOffersToEvents } from '../services/marketPlace.js';
// import { parseEventsToSeperateCards } from '../services/cardMint.js';

const {
  MARKET_PLACE_INSTANCE_BOARD_ID,
  MARKET_PLACE_INSTALLATION_BOARD_ID,
  issuerBoardIds: { Card: CARD_ISSUER_BOARD_ID, Money: MONEY_ISSUER_BOARD_ID },
  brandBoardIds: { Money: MONEY_BRAND_BOARD_ID, Card: CARD_BRAND_BOARD_ID },
  INVITE_BRAND_BOARD_ID,
} = dappConstants;
console.log(MONEY_BRAND_BOARD_ID);
/* eslint-disable */
let walletP;
let publicFacetMarketPlace;
/* eslint-enable */
let marketPlaceInstanceForQuery;
let cardBrand;
let moneyBrand;
export { walletP, publicFacetMarketPlace };

export const ApplicationContext = createContext();

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

/* eslint-disable complexity, react/prop-types */
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { cardPurse, availableCards, tokenPurses, isSeller } = state;
  useEffect(() => {
    // Receive callbacks from the wallet connection.
    const otherSide = Far('otherSide', {
      needDappApproval(_dappOrigin, _suggestedDappPetname) {
        dispatch(setApproved(false));
        dispatch(setOpenEnableAppDialog(true));
      },
      dappApproved(_dappOrigin) {
        dispatch(setApproved(true));
      },
    });

    let walletAbort;
    let walletDispatch;

    const onConnect = async () => {
      dispatch(setConnected(true));
      const socket = getActiveSocket();
      const {
        abort: ctpAbort,
        dispatch: ctpDispatch,
        getBootstrap,
      } = makeCapTP(
        'ticketStore',
        (obj) => socket.send(JSON.stringify(obj)),
        otherSide,
      );
      walletAbort = ctpAbort;
      walletDispatch = ctpDispatch;
      walletP = await getBootstrap();
      const zoe = E(walletP).getZoe();
      const board = E(walletP).getBoard();
      console.log('walletP', walletP);
      try {
        console.log(
          'MARKET_PLACE_INSTANCE_BOARD_ID',
          MARKET_PLACE_INSTANCE_BOARD_ID.toString(),
        );
        const marketPlaceContractInstance = await E(board).getValue(
          MARKET_PLACE_INSTANCE_BOARD_ID,
        );
        marketPlaceInstanceForQuery = marketPlaceContractInstance;
        publicFacetMarketPlace = await E(zoe).getPublicFacet(
          marketPlaceContractInstance,
        );
        const { marketPlaceEvents } = await E(
          publicFacetMarketPlace,
        ).getAvailableEvents();
        dispatch(setAvailableCards(marketPlaceEvents || []));
        const isAdmin = await E(publicFacetMarketPlace).isSeller();
        dispatch(setIsSeller(isAdmin));
        const orderBookNotifier = await E(publicFacetMarketPlace).getNotifier();
        console.log('eventsNotifier:', orderBookNotifier);
        console.log('facet', publicFacetMarketPlace);

        const processPurses = (purses) => {
          const newTokenPurses = purses.filter(
            ({ brandBoardId }) => brandBoardId === MONEY_BRAND_BOARD_ID,
          );
          cardBrand = E(board).getValue(CARD_BRAND_BOARD_ID);
          const newCardPurse = purses.find(
            ({ brandBoardId }) => brandBoardId === CARD_BRAND_BOARD_ID,
          );
          moneyBrand = E(board).getValue(MONEY_BRAND_BOARD_ID);

          const zoeInvitationPurse = purses.find(
            ({ brandBoardId }) => brandBoardId === INVITE_BRAND_BOARD_ID,
          );
          console.log(MONEY_ISSUER_BOARD_ID);
          console.log('newTokenPurses', newTokenPurses);
          dispatch(setTokenPurses(newTokenPurses));
          dispatch(setTokenDisplayInfo(newTokenPurses[0].displayInfo));
          dispatch(setTokenPetname(newTokenPurses[0].brandPetname));
          dispatch(setCardPurse(newCardPurse));
          dispatch(setUserCards(newCardPurse?.currentAmount?.value));
          dispatch(
            setInvitationPurse(zoeInvitationPurse?.currentAmount?.value),
          );
          if (
            zoeInvitationPurse?.currentAmount?.value.length > 0 &&
            zoeInvitationPurse?.currentAmount?.value[0].description ===
              'mint a payment'
          ) {
            dispatch(setIsSeller(true));
          }
        };

        async function watchPurses() {
          const pn = E(walletP).getPursesNotifier();
          for await (const purses of iterateNotifier(pn)) {
            processPurses(purses);
          }
        }
        watchPurses().catch((err) => console.error('got watchPurses err', err));

        // async function watchMarketPlaceEvents() {
        //   for await (const availableOffers of iterateNotifier(
        //     availabeEventsNotifier,
        //   )) {
        //     console.log('In MarketPlace', availableOffers);
        //     dispatch(setAvailableCards(availableOffers || []));
        //   }
        // }
        // watchMarketPlaceEvents().catch((err) =>
        //   console.log('got watchMarketPlaceEvents errs', err),
        // );
        async function watchWallerOffers() {
          const offerNotifier = E(walletP).getOffersNotifier();
          for await (const offers of iterateNotifier(offerNotifier)) {
            await E(publicFacetMarketPlace).updateNotifier();
            console.log('wallet offers:', offers);
            if (isSeller) {
              const selectedOffer = offers.filter((offer) => {
                if (offer.invitationDetail.description === 'mint a payment') {
                  return true;
                } else return false;
              });
              console.log('wallet offers:', selectedOffer[0].id);
              dispatch(setPreviousOfferId([selectedOffer[0].id]));
              dispatch(setWalletOffers([offers]));
            }
          }
        }
        watchWallerOffers().catch((err) =>
          console.error('got watchWalletoffer err', err),
        );

        async function watchMarketPlaceOffers() {
          for await (const orders of iterateNotifier(orderBookNotifier)) {
            console.log('offers in marketplace:', orders);
            const formatedEventList = await mapSellingOffersToEvents(orders);
            console.log('offers in marketplace', formatedEventList);
            dispatch(setAvailableCards(formatedEventList || []));
          }
        }
        watchMarketPlaceOffers().catch((err) =>
          console.log('got watchMarketPlaceOffers errs', err),
        );
        try {
          const installationBoardId = MARKET_PLACE_INSTALLATION_BOARD_ID;
          console.log('walletp', walletP);
          await E(walletP).suggestInstallation(
            'Installation',
            installationBoardId,
          );
          console.log('suggestion 1');
          await E(walletP).suggestInstance(
            'Instance',
            MARKET_PLACE_INSTANCE_BOARD_ID,
          );
          console.log('suggestion 2');
          await E(walletP).suggestIssuer('Event Tickets', CARD_ISSUER_BOARD_ID);
          console.log('suggestion 3');
        } catch (error) {
          console.log('error in promise all:', error);
        }
      } catch (e) {
        console.log('error in application', e);
      }
    };

    const onDisconnect = () => {
      dispatch(setConnected(false));
      walletAbort && walletAbort();
    };

    const onMessage = (data) => {
      console.log(data);
      const obj = JSON.parse(data);
      walletDispatch && walletDispatch(obj);
      console.log('Response from wallet:', obj);
    };

    activateWebSocket({
      onConnect,
      onDisconnect,
      onMessage,
    });
    return deactivateWebSocket;
  }, []);

  useEffect(() => {
    if (!isSeller) return;
    (async () => {
      const params = {
        walletP,
        cardBrand,
        tickets: availableCards,
        cardPursePetname: cardPurse?.pursePetname,
        tokenPursePetname: tokenPurses[0]?.pursePetname,
        marketPlaceContractInstance: marketPlaceInstanceForQuery,
        publicFacetMarketPlace,
      };
      console.log(params);
      await handleInitialOffers(params);
    })();
  }, [
    availableCards,
    marketPlaceInstanceForQuery,
    cardBrand,
    moneyBrand,
    cardPurse,
    tokenPurses,
    isSeller,
  ]);
  return (
    <ApplicationContext.Provider
      value={{
        state,
        dispatch,
        walletP,
        publicFacetMarketPlace,
        CARD_BRAND_BOARD_ID,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
