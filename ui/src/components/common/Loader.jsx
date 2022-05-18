import React from 'react';

function Loader({ color, size, inModal }) {
  return (
    <div>
      <div
        style={{ borderTopColor: 'transparent' }}
        className={`w-${size !== undefined ? size : 8} h-${
          size !== undefined ? size : 8
        } border-2 border-${
          !color ? 'secondary' : color
        } border-solid rounded-full animate-spin ${
          inModal && 'absolute right-12'
        } `}
      ></div>
    </div>
  );
}

export default Loader;
