import React, { Component } from 'react'
import './Error.css'

class Error extends Component {
  render() {
    return (
      <div className='Error'>
        <div>
          <p>Este url no existe.</p>
          <p>Por favor regrese a su <a href='/'>tienda</a>.</p>
        </div>
      </div>
    )
  }
}

export default Error