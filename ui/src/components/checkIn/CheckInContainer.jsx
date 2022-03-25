import React from 'react';
import { tickets } from '../../images';
import CheckInCard from './components/CheckInCard';

const CheckInContainer = () => {
  console.log('tickets', tickets[0]);
  return (
    <div className="grid grid-cols-3 gap-8">
      {tickets?.map((item, i) => (
        <CheckInCard key={i} cardDetail={item} type={'Buy Product'} />
      ))}
    </div>
  );
};

export default CheckInContainer;
