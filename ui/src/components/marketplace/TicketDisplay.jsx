import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { getFilteredList } from '../../helpers/searchBar';
import Loader from '../common/Loader';
// import { tickets } from '../../tickets';
import TicketCard from './components/TicketCard';

const TicketDisplay = () => {
  const [loader, setLoader] = useState(true);
  const {
    state: { searchInput, searchOption, availableCards },
  } = useApplicationContext();
  const [eventList, setEventList] = useState([]);
  useEffect(() => {
    setEventList(getFilteredList(availableCards, searchInput, searchOption));
    if (availableCards.length > 0) setLoader(false);
  }, [searchInput, searchOption, availableCards]);
  return (
    <>
      {' '}
      {!loader ? (
        <div className="w-full">
          {eventList.map((ticket, i) => (
            <TicketCard key={i} cardDetail={ticket} />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-row items-center justify-center">
          <Loader />
          <p className="text-lg font-normal pl-4 animate-pulse">
            fetching events...
          </p>
        </div>
      )}
    </>
  );
};

export default TicketDisplay;
