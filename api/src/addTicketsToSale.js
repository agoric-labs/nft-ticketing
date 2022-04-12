import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp';

export const addToSale = async ({
  wallet,
  zoe,
  marketPlaceFacet,
  moneyBrand,
}) => {
  const newTokenPurses = await E(wallet).getPurse('Agoric RUN currency');
  const newCardPurse = await E(wallet).getPurse(['ticketStore', 'Ticket']);
  console.log('Token Purses', newTokenPurses);
  console.log('newCardPurse', newCardPurse);
  const { brand: cardBrand, value: cardValue } = await E(
    newCardPurse,
  ).getCurrentAmount();
  console.log('cardValue:', cardValue);
  console.log('cardBrand:', cardBrand);
  const invitation = await E(marketPlaceFacet).makeInvitation();
  const withdrawedTicketPayment = await E(newCardPurse).withdraw(
    AmountMath.make(cardBrand, harden(cardValue)),
  );
  console.log('withdrawedTicketPayment:', withdrawedTicketPayment);
  // console.log("cardValue[0]);
  const proposal = {
    give: {
      Asset: {
        brand: cardBrand,
        value: cardValue,
      },
    },
    want: {
      Price: {
        brand: moneyBrand,
        value: BigInt(cardValue[0].ticketPrice) * 1000000n,
      },
    },
  }; // Tell the wallet that we're handling the offer result.
  console.log('offer:', proposal);
  const payments = { Asset: withdrawedTicketPayment };
  console.log(payments);
  const userSeat = await E(zoe).offer(invitation, proposal, payments);
  console.log('userSeat', userSeat);
  const bookOrders = await E(marketPlaceFacet).getBookOrders();
  console.log('bookOrders', bookOrders);
};
