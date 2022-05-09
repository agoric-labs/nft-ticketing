import { useApplicationContext } from '../context/Application';
import { mintTicketsWithOfferToWallet } from './cardMint';
import { burnCard } from './checkIn';
import { buyEventTickets, mapSellingOffersToEvents } from './marketPlace';

const Main = () => {
  const {
    tokenPursePetname,
    walletP,
    cardPursePetname,
    cardBrand,
    marketPlaceInstanceForQuery,
    state: { previousOfferId, activeCard },
  } = useApplicationContext();

  // const { cardBrand } = E(publicFacetMarketPlace).getItemsIssuer();
  const createNewEvent = async () => {
    console.log('params:', {
      walletP,
      cardPursePetname,
      marketPlaceContractInstance: marketPlaceInstanceForQuery,
      tickets: harden([activeCard]),
      cardBrand,
    });
    await mintTicketsWithOfferToWallet({
      walletP,
      cardPursePetname,
      marketPlaceContractInstance: marketPlaceInstanceForQuery,
      tickets: activeCard,
      cardBrand,
    });
  };
  const purchaseTickets = async () => {
    const numberOfTickets = activeCard.ticketCount;
    const totalPrice = activeCard.totalPrice;
    const ticketsInSection = activeCard.sectionTickets.slice(
      0,
      numberOfTickets,
    );
    console.log('BuyTicketParams:', [
      tokenPursePetname,
      walletP,
      previousOfferId,
      cardPursePetname,
      activeCard,
      totalPrice,
      ticketsInSection,
    ]);
    await buyEventTickets({
      tokenPursePetname,
      walletP,
      previousOfferId,
      cardPursePetname,
      ticketsInSection,
      totalPrice,
    });
  };

  const fetchEventsOnSale = async (sectionBags) => {
    await mapSellingOffersToEvents({ sectionBags });
  };

  const checkInCard = async () => {
    await burnCard({
      offerId: previousOfferId,
      walletP,
      cardPursePetname,
      tickets: activeCard,
    });
  };

  return { purchaseTickets, fetchEventsOnSale, createNewEvent, checkInCard };
};

export default Main;
