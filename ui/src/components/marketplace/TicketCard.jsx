import React from 'react';
// import User from '../assets/icons/user.png';
// import { stringifyValueRUN } from '../utils/amount';
import { images } from '../../images';
import Button from '../common/Button';
import Select from '../common/SelectField';

const TicketCard = ({ cardDetail }) => {
  const showPrice = true;
  console.log(cardDetail);
  return (
    <div className="flex flex-col sm:flex-row p-4 border border-alternativeLight rounded-md my-10  transform transition duration-200 hover:scale-105">
      <div className="w-full sm:w-5/12">
        <img
          className="h-full w-full rounded-md"
          src={images[cardDetail.name]}
          alt={cardDetail?.name}
        />
      </div>
      <div className="w-full sm:w-7/12 flex flex-row pl-6 pt-2">
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
          <div className="space-y-4">
            <div className="space-y-2">
              <div>Select Ticket(s)</div>
              <div className={'flex flex-col  md:flex-row space-x-4'}>
                <div className="w-full md:w-6/12 ">
                  <Select
                    // handleChange={(e) => handleAttributeChange(e, index)}
                    fieldName={'display_type'}
                    // value={attribute.display_type}
                    style={
                      'border-alternativeLight border bg-white text-primary'
                    }
                  >
                    <option value={''} hidden defaultChecked>
                      Ticket Type
                    </option>
                  </Select>
                </div>
                <div className="w-3/12 flex flex-row border border-alternativeLight rounded-md hover:shadow-sm h-12">
                  <button className="cursor-pointer rounded-md bg-iconBtnColor h-full w-4/12 text-xl hover:scale-y-105">
                    +
                  </button>
                  <div className="flex w-4/12 justify-center items-center h-full border-l border-r border-alternativeLight">
                    100
                  </div>
                  <button className="cursor-pointer rounded-md bg-iconBtnColor h-full w-4/12 text-xl hover:scale-y-105">
                    -
                  </button>{' '}
                </div>
                {showPrice && (
                  <div className="w-2/12 h-12">
                    <div className="text-base text-primaryLight">
                      Total Price
                    </div>
                    <div className="text-secondary text-lg font-medium">
                      250.00 RUN
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              // onClick={handleSubmit}
              text="Buy Tickets"
              styles="w-4/12 mx-auto shadow-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
