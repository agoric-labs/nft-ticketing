import { E } from '@agoric/eventual-send';
/*
 * This function should be called when the user puts a card
 * which he own on sale in the secondary marketplace
 */
const getSellerSeat = async ({
  cardOffer,
  cardDetail,
  sellingPrice,
  publicFacet,
  publicFacetMarketPlace,
  cardPurse,
  tokenPurses,
  walletP,
  setLoading,
  onClose,
  dispatch,
}) => {
  let invitation;
  try {
    invitation = await E(publicFacetMarketPlace).makeInvitation();
  } catch (e) {
    console.error('Could not make seller invitation', e);
  }
  console.log('cardDetail in app:', cardDetail);
  const id = Date.now();
  const proposalTemplate = {
    give: {
      Asset: {
        pursePetname: cardPurse.pursePetname,
        value: harden([cardDetail]),
      },
    },
    want: {
      Price: {
        pursePetname: tokenPurses[0].pursePetname,
        value: sellingPrice,
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
};

export { getSellerSeat };
