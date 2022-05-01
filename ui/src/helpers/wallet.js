import { E } from '@agoric/captp';
// import { AmountMath } from '@agoric/ertp';
import { makeAsyncIterableFromNotifier as iterateNotifier } from '@agoric/notifier';
import { addToSale } from '../services/marketPlace.js';
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
    if (
      !(
        params?.tickets.length > 0 &&
        params?.marketPlaceContractInstance &&
        params?.cardBrand &&
        params?.cardPursePetname &&
        params?.walletP
      )
    )
      return;
    const minted = await E(params.publicFacetMarketPlace).getMinted();
    await E(params.publicFacetMarketPlace).setMinted();
    console.log('Is minted:', minted);
    if (minted) return;
    params.cardBrand = await params.cardBrand;
    console.log('Running mintTicketsWithOfferToWallet');
    const { offerId, eventTickets, sectionBags } =
      await mintTicketsWithOfferToWallet(params);
    console.log(eventTickets);
    const result = await waitForOfferBeingAccepted({ offerId, ...params });
    console.log('result form waiting:', result);
    await addToSale({
      ...params,
      offerId,
      sectionBags,
    });
    console.log('add to sale successful');
  } catch (err) {
    console.log('error in handleInitialOffers');
  }
};
