import { E } from '@agoric/captp';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { addToSale } from '../services/addTicketsToSale';
import { mintTicketsWithOfferToWallet } from '../services/cardMint';

export const waitForOfferBeingAccepted = async ({ walletP, offerId }) => {
  const offerNotifier = E(walletP).getOffersNotifier();
  console.log('offerNotifier:', offerNotifier);
  try {
    for await (const offers of iterateNotifier(offerNotifier)) {
      for (const offer of offers) {
        if (offer.id === offerId && offer.status === 'accept') {
          return 'accepted';
        }
      }
    }
  } catch (err) {
    console.log('offers in application: error');
  }
  return 'not waiting';
};

export const handleInitialOffers = async (params) => {
  try {
    const minted = await E(params.publicFacetMarketPlace).getMinted();
    if (
      !(
        params.tickets.length > 0 &&
        !minted &&
        params.marketPlaceContractInstance &&
        params.cardBrand &&
        params.cardPursePetname &&
        params.walletP
      )
    )
      return;
    params.cardBrand = await params.cardBrand;
    await E(params.publicFacetMarketPlace).setMinted();
    if (minted) return;
    const { offerId, eventTickets, cardAmount } =
      await mintTicketsWithOfferToWallet(params);
    const result = await waitForOfferBeingAccepted({ offerId, ...params });
    console.log('result form waiting:', result);
    await addToSale({
      ...params,
      offerId,
      eventTickets,
      cardAmount,
    });
  } catch (err) {
    console.log('error in handleInitialOffers');
  }
};
