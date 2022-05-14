/* eslint-disable no-use-before-define */
// @ts-check

import { Far } from '@endo/marshal';
import { E } from '@endo/eventual-send';
import { makeNotifierKit } from '@agoric/notifier';
import '@agoric/zoe/exported';
import { assertProposalShape } from '@agoric/zoe/src/contractSupport/index.js';
import { AmountMath, AssetKind } from '@agoric/ertp';

/**
 * SimpleExchange is an exchange with a simple matching algorithm, which allows
 * an unlimited number of parties to create new orders or accept existing
 * orders. The notifier allows callers to find the current list of orders.
 * https://agoric.com/documentation/zoe/guide/contracts/simple-exchange.html
 *
 * The SimpleExchange uses Asset and Price as its keywords. The contract treats
 * the two keywords symmetrically. New offers can be created and existing offers
 * can be accepted in either direction.
 *
 * { give: { 'Asset', simoleans(5n) }, want: { 'Price', quatloos(3) } }
 * { give: { 'Price', quatloos(8) }, want: { 'Asset', simoleans(3n) } }
 *
 * The Asset is treated as an exact amount to be exchanged, while the
 * Price is a limit that may be improved on. This simple exchange does
 * not partially fill orders.
 *
 * The publicFacet is returned from the contract.
 *
 * @param {ZCF} zcf
 */
