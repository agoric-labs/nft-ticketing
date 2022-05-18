import React, { useEffect, useState } from 'react';
import { getFilteredList } from '../../helpers/searchBar';
import CheckInCard from './components/CheckInCard';
import Loader from '../common/Loader';
import Pagination from '../common/Pagination';
import { useApplicationContext } from '../../context/Application';

const CheckInContainer = () => {
  const {
    state: { searchInput, searchOption, userCards, cardPurseLoader },
  } = useApplicationContext();
  const [eventList, setEventList] = useState(userCards);
  const [page, setPage] = useState(0);
  const pageLength = 9;

  useEffect(() => {
    console.log('userCards:', userCards);
    setEventList(
      getFilteredList(
        userCards,
        searchInput,
        searchOption,
        page,
        page + pageLength,
      ),
    );
  }, [searchInput, searchOption, page, userCards]);
  return eventList.length > 0 ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8 mb-9">
        {eventList?.map((item, i) => (
          <CheckInCard key={i} cardDetail={item} type={'Buy Product'} />
        ))}
      </div>
      <Pagination
        page={page}
        pageLength={pageLength}
        total={userCards.length}
        onNext={() => {
          console.log('page:', page);
          if (page + pageLength >= userCards.length) return;
          setPage((pg) => pg + pageLength);
        }}
        onPrev={() => {
          if (page === 0) return;
          setPage((pg) => pg - pageLength);
        }}
      />
    </>
  ) : (
    <>
      {cardPurseLoader ? (
        <div className="w-full flex flex-row items-center justify-center">
          <Loader />
          <p className="text-lg font-normal pl-4 animate-pulse">
            fetching cards from wallet...
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <h3>No card in wallet to check In</h3>
        </div>
      )}
    </>
  );
};

export default CheckInContainer;
