import React, { useEffect, useState } from 'react';
import { useApplicationContext } from '../../context/Application';
import { getFilteredList } from '../../helpers/searchBar';
import { checkInCards } from '../../tickets';
import CheckInCard from './components/CheckInCard';
import Pagination from '../common/Pagination';

const CheckInContainer = () => {
  const {
    state: { searchInput, searchOption },
  } = useApplicationContext();
  const [eventList, setEventList] = useState(checkInCards);
  const [page, setPage] = useState(0);
  const pageLength = 3;
  useEffect(() => {
    setEventList(
      getFilteredList(
        checkInCards,
        searchInput,
        searchOption,
        page,
        page + pageLength,
      ),
    );
  }, [searchInput, searchOption, page]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8 mb-5">
        {eventList?.map((item, i) => (
          <CheckInCard key={i} cardDetail={item} type={'Buy Product'} />
        ))}
      </div>
      <Pagination
        page={page}
        pageLength={pageLength}
        total={checkInCards.length}
        onNext={() => {
          console.log('page:', page);
          if (page + pageLength >= checkInCards.length) return;
          setPage((pg) => pg + pageLength);
        }}
        onPrev={() => {
          if (page === 0) return;
          setPage((pg) => pg - pageLength);
        }}
      />
    </>
  );
};

export default CheckInContainer;
