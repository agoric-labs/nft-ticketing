import React from 'react';
import Button from '../../common/Button';
import checkLogo from '../../../assets/icons/Check.svg';
import { useApplicationContext } from '../../../context/Application';
import { setActiveTab, setOpenModal, setType } from '../../../store/store';

const TicketPurchaseSuccessModal = () => {
  const {
    dispatch,
    state: { activeCard },
  } = useApplicationContext();

  return (
    <div className="w-96">
      {' '}
      <div className="flex flex-col gap-y-4 mt-2 mx-10 mb-8 justify-center items-center">
        <img className="w-12 animate-pulse" src={checkLogo} alt="React Logo" />
        <p className="font-semibold text-xl">Congratulations!</p>
        <p className="text-center">
          Offer sent to wallet to buy {activeCard.ticketCount} tickets for event{' '}
          <b>{`"${activeCard.name}"`}</b>
        </p>
        <Button
          styles="w-full"
          text="View My Tickets"
          onClick={() => {
            dispatch(setActiveTab(1));
            dispatch(setOpenModal(false));
            dispatch(setType('Checkin'));
          }}
        />
      </div>
    </div>
  );
};

export default TicketPurchaseSuccessModal;
