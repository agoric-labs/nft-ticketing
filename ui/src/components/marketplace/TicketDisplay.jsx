import React from 'react';
import { tickets } from '../../images';
import TicketCard from './TicketCard';

const TicketDisplay = () => {
  return (
    <div className="w-full">
      {tickets.map((ticket, i) => (
        <TicketCard key={i} cardDetail={ticket} />
      ))}
    </div>
  );
};

export default TicketDisplay;
