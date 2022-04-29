// import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';

export const addToSale = async ({
  walletP,
  cardPursePetname,
  offerId,
  // cardBrand,
  sectionBags,
}) => {
  try {
    sectionBags.forEach((sectionInEvents) => {
      console.log('Section in event:', sectionInEvents);
      const totalPrice = sectionInEvents.length * sectionInEvents.ticketPrice;
      console.log('TotalPrice:', totalPrice);
      console.log('sectionInEvents:', sectionInEvents);
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
              value: sectionInEvents,
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

export const buyEventTickets = async ({
  activeCard,
  walletP,
  publicFacetMarketPlace,
  tokenPurses,
  cardPurse,
}) => {
  tokenPurses = tokenPurses.reverse();
  let invitation;
  try {
    invitation = await E(publicFacetMarketPlace).makeInvitation();
  } catch (e) {
    console.error('Could not make buyer invitation', e);
  }
  console.log('invitation Successful:', invitation);
  const id = Date.now();
  const proposalTemplate = {
    want: {
      Asset: {
        pursePetname: cardPurse.pursePetname,
        value: harden([activeCard]),
      },
    },
    give: {
      Price: {
        pursePetname: tokenPurses[0].pursePetname,
        value: BigInt(activeCard.ticketPrice) * 1000000n,
      },
    },
    exit: { onDemand: null },
  };
  const offerConfig = { id, invitation, proposalTemplate };
  try {
    await E(walletP).addOffer(offerConfig);
  } catch (e) {
    console.error('Could not add sell offer to wallet', e);
  }
  console.log('offerId:', id);
};
