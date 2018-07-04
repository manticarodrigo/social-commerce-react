import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import './Loading.css'

class Loading extends Component {
  render() {
    return (
      <div className='Loading'>
        <CircularProgress size={50} />
      </div>
    )
  }
}

export default Loading