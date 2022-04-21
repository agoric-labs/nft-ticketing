import { E } from '@agoric/eventual-send';
import { mintTicketsWithOfferToWallet } from '../services/cardMint';

export const waitForOfferBeingAccepted = ({}) => {};

export const handleInitialMintingOffer = async (params) => {
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

  const offerId = await mintTicketsWithOfferToWallet(params);
  console.log('mintTicketsWithOfferToWallet', offerId);
  // await waitForOfferBeingAccepted({ offerId, ...params });
};
