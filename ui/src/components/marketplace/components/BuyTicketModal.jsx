import React from 'react';
import { useApplicationContext } from '../../../context/Application';
import { Modal } from '../../../helpers/ModalActions';
// import CheckInCard from '../../checkIn/components/CheckInCard';
import { ipfsUrl } from '../../../tickets';
import { setModalType } from '../../../store/store';
import Button from '../../common/Button';
import ModalBottomDetail from '../../common/modal/ModalBottomDetail';
import ModalTopDetail from '../../common/modal/ModalTopDetail';

const BuyTicketModal = ({ purchaseTickets }) => {
  const {
    dispatch,
    state: { activeCard },
  } = useApplicationContext();
  const cardDetail = activeCard;
  const image = `${ipfsUrl + cardDetail.image}`;
  console.log('active Card:', activeCard);
  return activeCard ? (
    <>
      <h1 className="text-2xl font-semibold text-center">Buy Ticket</h1>
      <div className="flex flex-col gap-y-10 mt-8 mx-10 mb-8">
        <div>
          <ModalTopDetail cardDetail={cardDetail} image={image} />
          <div className="w-full overflow-auto mb-8 customScrollbar">
            <ModalBottomDetail ticket={cardDetail} type={'buy Ticket'} />
            <div className="px-1 pr-3">
              <hr className="mt-3 mb-2 bg-alternativeLight" />
              <div className="flex items-center justify-between">
                <p className="text-base text-primaryLight">Total Price</p>
                <p className="text-lg">{cardDetail.totalPrice}.00 RUN</p>
              </div>
            </div>
          </div>
          <Button
            styles="w-full"
            text="Buy Ticket"
            onClick={async () => {
              await purchaseTickets();
              dispatch(setModalType(Modal.SUCCESS_MARKETPLACE));
            }}
          />
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default BuyTicketModal;
