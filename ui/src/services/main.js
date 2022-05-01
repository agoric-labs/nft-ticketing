import { buyEventTickets, mapSellingOffersToEvents } from './marketPlace';

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

  const fetchEventsOnSale = async (sectionBags) => {
    await mapSellingOffersToEvents({ sectionBags });
  };

  return { purchaseTickets, fetchEventsOnSale };
};

export default Main;
