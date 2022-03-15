import React from 'react';
import { useApplicationContext } from '../../context/Application.jsx';
import ApproveOfferSnackbar from './components/ApproveOfferSnackbar.jsx';
import ContentToDisplay from './components/ContentToDisplay.jsx';
import EnableAppDialog from './components/EnableAppDialog.jsx';
import Heading from './components/Heading.jsx';
import SearchBar from './components/SearchBar.jsx';

const MainContainer = () => {
  const {
    state: { activeTab },
  } = useApplicationContext();

  return (
    <div className="mx-auto md:w-12/12 lg:w-10/12">
      <Heading tab={activeTab} />
      <SearchBar />
      <ContentToDisplay tab={activeTab} />
      <EnableAppDialog />
      <ApproveOfferSnackbar />
    </div>
  );
};

export default MainContainer;

// 72 t 56 b
