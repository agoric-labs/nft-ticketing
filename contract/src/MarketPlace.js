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
  // let sellSeats = [];
  // let buySeats = [];
  // let minted = false;
  // let isSeller = false;
  let events = [...tickets];
  // eslint-disable-next-line no-use-before-define
  // const { notifier, updater } = makeNotifierKit(getBookOrders());
  const { notifier: availabeEventsNotifier, updater: updateAvailableEvents } =
    makeNotifierKit(events);
  // function dropExit(p) {
  //   return {
  //     want: p.want,
  //     give: p.give,
  //   };
  // }
  // function parseAllocation(a) {
  //   return {
  //     Asset: a.Asset,
  //     Price: a.Price,
  //   };
  // }

  // function flattenOrders(seats) {
  //   console.log('FlattenOrders-seats:', seats);
  //   const activeSeats = seats.filter((s) => !s.hasExited());
  //   return activeSeats.map((seat) => {
  //     return {
  //       sellerSeat: seat,
  //       proposal: dropExit(seat.getProposal()),
  //       currentAllocation: parseAllocation(seat.getCurrentAllocation()),
  //       getStagedAllocation: parseAllocation(seat.getStagedAllocation()),
  //     };
  //   });
  // }

  // function getBookOrders() {
  //   return {
  //     buys: flattenOrders(buySeats),
  //     sells: flattenOrders(sellSeats),
  //   };
  // }
  // Tell the notifier that there has been a change to the book orders
  // function bookOrdersChanged() {
  //   updater.updateState(getBookOrders());
  // }

  // If there's an existing offer that this offer is a match for, make the trade
  // and return the seat for the matched offer. If not, return undefined, so
  // the caller can know to add the new offer to the book.
  // const swap = (leftSeat, rightSeat) => {
  //   console.log(
  //     'In swap seat:',
  //     rightSeat.getProposal(),
  //     // This is Buyer seat
  //     leftSeat.getProposal(),
  //     // This is Seller seat
  //   );
  //   try {
  //     rightSeat.decrementBy(harden(rightSeat.getProposal().give));
  //     leftSeat.incrementBy(harden(leftSeat.getProposal().want));
  //     leftSeat.decrementBy(harden(rightSeat.getProposal().want));
  //     rightSeat.incrementBy(harden(rightSeat.getProposal().want));
  //     zcf.reallocate(leftSeat, rightSeat);
  //   } catch (err) {
  //     leftSeat.fail(err);
  //     rightSeat.fail(err);
  //     throw err;
  //   }
  //   // leftSeat.exit();
  //   rightSeat.exit();
  //   return `The offer has been accepted. Once the contract has been completed, please check your payout`;
  // };

  // function swapIfCanTrade(offers, seat) {
  //   console.log('running swapIfCanTrade', offers, seat);
  //   const compareSeats = (xSeat, ySeat) => {
  //     console.log('Inside Compare seats:', xSeat, ySeat);
  //     const xHasExited = xSeat.hasExited();
  //     const yHasExited = xSeat.hasExited();
  //     console.log('xHasExited:', xHasExited);
  //     console.log('yHasExited:', yHasExited);
  //     if (xHasExited && yHasExited) return false;
  //     const xAllocation = xSeat.getCurrentAllocation();
  //     const yAllocation = ySeat.getCurrentAllocation();
  //     const xProposal = xSeat.getProposal();
  //     const yProposal = ySeat.getProposal();
  //     console.log('xAllocation', xAllocation);
  //     console.log('yAllocation', yAllocation);
  //     console.log('xProposal', xProposal);
  //     console.log('yProposal', yProposal);
  //     const ticketIds = xAllocation?.Asset?.value?.map((item) => item.id);
  //     console.log('ticketIds:', ticketIds);
  //     const assetsMatch = yProposal?.want?.Asset?.value.every((item) =>
  //       ticketIds.includes(item.id),
  //     );
  //     // const yPrice = yProposal?.give?.Price?.value;
  //     // const xPrice = xProposal?.want?.Price?.value;
  //     console.log('Assets Match:', assetsMatch);
  //     // console.log('Price Match:', xPrice >= yPrice);
  //     if (assetsMatch) {
  //       return true;
  //     }
  //     return false;
  //     // return (
  //     //   satisfies(zcf, xSeat, ySeat.getCurrentAllocation()) &&
  //     //   satisfies(zcf, ySeat, xSeat.getCurrentAllocation())
  //     // );
  //   };
  //   try {
  //     for (const offer of offers) {
  //       // if (satisfiedBy(offer, seat) && satisfiedBy(seat, offer)) {
  //       if (compareSeats(offer, seat)) {
  //         swap(offer, seat);
  //         // return handle to remove
  //         return offer;
  //       }
  //     }
  //   } catch (e) {
  //     console.log('error in compareSeats', e);
  //   }
  //   return undefined;
  // }

  // try to swap offerHandle with one of the counterOffers. If it works, remove
  // the matching offer and return the remaining counterOffers. If there's no
  // matching offer, add the offerHandle to the coOffers, and return the
  // unmodified counterOfffers
  // function swapIfCanTradeAndUpdateBook(counterOffers, coOffers, seat) {
  //   console.log('In swapIfCanTradeAndUpdateBook');
  //   const offer = swapIfCanTrade(counterOffers, seat);
  //   console.log('offer Result:', offer);
  //   if (offer) {
  //     // remove the matched offer.
  //     counterOffers = counterOffers.filter((value) => value !== offer);
  //   } else {
  //     // Save the order in the book
  //     coOffers.push(seat);
  //   }
  //   bookOrdersChanged();
  //   return counterOffers;
  // }

  // const sell = (seat) => {
  //   assertProposalShape(seat, {
  //     give: { Asset: null },
  //   });
  //   buySeats = swapIfCanTradeAndUpdateBook(buySeats, sellSeats, seat);
  //   return 'Order Added';
  // };
  // const buy = (seat) => {
  //   assertProposalShape(seat, {
  //     give: { Price: null },
  //     want: { Asset: null },
  //   });
  //   sellSeats = swapIfCanTradeAndUpdateBook(sellSeats, buySeats, seat);
  //   return 'Order Added';
  // };
  /** @type {OfferHandler} */
  const exchangeOfferHandler = async (seat) => {
    try {
      console.log('Inside Exchange offer handler:', seat.getProposal());
      // Buy Order
      if (seat.getProposal().want.Asset) {
        console.log('running buy orders:', seat.getProposal());
        const proposal = seat.getProposal();
        console.log('proposal', proposal.want.Asset.value);
        const amount = AmountMath.make(
          proposal.want.Asset.brand,
          proposal.want.Asset.value,
        );
        console.log('Amount:', amount);
        console.log('brands Match:', amount.brand === cardBrand);
        // Synchronously minting and allocating amount to seat.
        zcfMint.mintGains(harden({ Asset: amount }), seat);

        // Exit the seat so that the user can get a payout.
        // seat.exit();
        const currentAllocation = seat.getCurrentAllocation();
        console.log('currentAllocation:', currentAllocation);
        console.log('Amount being paid:', seat.getProposal().give);
        seat.decrementBy(harden(seat.getProposal().give));
        console.log('successfully decremented');
        sellerSeat.incrementBy(harden(seat.getProposal().give));
        console.log('successfully incremented');
        zcf.reallocate(seat, sellerSeat);
        console.log('buyerAllocation:', seat.getCurrentAllocation());
        console.log('sellerAllocation:', sellerSeat.getCurrentAllocation());
        seat.exit();
        const eventId = amount.value[0].eventId;
        const ticketSoldCount = amount.value?.length;
        console.log('tickets on Sale:', events);
        const eventIndex = events.findIndex((event) => event.id === eventId);
        console.log('eventIndex', eventIndex);
        console.log('sectionIndex:', amount.value[0].sectionIndex);
        console.log(events[eventIndex].ticketsSold);
        const updatedEvents = events.map((event, i) => {
          if (i === eventIndex) {
            const obj = {
              ...event,
              ticketsSold: event.ticketsSold + ticketSoldCount,
            };
            const eventDetails = event.eventDetails.map((section, i) => {
              if (i === amount.value[0].sectionIndex) {
                return {
                  ...section,
                  ticketSold: section.ticketSold + ticketSoldCount,
                };
              } else return section;
            });
            return { ...obj, eventDetails };
          } else return event;
        });
        console.log('updated events:', updatedEvents);
        events = updatedEvents;
        updateAvailableEvents.updateState(updatedEvents);
      }
    } catch (e) {
      console.log('error:', e);
    }
  };
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can send invitations to anyone
    // they wish to.
    makeInvitation: () =>
      zcf.makeInvitation(exchangeOfferHandler, 'SellOffers'),
    // setIsSeller: () => {
    //   isSeller = true;
    // },
  });

  // const invitationMakers = Far('invitation makers', {
  //   MarketPlaceOffer: () =>
  //     zcf.makeInvitation(exchangeOfferHandler, 'MarketPlaceOffer'),
  //   CheckInTicket: () => zcf.makeInvitation(checkInTicket, 'CheckInTicket'),
  // });

  // /** @type {OfferHandler} */
  // const getInvitationMaker = (seat) => {
  //   seat.exit();
  //   return invitationMakers;
  // };

  // const mintPayment = async (seat) => {
  //   console.log('seat in mintPayment', seat);
  //   const proposal = await E(seat).getProposal();
  //   console.log('proposal', proposal.want.Token.value);
  //   const amount = AmountMath.make(
  //     proposal.want.Token.brand,
  //     proposal.want.Token.value,
  //   );
  //   // Synchronously minting and allocating amount to seat.
  //   zcfMint.mintGains(harden({ Token: amount }), seat);
  //   // Exit the seat so that the user can get a payout.
  //   seat.exit();
  //   return harden({ invitationMakers });
  // };
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
  const invitationMakers = Far('invitation makers', {
    MarketPlaceOffer: () =>
      zcf.makeInvitation(exchangeOfferHandler, 'MarketPlaceOffer'),
    CheckInTicket: () => zcf.makeInvitation(checkInTicket, 'CheckInTicket'),
    createNewEvent: () => zcf.makeInvitation(createNewEvent, 'createNewEvent'),
  });
  /** @type {OfferHandler} */
  const createNewEvent = async (seat) => {
    const proposal = await E(seat).getProposal();
    console.log('proposal:', proposal);
    seat.exit();
    return harden({ invitationMakers });
  };
  const creatorInvitation = zcf.makeInvitation(
    createNewEvent,
    'createNewEvent',
  );
  const publicFacet = Far('MarketPlacePublicFacet', {
    // updateNotifier: bookOrdersChanged,
    // getNotifier: () => notifier,
    // getBookOrders,
    // getInvitationMakerInvitation: () =>
    //   zcf.makeInvitation(getInvitationMaker, 'handShakeOffer'),
    getAvailableEvents: () => ({
      events,
      availabeEventsNotifier,
    }),
    getItemsIssuer: () =>
      harden({
        cardIssuer,
        cardBrand,
      }),
    // getMinted: () => minted,
    // setMinted: () => {
    //   if (!isSeller) return 'Access denied';
    //   minted = true;
    //   return minted;
    // },
    // isSeller: () => isSeller,
  });
  // bookOrdersChanged();
  return harden({ publicFacet, creatorFacet, creatorInvitation });
};

harden(start);
export { start };
