import React from 'react';
import './styles/global.css';
// import { useParams } from 'react-router-dom';

import NavBar from './components/common/NavBar.jsx';

import { useApplicationContext } from './context/Application';
import { setOpenModal } from './store/store';
import MainContainer from './components/mainContainer/MainContainer';
import Footer from './components/common/Footer';
import ModalWrapper from './components/common/modal/ModalWrapper';
import Main from './services/main';

function App() {
  const {
    dispatch,
    state: { openModal },
  } = useApplicationContext();

  // useEffect(() => {
  //   dispatch(setActiveTab(0));
  //   dispatch(setType('marketplace'));
  // }, []);
  console.log('component rerendering');

  const { purchaseTickets, createNewEvent, checkInCard } = Main();
  return (
    <div className="relative w-full h-full">
      <NavBar />
      <MainContainer />
      <ModalWrapper
        open={openModal}
        onClose={() => dispatch(setOpenModal(false))}
        purchaseTickets={purchaseTickets}
        createNewEvent={createNewEvent}
        checkInCard={checkInCard}
      ></ModalWrapper>
      <Footer />
    </div>
  );
}

export default App;
