import React from 'react';

const ModalBottomDetail = ({ ticket, count, type }) => {
  return (
    <div className="px-1 pr-3">
      <div className="flex items-center justify-between">
        <p className="text-base text-primaryLight font-medium">
          Ticket Type {count ? count + 1 : ''}
        </p>
        <p className="text-lg font-medium">{ticket.ticketType}</p>
      </div>
      {type !== 'check In' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-base text-primaryLight">Price</p>
            <p className="text-lg">{ticket.ticketPrice}.00 RUN</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-base text-primaryLight">Quantity</p>
            <p className="text-lg">{ticket.ticketCount}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ModalBottomDetail;
