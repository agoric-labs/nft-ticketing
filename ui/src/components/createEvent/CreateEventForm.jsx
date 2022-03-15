import React, { useState } from 'react';
// import axios from 'axios';
import { nanoid } from 'nanoid';
import Button from '../common/Button';
import Input from '../common/InputField';
// import DateTimeField from './common/DateTimeField';
import { makeValue } from '../../utils/amount';
// import { setAddFormLoader, setCreationSnackbar } from '../store/store';
// import { useApplicationContext } from '../context/Application';

function CreateTicketForm({ tokenDisplayInfo }) {
  // const { dispatch } = useApplicationContext();
  const [Form, setForm] = useState({
    id: '',
    name: '',
    image: '',
    price: 0,
    dateTime: '',
    Tickets: 0,
    creatorName: '',
  });
  const handleInputChange = (event) => {
    setForm({ ...Form, [event.target.name]: event.target.value });
  };
  // const [price, setPrice] = useState(null);
  const [attributes, setAttributes] = useState([]);

  const handleSubmit = async () => {
    try {
      console.log(tokenDisplayInfo);
      console.log(setAttributes);
      console.log(makeValue);
      console.log(nanoid);
      const amount = makeValue(Form.price, tokenDisplayInfo);
      const id = nanoid();
      const cardDetails = {
        id,
        name: Form.name,
        price: amount,
        image: Form.image,
        dateTime: Form.dateTime,
        creatorName: Form.creatorName,
        description: Form.description,
        attributes,
      };
      console.log(cardDetails);
      setForm({
        title: '',
        image: '',
        dateTime: '',
        price: '',
        ticketsCount: 0,
      });
      // setAttributes([]);
      // dispatch(setAddFormLoader(true));
      // dispatch(setCreationSnackbar(true));
      // handleNFTMint({ cardDetails });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(attributes);
  console.log(Form);
  return (
    <div className="max-w-3xl mb-8 w-full flex flex-col gap-y-8 mx-auto">
      <Input
        type="text"
        label="Event Name"
        value={Form.name}
        handleChange={handleInputChange}
      />
      <Input
        value={Form.image}
        handleChange={handleInputChange}
        label="Image CID"
        placeHolder="Please provide a valid ipfs CID"
        type="text"
      />
      <div>
        <span className="text-lg leading-none">Date and Time</span>
        <div className="flex relative justify-between  border border-alternativeLight rounded items-center">
          <input
            name="dateTime"
            value={Form.dateTime}
            onChange={handleInputChange}
            type="datetime-local"
            className="w-full h-12 pl-4 outline-none pr-4 focus:outline-none text-primaryLight"
          />
        </div>
      </div>
      <Input
        type="text"
        value={Form.ticketsCount}
        handleChange={handleInputChange}
        label="Tickets count"
        placeHolder="Enter ticket count"
      />
      <Button onClick={handleSubmit} text="Create" styles="w-full mt-auto" />
    </div>
  );
}

export default CreateTicketForm;
