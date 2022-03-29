import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { getFilteredList } from '../../helpers/searchBar';
// import { tickets } from '../../tickets';
import TicketCard from './components/TicketCard';

const TicketDisplay = () => {
  const {
    state: { searchInput, searchOption, availableCards },
  } = useApplicationContext();
  const [eventList, setEventList] = useState([]);
  useEffect(() => {
    setEventList(getFilteredList(availableCards, searchInput, searchOption));
  }, [searchInput, searchOption, availableCards]);
  return (
    <div className="w-full">
      {eventList.map((ticket, i) => (
        <TicketCard key={i} cardDetail={ticket} />
      ))}
    </div>
  );
};

export default TicketDisplay;
