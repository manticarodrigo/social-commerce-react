import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SocialButton from './components/SocialButton/SocialButton'
import './App.css'

import NavBar from './components/NavBar/NavBar'

import { ProfileForm } from './views/profile-form/ProfileForm'
import { ProductForm } from './views/product-form/ProductForm'

import { facebookLogin } from './services/WordPress'

class App extends Component {
  state = {
    user: null,
    auth: null,
    login: true
  }

  toggleLogin() {
    this.setState({login: !this.state.login})
  }

  responseFacebook(response) {
    console.log(response)
    if (response.profile) {
      facebookLogin(response.token.accessToken)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({user: response, auth: res.data})
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  responseGoogle(response) {
    console.log(response)
    // this.setState({user: response})
  }

  render() {
    const user = this.state.user
    const auth = this.state.auth
    return (
      <div className="App">
          {user ? (
            <div>
              <NavBar user={user} />
              <div className='Content'>
                <Router>
                  <Switch>
                    <Route exact path="/" render={()=><ProfileForm profile={user.profile} token={user.token} auth={auth} />} />
                    <Route path="/" component={ProductForm} />
                  </Switch>
                </Router>
              </div>
            </div>
          ) : (
            <div className='Login'>
              <div>
                <h1 style={{color: '#fff'}}>
                  Social Commerce
                </h1>
                <SocialButton
                  provider="facebook"
                  appId="350503485475174"
                  scope="user_photos"
                  onLoginSuccess={this.responseFacebook.bind(this)}
                  onLoginFailure={this.responseFacebook.bind(this)}>
                  {this.state.login ? 'Ingresa' : 'Registra'} con Facebook
                </SocialButton>
                <br />
                <SocialButton
                  provider="google"
                  // appId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                  // onLoginSuccess={this.responseGoogle.bind(this)}
                  // onLoginFailure={this.responseGoogle.bind(this)}
                  >
                  {this.state.login ? 'Ingresa' : 'Registra'} con Google
                </SocialButton>
                <p style={{color: '#fff'}}><a href='#' onClick={this.toggleLogin.bind(this)}>{!this.state.login ? 'Ingresa' : 'Registra'}</a></p>
                <p style={{color: '#fff', fontSize: '14px'}}>Al ingresar esta indicando que ha leido<br />y acepta nuestros <a href="#">Terminos y Condiciones</a>.</p>
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default App
