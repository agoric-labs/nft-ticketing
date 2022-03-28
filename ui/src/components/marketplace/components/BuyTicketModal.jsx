import React from 'react';
import { useApplicationContext } from '../../../context/Application';
import { Modal } from '../../../helpers/ModalActions';
// import CheckInCard from '../../checkIn/components/CheckInCard';
import { tickets, images } from '../../../images';
import { setModalType } from '../../../store/store';
import Button from '../../common/Button';
import ModalBottomDetail from '../../common/modal/ModalBottomDetail';
import ModalTopDetail from '../../common/modal/ModalTopDetail';

const BuyTicketModal = () => {
  const { dispatch } = useApplicationContext();
  const cardDetail = tickets[0];
  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Check In</h1>
      <div className="flex flex-col gap-y-10 mt-8 mx-10 mb-8">
        <div>
          <ModalTopDetail cardDetail={cardDetail} images={images} />
          <div className="w-full overflow-auto mb-8 customScrollbar">
            <ModalBottomDetail
              ticket={cardDetail.eventDetails[0]}
              type={'buy Ticket'}
            />
          </div>
          <Button
            styles="w-full"
            text="Check In"
            onClick={() => {
              dispatch(setModalType(Modal.SUCCESS_MARKETPLACE));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BuyTicketModal;
