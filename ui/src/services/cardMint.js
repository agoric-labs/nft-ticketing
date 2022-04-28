import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

const parseEventsToSeperateCards = (events) => {
  const eventTickets = [];
  events.forEach((event) => {
    let obj = {
      ...event,
    };
    delete obj.ticketsCount;
    delete obj.ticketsSold;
    event.eventDetails.forEach((ticketType) => {
      obj = {
        ...obj,
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

export const mintTicketsWithOfferToWallet = async ({
  walletP,
  cardBrand,
  tickets,
  cardPursePetname,
  marketPlaceContractInstance,
}) => {
  let offerId = null;
  console.log('tickets:', tickets);
  const eventTickets = parseEventsToSeperateCards(tickets);
  const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
  try {
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),
      invitationQuery: {
        instance: marketPlaceContractInstance,
        description: 'mint a payment',
      },
      proposalTemplate: {
        want: {
          Token: {
            pursePetname: cardPursePetname,
            value: newUserCardAmount.value,
          },
        },
      },
      // Tell the wallet that we're handling the offer result.
      // dappContext: true,
    };
    offerId = await E(walletP).addOffer(offer);
    console.log('offerId:', offerId);
  } catch (err) {
    console.log('error in mintTicketsWithOfferToWallet:', err);
  }
  return { offerId, eventTickets, cardAmount: newUserCardAmount };
};

// export const mintTicketsWithOfferToZoe = async ({
//   cardBrand,
//   tickets,
//   creatorInvitation,
//   zoe,
//   cardIssuer,
// }) => {
//   try {
//     // console.log('tickets:', tickets);
//     const eventTickets = parseEventsToSeperateCards(tickets);
//     // console.log('eventTickets:', eventTickets);
//     const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
//     const proposal = {
//       want: {
//         Asset: newUserCardAmount,
//       },
//     };
//     console.log('making Offer');
//     const userSeat = await E(zoe).offer(creatorInvitation, proposal);
//     console.log('userSeat', userSeat);
//     // This has the creatorFacet
//     const offerResult = await E(userSeat).getOfferResult();
//     console.log('offerResult:', offerResult);
//     // This has cardPayment to put on sale.
//     const userPayout = await E(userSeat).getPayout('Asset');
//     console.log('userPayout', userPayout);
//     const amountArray = eventTickets.map((ticket) =>
//       AmountMath.make(cardBrand, harden([ticket])),
//     );
//     const arrayofAmount = await E(cardIssuer).getAmountOf(userPayout);
//     console.log('amountArray', amountArray);
//     console.log('arrayofAmount:', arrayofAmount);
//   } catch (err) {
//     console.log('error:', err);
//   }
//   return 'success';
// };

// export const mintTicketsWithFacetToWallet = async ({
//   tickets,
//   cardBrand,
//   walletP,
//   CARD_BRAND_BOARD_ID,
//   board,
//   cardMinter,
// }) => {
//   console.log('start mint');
//   const eventTickets = parseEventsToSeperateCards(tickets);
//   const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
//   const depositFacetId = await E(walletP).getDepositFacetId(
//     CARD_BRAND_BOARD_ID,
//   );
//   const depositFacet = await E(board).getValue(depositFacetId);
//   const cardPayment = await E(cardMinter).mintPayment(newUserCardAmount);
//   try {
//     await E(depositFacet).receive(cardPayment);
//     console.log('end mint');
//   } catch (e) {
//     console.log('Error in depositing through facet', e);
//   }
// };
