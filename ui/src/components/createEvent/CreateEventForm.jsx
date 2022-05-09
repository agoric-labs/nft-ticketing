import React, { useState } from 'react';

// import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import Input from '../common/InputField';
// import DateTimeField from './common/DateTimeField';
// import { makeValue } from '../../utils/amount';
import AttributeSelectorForm from './components/AttributeSelectorForm';
import { setActiveCard, setModalType, setOpenModal } from '../../store/store';
import { useApplicationContext } from '../../context/Application';
import { Modal } from '../../helpers/ModalActions';
// import { setAddFormLoader, setCreationSnackbar } from '../store/store';
// import { useApplicationContext } from '../context/Application';

function CreateTicketForm() {
  const {
    dispatch,
    state: { isSeller },
  } = useApplicationContext();
  console.log(isSeller);
  const [error, setError] = useState('');
  const [Form, setForm] = useState({
    id: '',
    name: '',
    image: '',
    price: 0,
    dateTime: '',
    Tickets: 0,
  });
  const [eventDetails, setEventDetails] = useState([
    { ticketType: '', ticketCount: 0, ticketPrice: 0 },
  ]);
  const handleRemoveAttribute = (index) => {
    const temp = eventDetails;
    temp.splice(index, 1);
    setEventDetails([...temp]);
  };

  const handleAddAttribute = () => {
    setEventDetails([
      ...eventDetails,
      { ticketType: '', ticketCount: 0, ticketPrice: 0 },
    ]);
  };

  const handleAttributeChange = (e, index) => {
    const { name, value } = e.target;
    const temp = eventDetails;
    console.log(e.target.value, e.target.name);
    temp[index][name] = value;
    setEventDetails([...temp]);
  };
  const handleSubmit = async () => {
    console.log('Form:', Form);
    console.log('eventDetails:', eventDetails);
    if (
      Form.name === '' ||
      Form.dateTime === null ||
      Form.image === '' ||
      eventDetails.length === 0
    ) {
      setError('* All fields are required');
      return;
    }
    if (!isSeller) {
      setError('* Only admins are allowed to create events');
      return;
    }
    setError('');
    try {
      const id = uuidv4();
      const ticketCount = eventDetails
        .map((item) => item.ticketCount)
        .reduce(
          (prev, current) => parseInt(prev, 10) + parseInt(current, 10),
          0,
        );
      const cardDetails = {
        id,
        name: Form.name,
        image: Form.image,
        date: Form.dateTime,
        ticketsSold: 0,
        ticketCount,
        eventDetails,
      };
      console.log('cardDetails:', cardDetails);
      dispatch(setActiveCard([cardDetails]));
      setForm({
        name: '',
        image: '',
        dateTime: '',
        ticketsCount: 0,
      });
      setEventDetails([{ ticketType: '', ticketCount: 0, ticketPrice: 0 }]);
      dispatch(setModalType(Modal.CREATE_EVENT));
      dispatch(setOpenModal(true));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-3xl mb-8 w-full flex flex-col gap-y-8 mx-auto">
      <Input
        value={Form.image}
        handleChange={(val) => {
          setForm({ ...Form, image: val });
        }}
        label="Event Cover Image URL"
        placeHolder="https://imageurl.jpg"
        type="text"
      />
      <Input
        type="text"
        label="Event Name"
        value={Form.name}
        handleChange={(val) => {
          setForm({ ...Form, name: val });
        }}
      />

      <div>
        <span className="text-lg leading-none font-medium">Date and Time</span>
        <div className="flex relative justify-between  border border-alternativeLight rounded items-center">
          <input
            name="dateTime"
            value={Form.dateTime}
            onChange={(event) => {
              console.log('val:', event.target.value);
              setForm({ ...Form, dateTime: event.target.value });
            }}
            type="datetime-local"
            className="w-full h-12 pl-4 outline-none pr-4 focus:outline-none text-primaryLight"
          />
        </div>
      </div>
      <div>
        <p className="text-lg leading-none font-medium">Ticket Details</p>
        <p className="text-primaryLight mt-2 text-lg leading-none">
          Enter ticket type name, count and price e.g. VIP Ticket, 100, 250 RUN{' '}
        </p>
        <div className="flex flex-row items-start space-x-24 pl-4 mt-6">
          <div>Ticket Type Name</div>
          <div>Ticket Count</div>
          <div className="pl-12">Ticket Price</div>
        </div>
        <AttributeSelectorForm
          attributes={eventDetails}
          handleAttributeChange={handleAttributeChange}
          handleRemoveAttribute={handleRemoveAttribute}
        />
        <button
          onClick={handleAddAttribute}
          className="text-secondary text-lg mt-3 cursor-pointer w-max"
        >
          + Add More
        </button>
      </div>
      <Button onClick={handleSubmit} text="Create" styles="w-full mt-auto" />
      <p className="text-red-500">{error}</p>
    </div>
  );
}

export default CreateTicketForm;
