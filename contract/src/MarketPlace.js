// @ts-check

import { assert, details as X } from '@agoric/assert';
import { Far } from '@endo/marshal';
import { Nat } from '@agoric/nat';
import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';
import { makeNotifierKit, observeNotifier } from '@agoric/notifier';
import {
  // assertIssuerKeywords,
  defaultAcceptanceMsg,
  assertProposalShape,
  // assertNatAssetKind,
  offerTo,
} from '@agoric/zoe/src/contractSupport/index.js';
import { E } from '@endo/eventual-send';

/**
 * Sell items in exchange for money. Items may be fungible or
 * non-fungible and multiple items may be bought at once. Money must
 * be fungible.
 *
 * The `pricePerItem` is to be set in the terms. It is expected that all items
 * are sold for the same uniform price.
 *
 * The initial offer should be { give: { Items: items } }, accompanied by
 * terms as described above.
 * Buyers use offers that match { want: { Items: items } give: { Money: m } }.
 * The items provided should match particular items that the seller still has
 * available to sell, and the money should be pricePerItem times the number of
 * items requested.
 *
 * When all the items have been sold, the contract will terminate, triggering
 * the creator's payout. If the creator has an onDemand exit clause, they can
 * exit early to collect their winnings. The remaining items will still be
 * available for sale, but the creator won't be able to collect later earnings.
 *
 * @param {ZCF<{pricePerItem: Amount<'nat'>}>} zcf
 */
const start = (zcf) => {
  console.log('start');
  const {
    issuer: cardIssuer,
    mint: cardMint,
    brand: cardBrand,
  } = makeIssuerKit('ticket card', AssetKind.SET);
  const { issuers, brands } = zcf.getTerms();
  console.log('issuers', issuers);
  console.log('brands', brands);
  // const allKeywords = ['Items', 'Money'];
  // assertIssuerKeywords(zcf, harden(allKeywords));
  // assertNatAssetKind(zcf, pricePerItem.brand);

  let sellerSeat;

  const { notifier: availableItemsNotifier, updater: availableItemsUpdater } =
    makeNotifierKit();

  const sell = (seat) => {
    sellerSeat = seat;
    observeNotifier(
      sellerSeat.getNotifier(),
      harden({
        updateState: (sellerSeatAllocation) =>
          availableItemsUpdater.updateState(
            sellerSeatAllocation && sellerSeatAllocation.Items,
          ),
        finish: (sellerSeatAllocation) => {
          availableItemsUpdater.finish(
            sellerSeatAllocation && sellerSeatAllocation.Items,
          );
        },
        fail: (reason) => availableItemsUpdater.fail(reason),
      }),
    );
    return defaultAcceptanceMsg;
  };

  const getAvailableItems = () => {
    assert(sellerSeat && !sellerSeat.hasExited(), X`no items are for sale`);
    return sellerSeat.getAmountAllocated('Items');
  };

  const getAvailableItemsNotifier = () => availableItemsNotifier;

  const buy = (buyerSeat) => {
    assertProposalShape(buyerSeat, {
      want: { Items: null },
      give: { Money: null },
    });
    const currentItemsForSale = sellerSeat.getAmountAllocated('Items');
    const providedMoney = buyerSeat.getAmountAllocated('Money');

    const {
      want: { Items: wantedItems },
    } = buyerSeat.getProposal();

    // Check that the wanted items are still for sale.
    if (!AmountMath.isGTE(currentItemsForSale, wantedItems)) {
      const rejectMsg = `Some of the wanted items were not available for sale`;
      throw buyerSeat.fail(new Error(rejectMsg));
    }
    // All items are the same price.
    const totalCost = AmountMath.make(
      brands.Money,
      // pricePerItem.value * Nat(wantedItems.value.length),
      10n * Nat(wantedItems.value.length),
    );

    // Check that the money provided to pay for the items is greater than the totalCost.
    assert(
      AmountMath.isGTE(providedMoney, totalCost),
      X`More money (${totalCost}) is required to buy these items`,
    );

    // Reallocate.
    sellerSeat.incrementBy(
      buyerSeat.decrementBy(harden({ Money: providedMoney })),
    );
    buyerSeat.incrementBy(
      sellerSeat.decrementBy(harden({ Items: wantedItems })),
    );
    zcf.reallocate(buyerSeat, sellerSeat);

    // The buyer's offer has been processed.
    buyerSeat.exit();

    if (AmountMath.isEmpty(getAvailableItems())) {
      zcf.shutdown('All items sold.');
    }
    return defaultAcceptanceMsg;
  };

  const makeBuyerInvitation = () => {
    const itemsAmount = sellerSeat.getAmountAllocated('Items');
    assert(
      sellerSeat && !AmountMath.isEmpty(itemsAmount),
      X`no items are for sale`,
    );
    return zcf.makeInvitation(buy, 'buyer');
  };

  const addItemOnSale = async ({ tickets, invitation, moneyBrand }) => {
    console.log('creatorInvitation:', invitation);
    const moneyAmount = AmountMath.make(moneyBrand, 10n);
    const newCardsForSaleAmount = AmountMath.make(
      cardBrand,
      harden([tickets[0]]),
    );
    const CardForSalePayment = await E(cardMint).mintPayment(
      newCardsForSaleAmount,
    );
    console.log(CardForSalePayment);
    const proposal = {
      give: { Item: newCardsForSaleAmount }, // asset: 3 moola
      want: { Money: moneyAmount }, // price: 7 simoleans
    };
    console.log('ItemBrand', proposal.give.Item.brand);
    console.log('MoneyBrand', proposal.want.Money.brand);
    // const paymentKeywordRecord = harden({
    //   Item: CardForSalePayment,
    // });
    // console.log('paymentKeywordRecord', paymentKeywordRecord);
    const { userSeatPromise: sellerSeatP, deposited } = await offerTo(
      zcf,
      invitation,
      harden({
        Items: 'Asset',
        Money: 'Ask',
      }),
      proposal,
      sellerSeat,
      sellerSeat,
    );
    console.log('sellerSeatP', sellerSeatP);
    console.log('deposited', deposited);
  };

  const publicFacet = Far('SellItemsPublicFacet', {
    getAvailableItems,
    getAvailableItemsNotifier,
    getItemsIssuer: () =>
      harden({
        cardIssuer,
        cardBrand,
        cardMint,
      }),
    makeBuyerInvitation,
  });

  const creatorFacet = Far('SellItemsCreatorFacet', {
    makeBuyerInvitation,
    addItemOnSale,
    getAvailableItems: publicFacet.getAvailableItems,
    getItemsIssuer: publicFacet.getItemsIssuer,
  });

  const creatorInvitation = zcf.makeInvitation(sell, 'seller');

  return harden({ creatorFacet, creatorInvitation, publicFacet });
};

harden(start);
export { start };
