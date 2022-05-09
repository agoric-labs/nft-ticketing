import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useApplicationContext } from '../../context/Application';
import { setActiveTab, setType } from '../../store/store';

const Header = () => {
  const { state, dispatch } = useApplicationContext();
  const { approved, activeTab } = state;
  const history = useHistory();
  const walletStatus = approved ? 'Connected' : 'Not connected';
  // dispatch(setActiveTab(0));
  useEffect(() => {
    switch (activeTab) {
      case 0:
        history.push('/marketplace');
        break;
      case 1:
        history.push('/checkin');
        break;
      case 2:
        history.push('/create');
        break;
      default: {
        dispatch(setActiveTab(0));
        break;
      }
    }
  }, [activeTab]);

  const TabButton = ({ tabIndex, text, width }) => {
    console.log('width', width);
    return (
      <div
        onClick={() => {
          dispatch(setActiveTab(tabIndex));
          switch (tabIndex) {
            case 0:
              dispatch(setType('Marketplace'));
              break;
            case 1:
              dispatch(setType('Checkin'));
              break;
            case 2:
              dispatch(setType('Create'));
              break;
            default:
              dispatch(setType('Marketplace'));
              break;
          }
        }}
        className={`cursor-pointer flex flex-col justify-center relative h-20 ${width}`}
      >
        <span>{text}</span>
        <div
          className={`w-full h-1 bg-secondary rounded-t-md absolute bottom-0 ${
            tabIndex === activeTab ? 'block' : 'hidden'
          }`}
        ></div>
      </div>
    );
  };
  return (
    <>
      <div className="flex justify-between nav-shadow items-center w-full h-20 px-14 text-base">
        <p className="lg:text-xl">Ticket Store</p>
        <div className="flex-row flex text-base text-center md:pl-12">
          <TabButton tabIndex={0} text="Marketplace" width="w-36" />
          <TabButton tabIndex={1} text="Check In" width="w-36" />
          <TabButton tabIndex={2} text="Create" width="w-32" />
        </div>
        <div>
          Agoric Wallet: {walletStatus}
          <span
            className={`inline-block ml-1.5 w-2.5 h-2.5 rounded-full ${
              approved ? 'bg-secondary' : 'bg-alternative'
            }`}
          ></span>
        </div>
      </div>
    </>
  );
};

export default Header;
