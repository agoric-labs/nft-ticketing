import React from 'react';
import CheckInContainer from '../../CheckInContainer';
import CreateTicketForm from '../../CreateTicketForm';
import TicketDisplay from '../../TicketDisplay';

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
