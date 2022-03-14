import React, { useEffect } from 'react';
import './styles/global.css';

import Header from './components/Header.jsx';
import ApproveOfferSnackbar from './components/ApproveOfferSnackbar.jsx';
import EnableAppDialog from './components/EnableAppDialog.jsx';

import { useApplicationContext } from './context/Application';
import { setActiveTab, setType } from './store/store';
import SearchBar from './components/SearchBar';

function App() {
  const { dispatch, walletP } = useApplicationContext();
  console.log(walletP);
  useEffect(() => {
    dispatch(setActiveTab(0));
    dispatch(setType('marketplace'));
  }, []);

  return (
    <div className="relative w-full h-full">
      <Header />
      <SearchBar />
      <EnableAppDialog />
      <ApproveOfferSnackbar />
    </div>
  );
}

export default App;
