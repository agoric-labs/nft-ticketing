import { E } from '@agoric/eventual-send';
import { AmountMath } from '@agoric/ertp';

export const addToSale = async ({ wallet, zoe, marketPlaceCreatorFacet }) => {
  const newTokenPurses = await E(wallet).getPurse('Agoric RUN currency');
  const newCardPurse = await E(wallet).getPurse(['ticketStore', 'Ticket']);
  console.log('Token Purses', newTokenPurses);
  console.log('newCardPurse', newCardPurse);
  const { brand: cardBrand, value: cardValue } = await E(
    newCardPurse,
  ).getCurrentAmount();
  console.log('cardValue:', cardValue);
  console.log('cardBrand:', cardBrand);
  const invitation = await E(marketPlaceCreatorFacet).makeInvitation();
  const withdrawedTicketPayment = await E(newCardPurse).withdraw(
    AmountMath.make(cardBrand, harden([cardValue[0]])),
  );
  console.log('withdrawedTicketPayment:', withdrawedTicketPayment);
  const proposal = {
    give: {
      Asset: {
        brand: cardBrand,
        value: cardValue[0],
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
  // const payments = { Asset: withdrawedTicketPayment };
  // const userSeat = await E(zoe).offer(invitation, proposal, payments);
  // console.log('userSeat', userSeat);
  // console.log('userSeat', userSeat);
};
