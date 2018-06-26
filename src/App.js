import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
      <div className="App">
        <NavBar />
        <div className='Content'>
          {this.state.user ? (
            <Router>
              <Switch>
                {/* <Route exact path="/" render={()=><ProfileForm name={user.name} email={user.email} id={user.id} />} /> */}
                <Route path="/" component={ProductForm} />
              </Switch>
            </Router>
          ) : (
            <div className='centered'>
              <FacebookLogin
                  appId="350503485475174"
                  fields="name,email,picture"
                  callback={this.responseFacebook.bind(this)}
                  icon="fa-facebook" />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App
