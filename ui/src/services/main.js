import { buyEventTicket } from './marketPlace';

const Main = (
  state,
  walletP,
  publicFacetMarketPlace,
  tokenPurses,
  cardPurse,
) => {
  const { activeCard } = state;
  const purchaseTickets = async () => {
    await buyEventTicket({
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
