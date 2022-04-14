import { AmountMath } from '@agoric/ertp';
import { E } from '@agoric/eventual-send';
import { v4 as uuidv4 } from 'uuid';

const parseEventsToSeperateCards = (tickets) => {
  const eventTickets = [];
  tickets.forEach((event) => {
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
  INVITE_BRAND_BOARD_ID,
  invitation,
  board,
  zoe,
}) => {
  console.log('tickets:', tickets);
  const eventTickets = parseEventsToSeperateCards(tickets);
  const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
  const depositFacetId = await E(walletP).getDepositFacetId(
    INVITE_BRAND_BOARD_ID,
  );
  const depositFacet = await E(board).getValue(depositFacetId);
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  const invitationAmount = await E(invitationIssuer).getAmountOf(invitation);

  const {
    value: [{ handle }],
  } = invitationAmount;
  const invitationHandleBoardId = await E(board).getId(handle);
  try {
    const offer = {
      // JSONable ID for this offer.  This is scoped to the origin.
      id: Date.now(),
      proposalTemplate: {
        want: {
          Token: {
            pursePetname: ['ticketStore', 'Ticket'],
            value: newUserCardAmount.value,
          },
        },
      }, // Tell the wallet that we're handling the offer result.
      dappContext: true,
    };

    const updatedOffer = { ...offer, invitationHandleBoardId };
    await E(depositFacet).receive(invitation);
    await E(walletP).addOffer(updatedOffer);
  } catch (err) {
    console.log('error:', err);
  }
  return 'success';
};

export const mintTicketsWithFacetToWallet = async ({
  tickets,
  cardBrand,
  walletP,
  CARD_BRAND_BOARD_ID,
  board,
  cardMinter,
}) => {
  console.log('start mint');
  const eventTickets = parseEventsToSeperateCards(tickets);
  const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
  const depositFacetId = await E(walletP).getDepositFacetId(
    CARD_BRAND_BOARD_ID,
  );
  const depositFacet = await E(board).getValue(depositFacetId);
  const cardPayment = await E(cardMinter).mintPayment(newUserCardAmount);
  try {
    await E(depositFacet).receive(cardPayment);
    console.log('end mint');
  } catch (e) {
    console.log('Error in depositing through facet', e);
  }
};
