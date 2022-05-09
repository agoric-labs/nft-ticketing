import React from 'react';
import { useApplicationContext } from '../../../context/Application';
import { Modal } from '../../../helpers/ModalActions';
// import CheckInCard from '../../checkIn/components/CheckInCard';
import { ipfsUrl } from '../../../tickets';
import { setModalType, setOpenModal } from '../../../store/store';
import Button from '../../common/Button';
import ModalBottomDetail from '../../common/modal/ModalBottomDetail';
import ModalTopDetail from '../../common/modal/ModalTopDetail';

const CheckInEventModal = () => {
  const {
    dispatch,
    state: { activeCard },
  } = useApplicationContext();
  const cardDetail = activeCard;
  const image = `${ipfsUrl + cardDetail.image}`;

  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Check In</h1>
      <div className="flex flex-col gap-y-10 mt-8 mx-10 mb-8">
        <div>
          <ModalTopDetail cardDetail={cardDetail} image={image} />
          <div className="w-full overflow-auto mb-8 customScrollbar">
            <ModalBottomDetail ticket={cardDetail} type={'check In'} />
          </div>
          <Button
            styles="w-full"
            text="Check In"
            onClick={() => {
              dispatch(setModalType(Modal.SUCCESS_CHECK_IN));
              dispatch(setOpenModal(true));
            }}
            inModal={true}
          />
        </div>
      </div>
    </>
  );
};

export default CheckInEventModal;
