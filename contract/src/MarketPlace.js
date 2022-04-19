// @ts-check

import { Far } from '@endo/marshal';
import { E } from '@endo/eventual-send';
import { makeNotifierKit } from '@agoric/notifier';
import '@agoric/zoe/exported';
import {
  swap,
  satisfies,
  assertProposalShape,
  assertIssuerKeywords,
  depositToSeat,
} from '@agoric/zoe/src/contractSupport/index.js';
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
  await zcf.saveIssuer(cardIssuer, 'Asset');
  let sellSeats = [];
  let buySeats = [];
  let minted = false;
  // eslint-disable-next-line no-use-before-define
  const { notifier, updater } = makeNotifierKit(getBookOrders());
  const { notifier: availabeEventsNotifier, updater: updateAvailableEvents } =
    makeNotifierKit(tickets);
  function dropExit(p) {
    return {
      want: p.want,
      give: p.give,
    };
  }

  function flattenOrders(seats) {
    console.log('FlattenOrders-seats:', seats);
    const activeSeats = seats.filter((s) => !s.hasExited());
    return activeSeats.map((seat) => {
      return { sellerSeat: seat, proposal: dropExit(seat.getProposal()) };
    });
  }

  function getBookOrders() {
    return {
      buys: flattenOrders(buySeats),
      sells: flattenOrders(sellSeats),
    };
  }
  // Tell the notifier that there has been a change to the book orders
  function bookOrdersChanged() {
    updater.updateState(getBookOrders());
  }

  // If there's an existing offer that this offer is a match for, make the trade
  // and return the seat for the matched offer. If not, return undefined, so
  // the caller can know to add the new offer to the book.
  function swapIfCanTrade(offers, seat) {
    for (const offer of offers) {
      const satisfiedBy = (xSeat, ySeat) => {
        return satisfies(zcf, xSeat, ySeat.getCurrentAllocation());
      };
      if (satisfiedBy(offer, seat) && satisfiedBy(seat, offer)) {
        swap(zcf, seat, offer);
        // return handle to remove
        return offer;
      }
    }
    return undefined;
  }

  // try to swap offerHandle with one of the counterOffers. If it works, remove
  // the matching offer and return the remaining counterOffers. If there's no
  // matching offer, add the offerHandle to the coOffers, and return the
  // unmodified counterOfffers
  function swapIfCanTradeAndUpdateBook(counterOffers, coOffers, seat) {
    const offer = swapIfCanTrade(counterOffers, seat);

    if (offer) {
      // remove the matched offer.
      counterOffers = counterOffers.filter((value) => value !== offer);
    } else {
      // Save the order in the book
      coOffers.push(seat);
    }
    bookOrdersChanged();
    return counterOffers;
  }

  const sell = (seat) => {
    assertProposalShape(seat, {
      give: { Asset: null },
      want: { Price: null },
    });
    buySeats = swapIfCanTradeAndUpdateBook(buySeats, sellSeats, seat);
    return 'Order Added';
  };

  const buy = (seat) => {
    assertProposalShape(seat, {
      give: { Price: null },
      want: { Asset: null },
    });
    sellSeats = swapIfCanTradeAndUpdateBook(sellSeats, buySeats, seat);
    return zcf.makeInvitation(exchangeOfferHandler, 'sellOffer');
  };
  /** @type {OfferHandler} */
  const exchangeOfferHandler = (seat) => {
    console.log('Inside Exchange offer handler:', seat.getProposal());
    // Buy Order
    if (seat.getProposal().want.Asset) {
      console.log('running buy orders:', seat.getProposal());
      return buy(seat);
    }
    // Sell Order
    if (seat.getProposal().give.Asset) {
      console.log('running sell orders:', seat.getProposal());
      return sell(seat);
    }
    // Eject because the offer must be invalid
    throw seat.fail(
      new Error(`The proposal did not match either a buy or sell order.`),
    );
  };
  const creatorFacet = Far('creatorFacet', {
    // The creator of the instance can send invitations to anyone
    // they wish to.
    makeInvitation: () => zcf.makeInvitation(exchangeOfferHandler, 'sellOffer'),
  });
  const mintPayment = async (seat) => {
    if (minted) return 'Already minted';
    console.log('seat in mintPayment', seat);
    const proposal = await E(seat).getProposal();
    console.log('proposal', proposal.want.Asset.value);
    const amount = AmountMath.make(
      proposal.want.Asset.brand,
      proposal.want.Asset.value,
    );
    console.log('amount', amount);
    // Synchronously minting and allocating amount to seat.
    zcfMint.mintGains(harden({ Asset: amount }), seat);
    // Exit the seat so that the user can get a payout.
    seat.exit();
    return creatorFacet;
  };
  const creatorInvitation = zcf.makeInvitation(mintPayment, 'mint a payment');
  const publicFacet = Far('MarketPlacePublicFacet', {
    updateNotifier: bookOrdersChanged,
    getNotifier: () => notifier,
    getBookOrders,
    getAvailableEvents: () => ({
      availabeEventsNotifier,
      updateAvailableEvents,
    }),
    getItemsIssuer: () =>
      harden({
        cardIssuer,
        cardBrand,
      }),
    getMinted: () => minted,
    setMinted: () => {
      minted = true;
      console.log('creatorInvitation', creatorInvitation);
      return minted;
    },
  });
  bookOrdersChanged();
  return harden({ publicFacet, creatorFacet, creatorInvitation });
};

harden(start);
export { start };
