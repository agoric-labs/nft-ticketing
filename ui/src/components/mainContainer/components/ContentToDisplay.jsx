import React from 'react';
import { useApplicationContext } from '../../../context/Application';
import CheckInContainer from '../../checkIn/CheckInContainer';
import CreateTicketForm from '../../createEvent/CreateEventForm';
import TicketDisplay from '../../marketplace/TicketDisplay';

const ContentToDisplay = ({ tab }) => {
  const {
    dispatch,
    state: {
      isSeller,
      searchInput,
      searchOption,
      userCards,
      eventCards,
      priorOfferId,
    },
  } = useApplicationContext();
  let content;
  switch (tab) {
    case 0:
      content = (
        <TicketDisplay
          eventCards={eventCards}
          searchInput={searchInput}
          searchOption={searchOption}
          priorOfferId={priorOfferId}
        />
      );
      break;
    case 1:
      content = (
        <CheckInContainer
          userCards={userCards}
          searchInput={searchInput}
          searchOption={searchOption}
        />
      );
      break;
    case 2:
      content = <CreateTicketForm isSeller={isSeller} dispatch={dispatch} />;
      break;
    default:
      content = <></>;
      break;
  }
  return <div className="px-8">{content}</div>;
};

export default ContentToDisplay;
