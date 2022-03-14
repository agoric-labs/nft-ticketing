import React, { useEffect } from 'react';
import './styles/global.css';

import NavBar from './components/common/NavBar.jsx';

import { useApplicationContext } from './context/Application';
import { setActiveTab, setType } from './store/store';
import MainContainer from './components/MainContainer/MainContainer';
import Footer from './components/common/Footer';

function App() {
  const { dispatch, walletP } = useApplicationContext();
  console.log(walletP);
  useEffect(() => {
    dispatch(setActiveTab(0));
    dispatch(setType('marketplace'));
  }, []);

  return (
    <div className="relative w-full h-full">
      <NavBar />
      <MainContainer />
      <Footer />
    </div>
  );
}

export default App;
