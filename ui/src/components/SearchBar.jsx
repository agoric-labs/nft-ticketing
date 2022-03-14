import React, { useState } from 'react';
import SearchIcon from '../assets/icons/search.png';
import FilterIcon from '../assets/icons/filter.png';
import { useApplicationContext } from '../context/Application';

const SearchBar = () => {
  const {
    state: { activeTab },
  } = useApplicationContext();
  const [searchInput, setSearchInput] = useState('');
  const [menuOption, setMenuOption] = useState('Name');
  const menuOptions = ['Name', 'SalePrice', 'Tickets Left', 'Time'];
  return (
    <>
      {activeTab === 0 && (
        <div className="mt-20 flex flex-col gap-y-8 sm:flex-row gap-x-4 justify-center w-full px-2 mb-14">
          <div className="flex  sm:w-3/4 border justify-between px-4 border-alternativeLight rounded items-center">
            <input
              className="outline-none focus:outline-none rounded h-12 text-lg w-full"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <img
              className="w-4 h-4 relative"
              src={SearchIcon}
              alt="search-icon"
            />
          </div>
          <select
            style={{
              backgroundImage: `url(${FilterIcon})`,
              backgroundSize: '25px',
              backgroundPositionY: 'center',
              backgroundPositionX: '95%',
            }}
            className="bg-no-repeat cursor-pointer text-primaryLight border border-alternativeLight bg-white rounded sm:w-1/5 h-12 px-3.5 text-lg outline-none focus:outline-none font-normal"
            value={menuOption}
            onChange={(e) => {
              setMenuOption(e.target.value);
            }}
          >
            {menuOptions?.map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default SearchBar;
