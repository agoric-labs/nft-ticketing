import React from 'react';
import { useApplicationContext } from '../../../context/Application';
import { Modal } from '../../../helpers/ModalActions';
// import CheckInCard from '../../checkIn/components/CheckInCard';
import { ipfsUrl } from '../../../tickets';
import { setModalType } from '../../../store/store';
import Button from '../../common/Button';
import ModalBottomDetail from '../../common/modal/ModalBottomDetail';
import ModalTopDetail from '../../common/modal/ModalTopDetail';

const CreateEventModal = () => {
  const {
    dispatch,
    state: { activeCard },
  } = useApplicationContext();
  const cardDetail = activeCard;
  const image = `${ipfsUrl + cardDetail.image}`;

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Create New Event</h1>
      <div className="flex flex-col gap-y-10 mt-8 mx-10 mb-8">
        <div>
          <ModalTopDetail cardDetail={cardDetail} image={image} />
          <div className="w-full h-32 overflow-auto mb-8 customScrollbar">
            {cardDetail.eventDetails.map((ticket, i) => {
              return (
                <>
                  <ModalBottomDetail key={i} ticket={ticket} />
                  {i + 1 !== cardDetail.eventDetails.length && (
                    <hr className="mt-3 mb-2 bg-alternativeLight" />
                  )}
                </>
              );
            })}
          </div>
          <Button
            styles="w-full"
            text="Create"
            onClick={() => {
              dispatch(setModalType(Modal.SUCCESS_CREATE_EVENT));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CreateEventModal;
