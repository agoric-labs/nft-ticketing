import { buyEventTickets } from './marketPlace';

const Main = (
  activeCard,
  walletP,
  publicFacetMarketPlace,
  tokenPurses,
  cardPurse,
) => {
  // const { activeCard } = state;
  const purchaseTickets = async () => {
    await buyEventTickets({
      activeCard,
      walletP,
      publicFacetMarketPlace,
      tokenPurses,
      cardPurse,
    });
  };

  return { purchaseTickets };
};

export default Main;
