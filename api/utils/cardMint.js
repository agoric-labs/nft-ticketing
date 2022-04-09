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

export const mintTickets = async ({
  wallet,
  cardBrand,
  tickets,
  INVITE_BRAND_BOARD_ID,
  marketPlaceCreatorFacet,
  board,
  zoe,
}) => {
  console.log('tickets:', tickets);
  const eventTickets = parseEventsToSeperateCards(tickets);
  const newUserCardAmount = AmountMath.make(cardBrand, harden(eventTickets));
  const depositFacetId = await E(wallet).getDepositFacetId(
    INVITE_BRAND_BOARD_ID,
  );
  const depositFacet = await E(board).getValue(depositFacetId);
  console.log('depositFacet', depositFacet);
  const invitation = await E(marketPlaceCreatorFacet).makeInvitation();
  console.log('invitation', invitation);
  const invitationIssuer = await E(zoe).getInvitationIssuer();
  console.log('invitation Issuer:', invitationIssuer);
  const invitationAmount = await E(invitationIssuer).getAmountOf(invitation);
  console.log('invitationAmount:', invitationAmount);

  const {
    value: [{ handle }],
  } = invitationAmount;
  console.log('handle:', handle);
  const invitationHandleBoardId = await E(board).getId(handle);
  console.log(invitationHandleBoardId);
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
    const offerId = await E(wallet).addOffer(updatedOffer);
    console.log(offerId);
  } catch (err) {
    console.log('error:', err);
  }
  return 'success';
};
