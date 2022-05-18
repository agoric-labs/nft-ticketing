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
  // setAvailableCards,
  setCardPurse,
  setTokenDisplayInfo,
  setTokenPetname,
  setTokenPurses,
  setUserCards,
  setInvitationPurse,
  setIsSeller,
  setEventCards,
  setWalletOffers,
  setPreviousOfferId,
  setCardPurseLoader,
} from '../store/store';
import { getInvitationMakerInWallet } from '../services/marketPlace.js';
import { waitForOfferBeingAccepted } from '../helpers/wallet.js';

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
// let moneyBrand;
export { walletP, publicFacetMarketPlace };

export const ApplicationContext = createContext();

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

/* eslint-disable complexity, react/prop-types */
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { cardPurse, tokenPurses, previousOfferId } = state;
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
    let initInvitationMaker = false;
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
        const { events, availabeEventsNotifier } = await E(
          publicFacetMarketPlace,
        ).getAvailableEvents();
        dispatch(setEventCards(events || []));
        const Issuer = await E(publicFacetMarketPlace).getItemsIssuer();
        cardBrand = Issuer.cardBrand;
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
        const initializeInvitationMaker = async () => {
          const offerId = await getInvitationMakerInWallet({
            marketPlaceContractInstance,
            walletP,
          });
          initInvitationMaker = true;
          console.log('offerID IN APPLICATION:', offerId);
          await waitForOfferBeingAccepted({ walletP, offerId });
          if (offerId) dispatch(setPreviousOfferId(offerId));
        };
        try {
          if (!previousOfferId && !initInvitationMaker)
            initializeInvitationMaker();
        } catch (e) {
          console.log('error in application getting Invitation Maker', e);
        }
        const processPurses = (purses) => {
          const newTokenPurses = purses.filter(
            ({ brandBoardId }) => brandBoardId === MONEY_BRAND_BOARD_ID,
          );
          // cardBrand = E(board).getValue(CARD_BRAND_BOARD_ID);
          const newCardPurse = purses.find(
            ({ brandBoardId }) => brandBoardId === CARD_BRAND_BOARD_ID,
          );
          // moneyBrand = E(board).getValue(MONEY_BRAND_BOARD_ID);

          const zoeInvitationPurse = purses.find(
            ({ brandBoardId }) => brandBoardId === INVITE_BRAND_BOARD_ID,
          );
          console.log('zoeInvitationPurse:', zoeInvitationPurse);
          const sellerStatus = zoeInvitationPurse?.currentAmount?.value.some(
            (item) => {
              if (item.description === 'SellerAccess') return true;
              else return false;
            },
          );
          console.log('seller Status:', sellerStatus);
          dispatch(setIsSeller(sellerStatus));
          console.log(MONEY_ISSUER_BOARD_ID);
          console.log('newCardPurse', newCardPurse);
          dispatch(setTokenPurses(newTokenPurses));
          dispatch(setTokenDisplayInfo(newTokenPurses[0].displayInfo));
          dispatch(setTokenPetname(newTokenPurses[0].brandPetname));
          dispatch(setCardPurse(newCardPurse));
          dispatch(setCardPurseLoader(false));
          dispatch(setUserCards(newCardPurse?.currentAmount?.value));
          dispatch(
            setInvitationPurse(zoeInvitationPurse?.currentAmount?.value),
          );
        };

        async function watchPurses() {
          const pn = E(walletP).getPursesNotifier();
          for await (const purses of iterateNotifier(pn)) {
            processPurses(purses);
          }
        }
        watchPurses().catch((err) => console.error('got watchPurses err', err));

        async function watchMarketPlaceEvents() {
          for await (const availableOffers of iterateNotifier(
            availabeEventsNotifier,
          )) {
            console.log('In MarketPlace change in events:', availableOffers);
            dispatch(setEventCards(availableOffers || []));
          }
        }
        watchMarketPlaceEvents().catch((err) =>
          console.log('got watchMarketPlaceEvents errs', err),
        );
        async function watchWallerOffers() {
          const offerNotifier = E(walletP).getOffersNotifier();
          for await (const offers of iterateNotifier(offerNotifier)) {
            // await E(publicFacetMarketPlace).updateNotifier();
            console.log('wallet offers:');
            const selectedOffer = offers?.find((offer) => {
              console.log(
                'wallet offers:',
                offer.invitationDetails.description,
              );
              if (
                offer.invitationDetails.description === 'InitInvitationMaker' &&
                (offer.status === 'accept' || offer.status === 'complete')
              ) {
                return true;
              } else return false;
            });
            console.log('wallet offers:', selectedOffer?.id);
            if (selectedOffer) {
              dispatch(setPreviousOfferId(selectedOffer.id));
            }
            dispatch(setWalletOffers(offers || []));
          }
        }
        watchWallerOffers().catch((err) =>
          console.log('got watchWalletoffer err', err),
        );
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

  // useEffect(() => {
  //   console.log('isSeller2:', isSeller);
  //   if (!isSeller) return;
  //   (async () => {
  //     const minted = await E(publicFacetMarketPlace).getMinted();
  //     if (minted) return;
  //     const params = {
  //       walletP,
  //       cardBrand,
  //       tickets: availableCards,
  //       cardPursePetname: cardPurse?.pursePetname,
  //       tokenPursePetname: tokenPurses[0]?.pursePetname,
  //       marketPlaceContractInstance: marketPlaceInstanceForQuery,
  //       publicFacetMarketPlace,
  //       createEvent: false,
  //     };
  //     console.log('params:', params);
  //     await mintAndAddToSale(params);
  //   })();
  // }, [
  //   availableCards,
  //   marketPlaceInstanceForQuery,
  //   cardBrand,
  //   moneyBrand,
  //   cardPurse,
  //   tokenPurses,
  //   isSeller,
  // ]);
  return (
    <ApplicationContext.Provider
      value={{
        state,
        dispatch,
        walletP,
        cardBrand,
        marketPlaceInstanceForQuery,
        cardPursePetname: cardPurse?.pursePetname,
        tokenPursePetname: tokenPurses[0]?.pursePetname,
        publicFacetMarketPlace,
        CARD_BRAND_BOARD_ID,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
