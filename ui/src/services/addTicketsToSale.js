import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';

export const addToSale = async ({
  walletP,
  cardPursePetname,
  offerId,
  cardBrand,
  sectionBags,
}) => {
  try {
    sectionBags.forEach((sectionInEvents) => {
      let totalPrice = 0;
      sectionInEvents.forEach((ticket) => {
        totalPrice = ticket.ticketCount * ticket.ticketPrice;
      });
      console.log(totalPrice);
      const cardAmount = AmountMath.make(cardBrand, harden(sectionInEvents));
      const offer = {
        // JSONable ID for this offer.  This is scoped to the origin.
        id: Date.now(),
        continuingInvitation: {
          priorOfferId: offerId,
          description: 'PutOnSale',
        },
        proposalTemplate: {
          want: {
            Price: {
              pursePetname: 'Agoric RUN currency',
              value: BigInt(totalPrice) * 1000000n,
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
      offerId = E(walletP).addOffer(offer);
    });
  } catch (e) {
    console.log('error in continuingInvitation:', e);
  }
};
