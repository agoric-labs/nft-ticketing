import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

export const burnCard = async ({
  offerId,
  walletP,
  cardPursePetname,
  tickets,
}) => {
  console.log([offerId, walletP, cardPursePetname, tickets]);
  try {
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: uuidv4(),
      continuingInvitation: {
        priorOfferId: offerId,
        description: 'check in a ticket',
      },
      proposalTemplate: {
        give: {
          Asset: {
            pursePetname: cardPursePetname,
            value: harden([tickets]),
          },
        },
      }, // Tell the wallet that we're handling the offer result.
      // dappContext: true,
    };
    console.log('offer In CheckIn:', offer);
    offerId = await E(walletP).addOffer(offer);
  } catch (e) {
    console.log('error in Checking In Card:', e);
  }
};
