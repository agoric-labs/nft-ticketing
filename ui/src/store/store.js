// The code in this file requires an understanding of Autodux.
// See: https://github.com/ericelliott/autodux
import autodux from 'autodux';

export const {
  reducer,
  initial: defaultState,
  actions: {
    setApproved,
    setConnected,
    setIsSeller,
    setPreviousOfferId,
    setCardPurse,
    setTokenPurses,
    setInvitationPurse,
    setAvailableCards,
    setEventCards,
    setWalletOffers,
    setError,
    setMessage,
    setBoughtCard,
    setActiveCard,
    setActiveCardBid,
    setTokenDisplayInfo,
    setTokenPetname,
    setOpenExpandModal,
    setOpenModal,
    setModalType,
    setActiveTab,
    setType,
    setOpenEnableAppDialog,
    setUserCards,
    setNeedToApproveOffer,
    setCreationSnackbar,
    setAddFormLoader,
    setCardPurseLoader,
    setCheckIcon,
    setSearchInput,
    setSearchOption,
  },
} = autodux({
  slice: 'cardStore',
  initial: {
    approved: true,
    connected: false,
    isSeller: false,
    previousOfferId: null,
    cardPurse: [],
    tokenPurses: [],
    invitationPurse: [],
    availableCards: [],
    eventCards: [],
    walletOffers: [],
    error: {},
    message: null,
    boughtCard: false,
    activeCard: null,
    activeCardBid: null,
    tokenDisplayInfo: null,
    tokenPetname: null,
    openExpandModal: null,
    openModal: false,
    modalType: '',
    activeTab: 0,
    type: 'marketplace',
    openEnableAppDialog: false,
    userCards: [],
    needToApproveOffer: false,
    creationSnackbar: false,
    addFormLoader: false,
    cardPurseLoader: true,
    checkIcon: false,
    searchInput: '',
    searchOption: 'Name',
  },
  actions: {},
});
