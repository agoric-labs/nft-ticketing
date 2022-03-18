import React, { useState } from 'react';
import Arrow from '../../assets/icons/arrow-select.png';

// import User from '../assets/icons/user.png';
// import { stringifyValueRUN } from '../utils/amount';
import { images } from '../../images';
import Button from '../common/Button';
// import Select from '../common/SelectField';

const TicketCard = ({ cardDetail }) => {
  const [ticketCount, setTicketCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState({});
  const updateTotalPrice = () => {
    setTotalPrice(selectedTicket.ticketPrice * ticketCount);
  };
  const handleIncrementCount = () => {
    if (!selectedTicket.ticketType) return;
    const ticketsLeft = cardDetail.ticketsCount - cardDetail.ticketsSold;
    if (ticketCount === ticketsLeft) return;
    setTicketCount(ticketCount + 1);
    updateTotalPrice();
  };
  const handleDecrementCount = () => {
    if (!selectedTicket.ticketType) return;
    if (ticketCount === 0) return;
    setTicketCount(ticketCount - 1);
    updateTotalPrice();
  };
  // const handleTicketType = (e) => {
  //   console.log('value:', e.target);
  //   console.log('value:', e.target.name);
  //   setSelectedTicket(e.target.value);
  // };

  return (
    <div className="flex flex-col md:flex-row p-4 border border-alternativeLight rounded-md my-10  transform transition duration-200 hover:scale-105">
      <div className="w-full md:6/12 lg:w-5/12">
        <img
          className="h-full w-full rounded-md"
          src={images[cardDetail.name]}
          alt={cardDetail?.name}
        />
      </div>
      <div className="w-full mt-2 md:6/12 lg:w-7/12 flex flex-row pl-6 pt-2">
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-row justify-between">
            <div>
              <div className="text-xl font-semibold lg:w-80">
                {cardDetail.name}
              </div>
              <div className="text-secondary text-base">
                Thu, Mar 17 at 07:00PM EST
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-left pr-2">
                <div className="text-base text-primaryLight">Tickets Sold</div>
                <div className="text-lg">
                  {cardDetail.ticketsSold}/{cardDetail.ticketsCount}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 lg:mt-2 space-y-4 xl:space-y-8">
            <div className="space-y-2">
              <div>Select Ticket(s)</div>
              <div
                className={`flex flex-col space-y-4  lg:flex-row lg:space-y-0 ${
                  totalPrice > 0 ? 'justify-between' : 'justify-start space-x-8'
                }`}
              >
                <div className="w-full lg:w-6/12 ">
                  <select
                    value={selectedTicket}
                    style={{
                      backgroundImage: `url(${Arrow})`,
                      backgroundSize: '15px',
                      backgroundPositionY: 'center',
                      backgroundPositionX: '95%',
                    }}
                    name={'ticket'}
                    onChange={(e) => {
                      console.log('value:', e.target.value.ticketType);
                      console.log('value:', e.target.name);
                      setSelectedTicket(e.target.value);
                    }}
                    className={`bg-no-repeat cursor-pointer rounded-md w-full h-12 px-3.5 text-lg outline-none focus:outline-none font-normal border-alternativeLight border bg-white text-primaryLight`}
                  >
                    {cardDetail?.eventDetails?.map((item, i) => (
                      <option
                        key={i}
                        value={item}
                        className="text-lg text-black"
                      >
                        {item.ticketType}
                        {item.ticketPrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-row w-full lg:w-5/12 justify-between">
                  <div className="w-3/6 flex flex-row border border-alternativeLight rounded-md hover:shadow-sm h-12">
                    <button
                      className="cursor-pointer rounded-md bg-iconBtnColor h-full w-4/12 text-xl hover:scale-y-105"
                      onClick={handleIncrementCount}
                    >
                      +
                    </button>
                    <input
                      className="flex w-4/12 text-center justify-center items-center h-full border-l border-r border-alternativeLight text-gray-700 leading-tight focus:outline-none focus:bg-white"
                      id="count"
                      type="number"
                      value={ticketCount}
                      onChange={(e) => {
                        if (e.target.value.isNaN) return;
                        const number = parseInt(e.target.value, 10);
                        setTicketCount(number);
                      }}
                      placeholder="0"
                    />
                    <button
                      className="cursor-pointer rounded-md bg-iconBtnColor h-full w-4/12 text-xl hover:scale-y-105"
                      onClick={handleDecrementCount}
                    >
                      -
                    </button>{' '}
                  </div>
                  {totalPrice > 0 && (
                    <div className="w-2/6 h-12">
                      <div className="text-base text-primaryLight">
                        Total Price
                      </div>
                      <div className="text-secondary text-md font-medium">
                        {totalPrice} RUN
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex items-center lg:m">
              <Button
                // onClick={handleSubmit}
                text="Buy Tickets"
                styles="shadow-black w-4/12 lg:w-4/12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
