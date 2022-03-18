import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { getFilteredList } from '../../helpers/searchBar';
import { tickets } from '../../images';
import TicketCard from './TicketCard';

const TicketDisplay = () => {
  const {
    state: { searchInput, searchOption },
  } = useApplicationContext();
  const [eventList, setEventList] = useState([]);
  useEffect(() => {
    setEventList(getFilteredList(tickets, searchInput, searchOption));
  }, [searchInput, searchOption]);
  return (
    <div className="w-full">
      {eventList.map((ticket, i) => (
        <TicketCard key={i} cardDetail={ticket} />
      ))}
    </div>
  );
};

export default TicketDisplay;
