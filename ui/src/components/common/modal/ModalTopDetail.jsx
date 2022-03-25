import React from 'react';

const ModalTopDetail = ({ cardDetail, images }) => {
  return (
    <div>
      <div className={`card-media mb-3 relative self-center`}>
        <img
          className="w-full rounded-md 0"
          src={images[cardDetail.name]}
          alt={cardDetail?.name}
        />
      </div>
      <div>
        <div className="px-1 h-fit mb-6">
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
    </div>
  );
};

export default ModalTopDetail;
