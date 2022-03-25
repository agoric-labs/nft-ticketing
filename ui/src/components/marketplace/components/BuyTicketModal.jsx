import React from 'react';
// import CheckInCard from '../../checkIn/components/CheckInCard';
import { tickets, images } from '../../../images';
import Button from '../../common/Button';
import ModalBottomDetail from '../../common/modal/ModalBottomDetail';
import ModalTopDetail from '../../common/modal/ModalTopDetail';

const BuyTicketModal = () => {
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
          <Button styles="w-full" text="Check In" />
        </div>
      </div>
    </>
  );
};

export default BuyTicketModal;
