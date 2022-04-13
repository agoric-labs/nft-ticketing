import React, { useEffect, useState } from 'react';
import Arrow from '../../../assets/icons/arrow-select.png';
import { useApplicationContext } from '../../../context/Application';
import { ipfsUrl } from '../../../tickets';
import {
  setActiveCard,
  setModalType,
  setOpenModal,
} from '../../../store/store';
import Button from '../../common/Button';
import { Modal } from '../../../helpers/ModalActions';
import { getDateTime } from '../../../helpers/date';

const TicketCard = ({ cardDetail }) => {
  const { dispatch } = useApplicationContext();
  const [ticketCount, setTicketCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [selectedTicketInMenu, setSelectedTicketInMenu] = useState({});
  const [error, setError] = useState('');
  const image = `${ipfsUrl + cardDetail.image}`;

  useEffect(() => {
    setTotalPrice(parseInt(selectedTicket.ticketPrice * ticketCount, 10));
  }, [selectedTicket, ticketCount]);
  const handleIncrementCount = () => {
    if (!selectedTicket.ticketType) {
      setError('Select a ticket type first');
      return;
    }
    setError('');
    const ticketsLeft = selectedTicket.ticketCount - cardDetail.ticketsSold;
    if (ticketCount === ticketsLeft) {
      setError(
        `Only ${selectedTicket.ticketCount} tickets for ${selectedTicket.ticketType} section are left`,
      );
      return;
    }
    setTicketCount(ticketCount + 1);
  };
  const handleDecrementCount = () => {
    if (!selectedTicket.ticketType) {
      setError('Select a ticket type first');
      return;
    } else if (ticketCount === 0) return;
    setError('');
    setTicketCount(ticketCount - 1);
  };
  const handleMenuOption = (e) => {
    setError('');
    const selectedTicketType = cardDetail.eventDetails.find(
      (ticket) => ticket.ticketType === e.target.value,
    );
    setSelectedTicketInMenu(e.target.value);
    setSelectedTicket(selectedTicketType);
  };
  const handleBuyTicket = () => {
    if (!selectedTicket.ticketType) {
      setError('Select a ticket type first');
      return;
    } else if (totalPrice === 0) {
      setError('Increase the number of tickets');
      return;
    } else setError('');
    dispatch(
      setActiveCard({
        id: cardDetail.id,
        name: cardDetail.name,
        date: cardDetail.date,
        image: cardDetail.image,
        ...selectedTicket,
        ticketCount,
        totalPrice,
      }),
    );
    dispatch(setModalType(Modal.MARKETPLACE));
    dispatch(setOpenModal(true));
  };

  return (
    <div className="flex flex-col md:flex-row p-4 border border-alternativeLight rounded-md my-10 transition-all duration-100 hover:shadow-xl">
      <div className="w-full md:6/12 lg:w-5/12">
        <img
          className="h-full w-full rounded-md"
          src={image}
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
              <div className="text-secondary text-base mt-0 lg:mt-2">
                {getDateTime(new Date(cardDetail.date).toLocaleString())}
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
                className={`flex flex-col space-y-4  space-x-0 lg:space-x-8  lg:flex-row lg:space-y-0 justify-start `}
              >
                <div className="w-full lg:w-6/12 ">
                  <select
                    value={selectedTicketInMenu}
                    type="object"
                    style={{
                      backgroundImage: `url(${Arrow})`,
                      backgroundSize: '15px',
                      backgroundPositionY: 'center',
                      backgroundPositionX: '95%',
                    }}
                    name={'ticket'}
                    onChange={handleMenuOption}
                    className={`bg-no-repeat cursor-pointer rounded-md w-full h-12 px-3.5 text-lg outline-none focus:outline-none font-normal border-alternativeLight border bg-white text-primaryLight`}
                  >
                    <option hidden>Ticket Type</option>
                    {cardDetail?.eventDetails?.map((item, i) => {
                      const optionValue = `${item.ticketType}  -  ${item.ticketPrice}.00 RUN`;
                      return (
                        <option
                          type="text"
                          key={i}
                          value={item.ticketType}
                          className="text-lg text-black"
                        >
                          {optionValue}
                        </option>
                      );
                    })}
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
                onClick={handleBuyTicket}
                text="Buy Tickets"
                styles="shadow-black w-4/12 lg:w-4/12"
              />
              {error && <span className="pl-5 text-red-600">{error}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
