import React from 'react';

const Heading = ({ tab }) => {
  let text = '';
  switch (tab) {
    case 0:
      text = 'MarketPlace - Explore Events';
      break;
    case 1:
      text = 'Check In';
      break;
    case 2:
      text = 'Create New Event';
      break;
    default:
  }
  return (
    <h1 className="text-3xl font-semibold	 text-center mt-16 mb-14">{text}</h1>
  );
};

export default Heading;
