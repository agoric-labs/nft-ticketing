import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp';

export const addToSale = async ({
  wallet,
  zoe,
  marketPlaceFacet,
  moneyBrand,
}) => {
  // Will change this step before code goes for production.
  // will fetch purses from walletp notifier.
  const newTokenPurses = await E(wallet).getPurse('Agoric RUN currency');
  const newCardPurse = await E(wallet).getPurse([
    'ticketStore',
    'Ticket',
    '11',
  ]);
  const cardAmount = await E(newCardPurse).getCurrentAmount();
  const { brand: cardBrand, value: cardValue } = cardAmount;
  const withdrawedTicketPayment = await E(newCardPurse).withdraw(
    AmountMath.make(cardBrand, harden([cardValue[0]])),
  );
  console.log('withdrawedTicketPayment:', withdrawedTicketPayment);
  // console.log("cardValue[0]);
  const moneyBrand2 = await E(newTokenPurses).getAllegedBrand();
  console.log(`${moneyBrand} === ${moneyBrand2}`, moneyBrand === moneyBrand2);
  const proposal = {
    give: {
      Asset: AmountMath.make(cardBrand, harden([cardValue[0]])),
    },
    want: {
      Price: AmountMath.make(
        moneyBrand,
        BigInt(cardValue[0].ticketPrice) * 1000000n,
      ),
    },
  }; // Tell the wallet that we're handling the offer result.
  console.log('offer:', proposal);
  const payments = harden({ Asset: withdrawedTicketPayment });
  console.log('payment:', payments);
  const invitation = await E(marketPlaceFacet).makeInvitation();
  console.log('invitation:', invitation);
  // const userSeat = await E(zoe).offer(invitation, proposal, payments);
  // console.log('userSeat', userSeat);
  // const bookOrders = await E(marketPlaceFacet).getBookOrders();
  // console.log('bookOrders', bookOrders);
};
