// import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

export const addToSale = async ({
  walletP,
  cardPursePetname,
  tokenPursePetname,
  offerId,
  sectionBags,
}) => {
  try {
    sectionBags.forEach(async (sectionInEvents) => {
      console.log('Section in event:', sectionInEvents);
      const totalPrice =
        sectionInEvents.length * sectionInEvents[0].ticketPrice;
      console.log('TotalPrice:', totalPrice);
      console.log('sectionInEvents:', sectionInEvents);
      const offer = {
        // JSONable ID for this offer.  This is scoped to the origin.
        id: uuidv4(),
        continuingInvitation: {
          priorOfferId: offerId,
          description: 'PutOnSale',
        },
        proposalTemplate: {
          want: {
            Price: {
              pursePetname: tokenPursePetname,
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
      offerId = await E(walletP).addOffer(offer);
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

export const mapSellingOffersToEvents = async (orders) => {
  const events = orders.sells.map((offer) => {
    // Consist of list of tickets in a section of an event
    const sectionBag = offer.proposal.give.Asset.value;
    return {
      eventId: sectionBag[0].eventId,
      sectionId: sectionBag[0].sectionId,
      sectionTickets: sectionBag,
      sellerSeat: offer.sellerSeat,
      ticketType: sectionBag[0].ticketType,
      ticketCount: sectionBag.length,
      ticketPrice: sectionBag[0].ticketPrice,
    };
  });
  const eventMap = {};
  events.forEach((offer) => {
    if (!Array.isArray(eventMap[offer.eventId])) eventMap[offer.eventId] = [];
    eventMap[offer.eventId].push(offer);
  });
  const eventList = Object.values(eventMap);
  const formatedEventList = eventList.map((event) => {
    let totalTicket = 0;
    event.forEach((section) => {
      totalTicket += section.ticketCount;
    });
    return {
      id: event[0].eventId,
      name: event[0].sectionTickets[0].name,
      date: event[0].sectionTickets[0].date,
      image: event[0].sectionTickets[0].image,
      ticketsSold: 0,
      ticketsCount: totalTicket,
      eventDetails: event,
    };
  });
  return formatedEventList;
};
