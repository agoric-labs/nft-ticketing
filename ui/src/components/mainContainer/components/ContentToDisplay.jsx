import React from 'react';
import CheckInContainer from '../../checkIn/CheckInContainer';
import CreateTicketForm from '../../createEvent/CreateEventForm';
import TicketDisplay from '../../marketplace/TicketDisplay';

const ContentToDisplay = ({ tab }) => {
  let content;
  switch (tab) {
    case 0:
      content = <TicketDisplay />;
      break;
    case 1:
      content = <CheckInContainer />;
      break;
    case 2:
      content = <CreateTicketForm />;
      break;
    default:
      content = <></>;
      break;
  }
  return <div className="px-8">{content}</div>;
};

export default ContentToDisplay;
