import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import FacebookLogin from 'react-facebook-login'
import { getAlbums } from './Facebook'
import './App.css'

import { Profile } from './Profile'
import { Product } from './Product'

class App extends Component {
  state = {
    user: null
  }
  responseFacebook(response) {
    console.log(response)
    this.setState({user: response})
    getAlbums(response.accessToken)
  }

  render() {
    const user = this.state.user
    return (
      <div style={{padding: '5em'}} className="App">
        {this.state.user ? (
          <Router>
              <Route exact path="/" render={()=><Product name={user.name} email={user.email} id={user.id} />} />
          </Router>
        ) : (
          <FacebookLogin
              appId="350503485475174"
              fields="name,email,picture"
              callback={this.responseFacebook.bind(this)} />
        )}
      </div>
    )
  }
}

export default App
