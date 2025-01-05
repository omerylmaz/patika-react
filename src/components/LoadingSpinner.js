import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const Spinner = ({ size = 80, color = '#0d6efd', className = '' }) => {
  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{ height: '100vh' }}
    >
      <TailSpin color={color} height={size} width={size} />
    </div>
  );
};

export default Spinner;
