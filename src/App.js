import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import FacebookLogin from 'react-facebook-login'
import './App.css'

import NavBar from './components/NavBar/NavBar'

import { ProfileForm } from './views/profile-form/ProfileForm'
import { ProductForm } from './views/product-form/ProductForm'

class App extends Component {
  state = {
    user: null
  }
  responseFacebook(response) {
    console.log(response)
    this.setState({user: response})
  }

  render() {
    const user = this.state.user
    return (
      <div style={{padding: '5em'}} className="App">
        <NavBar />
        {this.state.user ? (
          <Router>
            <Route exact path="/" render={()=><ProfileForm name={user.name} email={user.email} id={user.id} />} />
          </Router>
        ) : (
          <FacebookLogin
              appId="350503485475174"
              fields="name,email,picture"
              callback={this.responseFacebook.bind(this)}
              icon="fa-facebook" />
        )}
      </div>
    )
  }
}

export default App
