import React from 'react';
import Button from '../../common/Button';
import checkLogo from '../../../assets/icons/Check.svg';
import { useApplicationContext } from '../../../context/Application';

const CreationSuccessModal = () => {
  const {
    state: { activeCard },
  } = useApplicationContext();
  return (
    <div className="w-96">
      {' '}
      <div className="flex flex-col gap-y-4 mt-2 mx-10 mb-8 justify-center items-center">
        <img className="w-12 animate-pulse" src={checkLogo} alt="React Logo" />
        <p className="font-semibold text-xl">Congratulations!</p>
        <p className="text-center">
          Your event <b>{`"${activeCard.name}"`}</b> has been created
          successfully.
        </p>
        <Button styles="w-full" text="View Event on Marketplace" />
      </div>
    </div>
  );
};

export default CreationSuccessModal;
