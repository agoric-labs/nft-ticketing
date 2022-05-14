import React from 'react';
import checkLogo from '../../../assets/icons/Check.svg';

const CheckInSuccessModal = () => {
  return (
    <div className="w-96">
      {' '}
      <div className="flex flex-col gap-y-4 mt-2 mx-10 mb-8 justify-center items-center">
        <img className="w-12 animate-pulse" src={checkLogo} alt="React Logo" />
        <p className="text-center text-xl font-semibold">
          Check In offer sent!
        </p>
        <p className="text-center text-sm font-normal text-gray-400">
          Accept offer in Wallet to checkIn
        </p>
      </div>
    </div>
  );
};

export default CheckInSuccessModal;
