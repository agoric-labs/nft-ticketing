import { useApplicationContext } from '../context/Application';
import { buyEventTickets, mapSellingOffersToEvents } from './marketPlace';

const Main = () => {
  const {
    tokenPursePetname,
    walletP,
    cardPursePetname,
    state: { previousOfferId, activeCard },
  } = useApplicationContext();

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

  return { purchaseTickets, fetchEventsOnSale };
};

export default Main;
