import React from 'react';
// import Tag from '../assets/icons/tag.png';
// import User from '../../../assets/icons/user.png';
import { images } from '../../../images';
// import Expand from '../../../assets/icons/expand.png';
import Button from '../../common/Button';
// import { stringifyValueRUN } from '../../../utils/amount';

const CheckInCard = ({ cardDetail }) => {
  console.log('card:', cardDetail);
  return (
    <div
      className={`transition-all duration-200 flex flex-col border border-alternativeLight rounded-md p-3 mx-0 hover:shadow-lg`}
    >
      <div className={`card-media mb-3 relative self-center`}>
        <img
          className="w-full rounded-md 0"
          src={images[cardDetail.name]}
          alt={cardDetail?.name}
        />
        <>
          <div className="overlay rounded-md absolute top-0 left-0 w-full h-full bg-primary opacity-50 items-center"></div>
          <Button
            styles="media-action  absolute left-1/4 bottom-6 w-2/4"
            text="Buy"
          />
        </>
      </div>
      <div>
        <div className="px-1 h-20">
          <div className="flex justify-between items-center">
            <p className="text-lg mb-1 font-semibold">{cardDetail?.name}</p>
          </div>
          <div className="flex items-center">
            <span className="text-secondary capitalize">
              Thu, Mar 17 at 07:00PM EST
            </span>
          </div>
        </div>
      </div>
      <>
        <hr className="mt-2.5 mb-1 bg-alternativeLight" />
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="text-base text-primaryLight">Ticket Type</p>
            <p className="text-lg font-normal">
              {cardDetail?.eventDetails[3].ticketType}
            </p>
          </div>
        </div>
      </>
    </div>
  );
};

export default CheckInCard;
