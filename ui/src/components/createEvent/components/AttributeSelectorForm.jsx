import React from 'react';
// import Select from '../../common/SelectField';
import Cancel from '../../../assets/icons/cancel.png';
import RUN from '../../../assets/icons/RUN-logo.png';

export default function AttributeSelectorForm({
  attributes,
  handleAttributeChange,
  handleRemoveAttribute,
}) {
  return (
    <div className="mt-3 flex flex-col gap-y-3">
      {attributes.map((attribute, index) => {
        return (
          <div
            key={index}
            style={{ background: '#F8FCFF', height: '72px' }}
            className="flex gap-x-3 border-secondary justify-between items-center border rounded border-dashed p-3"
          >
            <div className="flex gap-x-3">
              <div className="w-56">
                <input
                  type={'text'}
                  className="outline-none rounded-md border-alternativeLight border bg-white text-primary focus:outline-none w-full h-12 pl-4 "
                  placeholder={'Enter Ticket Type Name'}
                  value={attribute.name}
                  name={'ticketType'}
                  onChange={(e) => handleAttributeChange(e, index)}
                />
              </div>
              <div className="w-56">
                <input
                  type={'number'}
                  className="outline-none rounded-md border-alternativeLight border bg-white text-primary focus:outline-none w-full h-12 pl-4 "
                  placeholder={'Enter Ticket Count'}
                  value={attribute.name}
                  name={'ticketCount'}
                  onChange={(e) => handleAttributeChange(e, index)}
                />
              </div>
              <div
                className={`w-56 flex border border-alternativeLight rounded-md items-center px-4 h-12 bg-white flex-start`}
              >
                <input
                  type="number"
                  className="outline-none focus:outline-none w-2/4 h-full rounded-md"
                  placeholder="0.00"
                  value={attribute.name}
                  name={'ticketPrice'}
                  required={true}
                  onChange={(e) => handleAttributeChange(e, index)}
                />
                <div className="w-2/4 flex items-center justify-end">
                  <img src={RUN} className="w-5 mr-2 h-5" alt="Run" />
                  <span className="text-lg">RUN</span>
                </div>
              </div>
            </div>
            <button className="w-max">
              <img
                src={Cancel}
                width="14px"
                height="14px"
                alt="cancel"
                onClick={() => handleRemoveAttribute(index)}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
