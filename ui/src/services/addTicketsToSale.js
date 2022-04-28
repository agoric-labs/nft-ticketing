import { E } from '@agoric/eventual-send';

export const addToSale = async ({
  walletP,
  cardPursePetname,
  offerId,
  cardAmount,
  MARKET_PLACE_INSTANCE_BOARD_ID,
  MARKET_PLACE_INSTALLATION_BOARD_ID,
}) => {
  try {
    console.log(walletP);
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),
      continuingInvitation: {
        priorOfferId: offerId,
        description: 'SellOffer',
      },
      installationHandleBoardId: MARKET_PLACE_INSTALLATION_BOARD_ID,
      instanceHandleBoardId: MARKET_PLACE_INSTANCE_BOARD_ID,
      proposalTemplate: {
        want: {
          Price: {
            pursePetname: 'Agoric RUN currency',
            value: 10n * 1000000n,
          },
        },
        give: {
          Asset: {
            pursePetname: cardPursePetname,
            value: cardAmount.value,
          },
        },
      }, // Tell the wallet that we're handling the offer result.
      // dappContext: true,
    };
    console.log('offer In add to Sale:', offer);
    offerId = await E(walletP).addOffer(offer);
    console.log('offerSucceeded', offerId);
  } catch (e) {
    console.log('error in continuingInvitation');
  }
};
