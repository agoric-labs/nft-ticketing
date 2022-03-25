import React, { useEffect } from 'react';
import './styles/global.css';

import NavBar from './components/common/NavBar.jsx';

import { useApplicationContext } from './context/Application';
import { setActiveTab, setOpenModal, setType } from './store/store';
import MainContainer from './components/mainContainer/MainContainer';
import Footer from './components/common/Footer';
import ModalWrapper from './components/common/modal/ModalWrapper';

function App() {
  const {
    dispatch,
    walletP,
    state: { openModal },
  } = useApplicationContext();
  console.log(walletP);
  useEffect(() => {
    dispatch(setActiveTab(0));
    dispatch(setType('marketplace'));
  }, []);
  return (
    <div className="relative w-full h-full">
      <NavBar />
      <MainContainer />
      <ModalWrapper
        open={openModal}
        onClose={() => dispatch(setOpenModal(false))}
      ></ModalWrapper>
      <Footer />
    </div>
  );
}

export default App;