const start = async (zcf) => {
  const zcfMint = await zcf.makeZCFMint('TicketCard', AssetKind.SET);
  const { issuer: cardIssuer, brand: cardBrand } =
    await zcfMint.getIssuerRecord();

  const { tickets } = zcf.getTerms();
  const { zcfSeat: sellerSeat } = zcf.makeEmptySeatKit();
  await zcf.saveIssuer(cardIssuer, 'Asset');
  let events = [...tickets];
  // eslint-disable-next-line no-use-before-define
  const { notifier: availabeEventsNotifier, updater: updateAvailableEvents } =
    makeNotifierKit(events);

  const getUpdatedEvents = ({
    eventIndex,
    sectionIndex,
    ticketBoughtCount,
  }) => {
    const updatedEvents = events.map((event, i) => {
      if (i === eventIndex) {
        // Updating ticketsSold for whole event
        const obj = {
          ...event,
          ticketsSold: event.ticketsSold + ticketBoughtCount,
        };
        let eventDetails;
        if (
          ticketBoughtCount ===
          event.eventDetails[sectionIndex].ticketCount -
            event.eventDetails[sectionIndex].ticketSold
        ) {
          // Case if whole section in event is bought so remove section from event
          eventDetails = event.eventDetails.filter(
            (section, i) => i !== sectionIndex,
          );
        } else {
          // Case if few tickets from a section in event are bought.So update ticket Sold.
          eventDetails = event.eventDetails.map((section, i) => {
            if (i === sectionIndex) {
              return {
                ...section,
                ticketSold: section.ticketSold + ticketBoughtCount,
              };
            } else {
              return section;
            }
          });
        }
        return { ...obj, eventDetails };
      } else return event;
    });
    if (
      updatedEvents[eventIndex].ticketsSold ===
      updatedEvents[eventIndex].ticketsCount
    )
      updatedEvents.splice(eventIndex, 1);
    console.log('updated events:', updatedEvents);
    events = updatedEvents;
    return updatedEvents;
  };
  const checkOfferSaftey = (seat) => {
    try {
      const Asset = seat.getProposal().want.Asset;
      const ticket = Asset.value[0];
      const ticketBoughtCount = Asset.value?.length;
      const eventId = ticket.eventId;
      const sectionIndex = ticket.sectionIndex;
      const eventIndex = events.findIndex((event) => event.id === eventId);

      const ticketsLeftInSelectedSection =
        events[eventIndex].ticketsCount - events[eventIndex].ticketsSold;
      if (ticketBoughtCount > ticketsLeftInSelectedSection)
        throw seat.fail(Error('offer is Invalid'));
      return { eventIndex, sectionIndex, ticketBoughtCount };
    } catch (e) {
      throw seat.fail(Error('offer is Invalid'));
    }
  };

  const swapAllocations = async (seat) => {
    try {
      console.log('running buy orders:', seat.getProposal());
      const proposal = seat.getProposal();
      const amount = AmountMath.make(
        proposal.want.Asset.brand,
        proposal.want.Asset.value,
      );
      console.log('Amount:', amount);
      // Synchronously minting and allocating amount to seat.
      zcfMint.mintGains(harden({ Asset: amount }), seat);
      // Recieveing price allocation from buyer
      seat.decrementBy(harden(seat.getProposal().give));
      // add recieved payent allocation from buyer to seller seat
      sellerSeat.incrementBy(harden(seat.getProposal().give));
      // To commit all the staged Allocation and reallocate them to currect Allocation
      zcf.reallocate(seat, sellerSeat);
      // Exit Buyers Seat
      seat.exit();
    } catch (e) {
      throw seat.fail(Error('Error in swapping Allocations'));
    }
  };
  /** @type {OfferHandler} */
  const exchangeOfferHandler = async (seat) => {
    try {
      console.log('Inside Exchange offer handler:', seat.getProposal());
      // Buy Order
      if (seat.getProposal().want.Asset) {
        const params = checkOfferSaftey(seat);
        await swapAllocations(seat);
        updateAvailableEvents.updateState(getUpdatedEvents(params));
      } else throw seat.fail(Error('offer is Invalid'));
    } catch (e) {
      console.log('error in exchangeOfferHandler:', e);
      throw seat.fail(Error('error in exchangeOfferHandler'));
    }
  };
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can send invitations to anyone
    // they wish to.
    makeInvitation: () =>
      zcf.makeInvitation(exchangeOfferHandler, 'SellOffers'),
  });

  /** @type {OfferHandler} */
  const checkInTicket = async (seat) => {
    const proposal = await E(seat).getProposal();
    const currentAllocation = await E(seat).getCurrentAllocation();
    console.log('proposal:', proposal, currentAllocation);
    const amount = AmountMath.make(cardBrand, proposal.give.Asset.value);
    console.log('amount:', amount);
    zcfMint.burnLosses(harden({ Asset: amount }), seat);
    seat.exit();
  };
  /** @type {OfferHandler} */
  const createNewEvent = async (seat) => {
    try {
      if (seat.getProposal().want.Asset) {
        const Asset = seat.getProposal().want.Asset;
        console.log('Asset:', Asset);
        console.log('Asset.value:', Asset.value);
        console.log('Asset.value[0]:', Asset.value[0]);
        const newEvent = Asset.value[0];
        console.log('newEvent:', newEvent);
        console.log('events:', events);
        const updatedEvent = events.map((event) => event);
        console.log('updatedEvents:', updatedEvent);
        events = updatedEvent;
        updatedEvent.push(newEvent);
        updateAvailableEvents.updateState(updatedEvent);
        seat.exit();
      } else {
        throw seat.fail(Error('error proposal not valid'));
      }
    } catch (e) {
      throw seat.fail(Error('error in createNewEvent'));
    }
  };
  const invitationMakers = Far('invitation makers', {
    MarketPlaceOffer: () =>
      zcf.makeInvitation(exchangeOfferHandler, 'MarketPlaceOffer'),
    CheckInTicket: () => zcf.makeInvitation(checkInTicket, 'CheckInTicket'),
    CreateNewEvent: () => zcf.makeInvitation(createNewEvent, 'CreateNewEvent'),
  });

  /** @type {OfferHandler} */
  const InitInvitationMaker = async (seat) => {
    const proposal = await E(seat).getProposal();
    console.log('proposal:', proposal);
    seat.exit();
    return harden({ invitationMakers });
  };
  const creatorInvitation = zcf.makeInvitation(
    InitInvitationMaker,
    'InitInvitationMaker',
  );
  const publicFacet = Far('MarketPlacePublicFacet', {
    getAvailableEvents: () => ({
      events,
      availabeEventsNotifier,
    }),
    getItemsIssuer: () =>
      harden({
        cardIssuer,
        cardBrand,
      }),
  });
  return harden({ publicFacet, creatorFacet, creatorInvitation });
};

harden(start);
export { start };
