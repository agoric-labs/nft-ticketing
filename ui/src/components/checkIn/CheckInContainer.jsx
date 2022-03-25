import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { getFilteredList } from '../../helpers/searchBar';
import { tickets } from '../../images';
import CheckInCard from './components/CheckInCard';

const CheckInContainer = () => {
  const {
    state: { searchInput, searchOption },
  } = useApplicationContext();
  const [eventList, setEventList] = useState(tickets);
  useEffect(() => {
    setEventList(getFilteredList(tickets, searchInput, searchOption));
  }, [searchInput, searchOption]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
      {eventList?.map((item, i) => (
        <CheckInCard key={i} cardDetail={item} type={'Buy Product'} />
      ))}
    </div>
  );
};

export default CheckInContainer;
