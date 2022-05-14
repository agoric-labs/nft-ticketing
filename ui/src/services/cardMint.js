import { AmountMath } from '@agoric/ertp';

import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

export const parseEventsToSeperateCards = (events) => {
  console.log('events:', events);
  const eventTickets = [];
  const sectionBags = [];
  events.forEach((event) => {
    const eventId = uuidv4();

    let obj = {
      ...event,
      eventId,
    };
    delete obj.ticketsCount;
    delete obj.ticketsSold;
    event.eventDetails.forEach((ticketType) => {
      obj = {
        ...obj,
        ...ticketType,
      };
      delete obj.eventDetails;
      const sectionInEvents = [];
      const sectionId = uuidv4();
      console.log(
        'Condition:',
        typeof ticketType.ticketCount === 'string'
          ? parseInt(ticketType.ticketCount, 10)
          : ticketType.ticketCount,
      );
      [
        ...Array(
          typeof ticketType.ticketCount === 'string'
            ? parseInt(ticketType.ticketCount, 10)
            : ticketType.ticketCount,
        ),
      ].forEach((_) => {
        const id = uuidv4();
        obj.id = id;
        obj = {
          ...obj,
          id: uuidv4(),
          sectionId,
        };
        delete obj.ticketCount;
        eventTickets.push(obj);
        sectionInEvents.push(obj);
      });
      sectionBags.push(sectionInEvents);
    });
  });
  return { eventTickets, sectionBags };
};

export const mintTicketsWithOfferToWallet = async ({
  walletP,
  cardBrand,
  tickets,
  cardPursePetname,
  marketPlaceContractInstance,
  createEvent,
  previousOfferId,
}) => {
  if (
    !walletP ||
    !cardBrand ||
    !tickets ||
    !cardPursePetname ||
    !marketPlaceContractInstance
  )
    return 'error due to missing params';
  let offerId = null;
  console.log('tickets:', tickets);
  const { eventTickets, sectionBags } = parseEventsToSeperateCards(tickets);
  console.log('sectionBags:', sectionBags, eventTickets);
  const newUserCardAmount = AmountMath.make(
    await cardBrand,
    harden(eventTickets),
  );
  try {
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),
      proposalTemplate: {
        want: {
          Token: {
            pursePetname: cardPursePetname,
            value: newUserCardAmount.value,
          },
        },
      },
    };
    if (createEvent) {
      offer.continuingInvitation = {
        priorOfferId: previousOfferId,
        description: 'MintPayment',
      };
    } else {
      offer.invitationQuery = {
        instance: marketPlaceContractInstance,
        description: 'MintPayment',
      };
    }
    console.log('offer in mint:', offer);
    offerId = await E(walletP).addOffer(offer);
    console.log('offerId:', offerId);
  } catch (err) {
    console.log('error in mintTicketsWithOfferToWallet:', err);
  }
  return { offerId, eventTickets, sectionBags, cardAmount: newUserCardAmount };
};

export const createNewEvent = async ({
  events,
  cardPursePetname,
  previousOfferId,
  walletP,
}) => {
  const offer = {
    // JSONable ID for this offer.  This is scoped to the origin.
    id: Date.now(),
    continuingInvitation: {
      priorOfferId: previousOfferId,
      description: 'CreateNewEvent',
    },
    proposalTemplate: {
      want: {
        Asset: {
          pursePetname: cardPursePetname,
          value: events,
        },
      },
    },
  };
  console.log('offer:', offer);
  console.log('walletP:', walletP);
  const offerId = await E(walletP).addOffer(offer);
  return offerId;
};
