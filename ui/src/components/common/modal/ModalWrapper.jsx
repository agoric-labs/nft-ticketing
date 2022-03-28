import React, { useEffect } from 'react';

import CancelIcon from '../../../assets/icons/cancel.png';
import CreateEventModal from '../../createEvent/components/CreateEventModal';
import BuyTicketModal from '../../marketplace/components/BuyTicketModal';
import CheckInEventModal from '../../checkIn/components/CheckInEventModal';
import { useApplicationContext } from '../../../context/Application';
import CreationSuccessModal from '../../createEvent/components/CreationSuccessModal';
import CheckInSuccessModal from '../../checkIn/components/CheckInSuccessModal';
import { Modal } from '../../../helpers/ModalActions';
import TicketPurchaseSuccessModal from '../../marketplace/components/TicketPurchaseSuccessModal';
import { setActiveCard } from '../../../store/store';

const ModalWrapper = ({ style, open, onClose }) => {
  const {
    dispatch,
    state: { modalType },
  } = useApplicationContext();
  const handleKeyClose = (e) => {
    if (e.key === 'Escape') {
      onClose();
      dispatch(setActiveCard(null));
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', handleKeyClose, false);
    return () => {
      window.removeEventListener('keyup', handleKeyClose, false);
    };
  }, []);
  return (
    open && (
      <div className="fixed inset-0 h-full w-full">
        <div className="h-full justify-center mx-auto w-96 items-center flex relative inset-0 z-50 outline-none focus:outline-none">
          <div className={`relative w-auto my-6  overflow-y-auto ${style}`}>
            <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex justify-end mr-5 mt-5">
                <button onClick={onClose}>
                  <img src={CancelIcon} alt="close" className="w-3.5 h-3.5" />
                </button>
              </div>
              <>
                {(() => {
                  switch (modalType) {
                    case Modal.CREATE_EVENT:
                      return <CreateEventModal />;
                    case Modal.CHECK_IN:
                      return <CheckInEventModal />;
                    case Modal.MARKETPLACE:
                      return <BuyTicketModal />;
                    case Modal.SUCCESS_CREATE_EVENT:
                      return <CreationSuccessModal />;
                    case Modal.SUCCESS_CHECK_IN:
                      return <CheckInSuccessModal />;
                    case Modal.SUCCESS_MARKETPLACE:
                      return <TicketPurchaseSuccessModal />;
                    default:
                      return <></>;
                  }
                })()}
              </>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            onClose();
          }}
          className="opacity-25 absolute w-full h-full inset-0 z-40 bg-black"
        ></div>
      </div>
    )
  );
};

export default ModalWrapper;
