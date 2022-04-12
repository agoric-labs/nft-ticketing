import React, { useEffect } from 'react';
import './styles/global.css';

import NavBar from './components/common/NavBar.jsx';

import { useApplicationContext } from './context/Application';
import { setActiveTab, setOpenModal, setType } from './store/store';
import MainContainer from './components/mainContainer/MainContainer';
import Footer from './components/common/Footer';
import ModalWrapper from './components/common/modal/ModalWrapper';
import Main from './services/main';

function App() {
  const {
    dispatch,
    state: {
      activeCard,
      walletP,
      publicFacetMarketPlace,
      tokenPurses,
      cardPurse,
      openModal,
    },
  } = useApplicationContext();
  useEffect(() => {
    dispatch(setActiveTab(0));
    dispatch(setType('marketplace'));
  }, []);
  const { purchaseTickets } = Main(
    activeCard,
    walletP,
    publicFacetMarketPlace,
    tokenPurses,
    cardPurse,
  );
  return (
    <div className="relative w-full h-full">
      <NavBar />
      <MainContainer />
      <ModalWrapper
        open={openModal}
        onClose={() => dispatch(setOpenModal(false))}
        purchaseTickets={purchaseTickets}
      ></ModalWrapper>
      <Footer />
    </div>
  );
}

export default App;
