import React, { useState } from 'react';
// import axios from 'axios';
import { nanoid } from 'nanoid';
import Button from '../common/Button';
import Input from '../common/InputField';
// import DateTimeField from './common/DateTimeField';
import { makeValue } from '../../utils/amount';
import AttributeSelectorForm from './components/AttributeSelectorForm';
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
  const [attributes, setAttributes] = useState([
    { ticketType: '', ticketCount: 0, ticketPrice: 0 },
  ]);
  const handleRemoveAttribute = (index) => {
    const temp = attributes;
    temp.splice(index, 1);
    setAttributes([...temp]);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { display_type: '', name: '', value: '' }]);
  };

  const handleAttributeChange = (e, index) => {
    const { name, value } = e.target;
    const temp = attributes;
    console.log(e.target.value, e.target.name);
    temp[index][name] = value;
    setAttributes([...temp]);
  };
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
        handleChange={handleInputChange}
      />

      <div>
        <span className="text-lg leading-none font-medium">Date and Time</span>
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
          attributes={attributes}
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
    </div>
  );
}

export default CreateTicketForm;
