import React, { useState } from 'react';
// import axios from 'axios';
import { nanoid } from 'nanoid';
import Button from './common/Button';
import Input from './common/InputField';
import DateTimeField from './common/DateTimeField';
import { makeValue } from '../utils/amount';
import { setAddFormLoader, setCreationSnackbar } from '../store/store';
import { useApplicationContext } from '../context/Application';

function CreateTicketForm({ tokenDisplayInfo, handleNFTMint }) {
  const { dispatch } = useApplicationContext();
  const [Form, setForm] = useState({
    id: '',
    name: '',
    image: '',
    salePrice: 0,
    Tickets: 0,
    creatorName: '',
  });
  // const [price, setPrice] = useState(null);
  const [attributes, setAttributes] = useState([]);

  const handleSubmit = async () => {
    try {
      const amount = makeValue(Form.price, tokenDisplayInfo);
      const id = nanoid();
      const cardDetails = {
        id,
        name: Form.title,
        price: amount,
        image: Form.image,
        dateTime: Form.dateTime,
        creatorName: Form.creatorName,
        description: Form.description,
        attributes,
      };
      // console.log(cardDetails);
      setForm({
        title: '',
        image: '',
        dateTime: '',
        price: '',
        ticketsCount: 0,
      });
      setAttributes([]);
      dispatch(setAddFormLoader(true));
      dispatch(setCreationSnackbar(true));
      handleNFTMint({ cardDetails });
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
        handleChange={(val) => {
          setForm({ ...Form, name: val });
        }}
      />
      <Input
        value={Form.image}
        handleChange={(val) => {
          setForm({ ...Form, image: val });
        }}
        label="Image CID"
        placeHolder="Please provide a valid ipfs CID"
        type="text"
      />
      <DateTimeField value={Form.dateTime} />
      <Input
        value={Form.price}
        handleChange={(val) => {
          setForm({ ...Form, price: val });
        }}
        label="Price"
      />
      <Input
        type="text"
        value={Form.ticketsCount}
        handleChange={(val) => {
          setForm({ ...Form, ticketsCount: val });
        }}
        label="Tickets count"
        placeHolder="Enter ticket count"
      />
      <Button onClick={handleSubmit} text="Create" styles="w-full mt-auto" />
    </div>
  );
}

export default CreateTicketForm;
