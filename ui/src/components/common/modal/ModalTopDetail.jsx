import React from 'react';
import { getDateTime } from '../../../helpers/date';

const ModalTopDetail = ({ cardDetail, image }) => {
  return (
    <div>
      <div className="card-media mb-3 relative self-center min-h-[50%] min-w-[50%]">
        <img
          className="w-full rounded-md 0"
          src={image}
          alt={cardDetail?.name}
        />
      </div>
      <div>
        <div className="px-1 h-fit mb-6">
          <div className="flex justify-between items-center">
            <p className="text-lg mb-1 font-semibold">{cardDetail?.name}</p>
          </div>
          <div className="flex citems-center">
            <span className="text-secondary capitalize">
              {getDateTime(new Date(cardDetail?.date).toLocaleString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTopDetail;
