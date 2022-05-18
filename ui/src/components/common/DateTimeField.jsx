import React from 'react';
// import CalenderIcon from '../../assets/icons/date-icon.png';

function DateTimeField({ noLabels = false, disabled, value }) {
  return (
    <div>
      {!noLabels && (
        <span
          className={`text-lg leading-none ${
            disabled && 'text-primaryLight select-none'
          }`}
        >
          Date and Time
        </span>
      )}
      <div className="flex relative justify-between  border border-alternativeLight rounded items-center">
        <input
          value={value}
          disabled={disabled}
          type="datetime-local"
          className="w-full h-12 pl-4 outline-none pr-4 focus:outline-none text-primaryLight"
        />
      </div>
    </div>
  );
}

export default DateTimeField;
