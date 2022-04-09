import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

const parseEventsToSeperateCards = (tickets) => {
  const eventTickets = [];
  tickets.forEach((event) => {
    delete event.ticketsCount;
    delete event.ticketsSold;
    event.eventDetails.forEach((ticketType) => {
      let obj = {
        ...event,
        ...ticketType,
      };
      delete obj.eventDetails;
      [...Array(ticketType.ticketCount)].forEach((_) => {
        const id = uuidv4();
        obj.id = id;
        obj = {
          ...obj,
          id: uuidv4(),
        };
        delete obj.ticketCount;
        eventTickets.push(obj);
      });
    });
  });
  return eventTickets;
};

export const mintTickets = async ({
  wallet,
  cardBrand,
  cardMinter,
  tickets,
  cardIssuer,
}) => {
  const eventTickets = parseEventsToSeperateCards(tickets);
  console.log(eventTickets[0]);
  const newUserCardAmount = AmountMath.make(
    cardBrand,
    harden([eventTickets[0]]),
  );
  const mintedCardPayment = await E(cardMinter).mintPayment(
    harden(newUserCardAmount),
  );
  // const claimedPayment = await E(cardIssuer).claim(mintedCardPayment);
  console.log('paymentStatus:', await E(cardIssuer).isLive(mintedCardPayment));
  await E(E(wallet).getPurse(['ticketStore', 'Ticket'])).deposit(
    mintedCardPayment,
  );
  // await E(depositFaucet).receive(claimedPayment);
  return 'success';
};
