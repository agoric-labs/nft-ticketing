import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import 'json5';
// import 'utils/installSESLockdown';

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
  // setCardPurse,
  // setTokenDisplayInfo,
  // setTokenPetname,
  // setTokenPurses,
  // setUserNfts,
  // setUserOffers,
  // setUserCards,
  // setPendingOffers,
} from '../store/store';

const {
  MARKET_PLACE_INSTANCE_BOARD_ID,
  MARKET_PLACE_INSTALLATION_BOARD_ID,
  issuerBoardIds: { Card: CARD_ISSUER_BOARD_ID },
  brandBoardIds: { Money: MONEY_BRAND_BOARD_ID, Card: CARD_BRAND_BOARD_ID },
} = dappConstants;
console.log(MONEY_BRAND_BOARD_ID);
/* eslint-disable */
let walletP;
let publicFacetMarketPlace;
/* eslint-enable */

export { walletP, publicFacetMarketPlace };

export const ApplicationContext = createContext();

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

/* eslint-disable complexity, react/prop-types */
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  // const { availableCards } = state;
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
      walletP = getBootstrap();
      const zoe = E(walletP).getZoe();
      const board = E(walletP).getBoard();
      console.log(
        'MARKET_PLACE_INSTANCE_BOARD_ID',
        MARKET_PLACE_INSTANCE_BOARD_ID.toString(),
      );
      const marketPlaceContractInstance = await E(board).getValue(
        MARKET_PLACE_INSTANCE_BOARD_ID,
      );
      publicFacetMarketPlace = await E(zoe).getPublicFacet(
        marketPlaceContractInstance,
      );
      const { value: marketPlaceEvents } = await E(
        publicFacetMarketPlace,
      ).getAvailableOffers();
      dispatch(setAvailableCards(marketPlaceEvents || []));

      console.log('facet', publicFacetMarketPlace);
      // const processPurses = (purses) => {
      //   const newTokenPurses = purses.filter(
      //     ({ brandBoardId }) => brandBoardId === MONEY_BRAND_BOARD_ID,
      //   );
      //   const newCardPurse = purses.find(
      //     ({ brandBoardId }) => brandBoardId === CARD_BRAND_BOARD_ID,
      //   );

      //   dispatch(setTokenPurses(newTokenPurses));
      //   dispatch(setTokenDisplayInfo(newTokenPurses[0].displayInfo));
      //   dispatch(setTokenPetname(newTokenPurses[0].brandPetname));
      //   dispatch(setCardPurse(newCardPurse));
      //   dispatch(setUserCards(newCardPurse?.currentAmount?.value));
      //   console.log('printing card purse:', newCardPurse);
      //   console.log('printing all cards:', availableCards);
      // };

      // async function watchPurses() {
      //   const pn = E(walletP).getPursesNotifier();
      //   for await (const purses of iterateNotifier(pn)) {
      //     processPurses(purses);
      //   }
      // }
      // watchPurses().catch((err) => console.error('got watchPurses err', err));
      // async function watchWallerOffers() {
      //   const offerNotifier = E(walletP).getOffersNotifier();
      //   try {
      //     for await (const offers of iterateNotifier(offerNotifier)) {
      //       let pendingOffersArray = offers.filter((offer) => {
      //         if (offer.status === 'pending') {
      //           if (offer?.proposalTemplate?.give?.Asset) {
      //             return true;
      //           }
      //         }
      //         return false;
      //       });
      //       pendingOffersArray = pendingOffersArray?.map(
      //         (offer) => offer?.proposalTemplate?.give?.Asset?.value[0],
      //       );
      //       dispatch(setPendingOffers(pendingOffersArray));
      //     }
      //   } catch (err) {
      //     console.log('offers in application: error');
      //   }
      // }
      // watchWallerOffers().catch((err) =>
      //   console.error('got watchWalletoffer err', err),
      // );
      try {
        // const installationBoardId = MARKET_PLACE_INSTALLATION_BOARD_ID;
        // // const INSTANCE_BOARD_ID = MARKET_PLACE_INSTALLATION_BOARD_ID;
        // console.log('walletp', walletP);
        // await E(walletP).suggestInstallation(
        //   'Installation',
        //   installationBoardId,
        // );
        // console.log('suggestion 1');
        // await E(walletP).suggestInstance(
        //   'Instance',
        //   MARKET_PLACE_INSTANCE_BOARD_ID,
        // );
        // console.log('suggestion 2');
        // await E(walletP).suggestIssuer('Ticket', CARD_ISSUER_BOARD_ID);
        // console.log('suggestion 3');
        await Promise.all([
          E(walletP).suggestInstallation(
            'Installation',
            MARKET_PLACE_INSTALLATION_BOARD_ID,
          ),
          E(walletP).suggestInstance(
            'Instance',
            MARKET_PLACE_INSTANCE_BOARD_ID,
          ),
          E(walletP).suggestIssuer('Event Ticket', CARD_ISSUER_BOARD_ID),
        ]);
      } catch (error) {
        console.log('error in promise all:', error);
      }

      async function watchOffers() {
        const availableOfferNotifier = await E(
          publicFacetMarketPlace,
        ).getAvailableOfferNotifier();

        for await (const availableOffers of iterateNotifier(
          availableOfferNotifier,
        )) {
          console.log('In MarketPlace', availableOffers.value);
          dispatch(setAvailableCards(availableOffers.value || []));
        }
      }
      watchOffers().catch((err) => console.log('got watchOffer errs', err));
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
