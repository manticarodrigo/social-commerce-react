import React from 'react';
import './Error.css';

const Error = () => {
  return (
    <div className='Error'>
      <div>
        <p>Este url no existe.</p>
        <p>Por favor regrese a su <a href='/'>tienda</a>.</p>
      </div>
    </div>
  )
};

export default Error;