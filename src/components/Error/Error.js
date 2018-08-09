import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css';

const Error = () => {
  return (
    <div className='Error'>
      <div>
        <p>Este url no existe.</p>
        <p>Por favor regrese a su <Link to='/'>tienda</Link>.</p>
      </div>
    </div>
  )
};

export default Error;