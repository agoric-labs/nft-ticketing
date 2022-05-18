import { v4 as uuidv4 } from 'uuid';
import { useApplicationContext } from '../context/Application';
import { waitForOfferBeingAccepted } from '../helpers/wallet';
// import { mintAndAddToSale } from '../helpers/wallet';
import { createNewEvent } from './cardMint';
import { burnCard } from './checkIn';
import { buyEventTickets, mapSellingOffersToEvents } from './marketPlace';

const Main = () => {
  const {
    tokenPursePetname,
    walletP,
    cardPursePetname,
    // cardBrand,
    // marketPlaceInstanceForQuery,
    publicFacetMarketPlace,
    state: { previousOfferId, activeCard },
  } = useApplicationContext();

  // const { cardBrand } = E(publicFacetMarketPlace).getItemsIssuer();
  // const createNewEvent = async () => {
  //   console.log('params:', {
  //     walletP,
  //     cardPursePetname,
  //     marketPlaceContractInstance: marketPlaceInstanceForQuery,
  //     tickets: harden([activeCard]),
  //     cardBrand,
  //   });
  //   await mintAndAddToSale({
  //     walletP,
  //     cardPursePetname,
  //     tokenPursePetname,
  //     marketPlaceContractInstance: marketPlaceInstanceForQuery,
  //     tickets: harden([activeCard]),
  //     cardBrand,
  //     createEvent: true,
  //     publicFacetMarketPlace,
  //     previousOfferId,
  //   });
  // };
  const purchaseTickets = async () => {
    const numberOfTickets = activeCard.ticketCount;
    const totalPrice = activeCard.totalPrice;
    const tickets = Array(numberOfTickets)
      .fill(0)
      .map((_) => {
        return { id: uuidv4(), ...activeCard };
      });
    console.log('ticket in purchase:', tickets);
    console.log('BuyTicketParams:', [
      tokenPursePetname,
      walletP,
      previousOfferId,
      cardPursePetname,
      activeCard,
      totalPrice,
    ]);
    await buyEventTickets({
      publicFacetMarketPlace,
      tokenPursePetname,
      walletP,
      previousOfferId,
      cardPursePetname,
      ticketsInSection: tickets,
      totalPrice,
    });
  };

  const fetchEventsOnSale = async (sectionBags) => {
    await mapSellingOffersToEvents({ sectionBags });
  };

  const checkInCard = async () => {
    await burnCard({
      publicFacetMarketPlace,
      offerId: previousOfferId,
      walletP,
      cardPursePetname,
      tickets: activeCard,
    });
  };
  const createEvent = async () => {
    const events = harden([activeCard]);
    const offerId = await createNewEvent({
      events,
      cardPursePetname,
      previousOfferId,
      walletP,
    });
    await waitForOfferBeingAccepted({ walletP, offerId });
  };

  return {
    purchaseTickets,
    fetchEventsOnSale,
    createNewEvent,
    checkInCard,
    createEvent,
  };
};

export default Main;
