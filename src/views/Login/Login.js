import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import SocialButton from '../../components/SocialButton/SocialButton'

class Login extends Component {
	constructor(props) {
    super(props)
    this.state = {
      login: true,
      secondary: false,
    }
    this.handleResponse = this.handleResponse.bind(this)
  }
  
  toggleLogin() {
    this.setState({login: !this.state.login})
  }

  handleResponse(response) {
    this.props.onResponse(response)
  }
  
	render() {
	  return (
			<div className='Login'>
        <div>
          <h1 style={{color: '#fff'}}>
            Social Commerce
          </h1>
          <SocialButton
            provider="facebook"
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            scope="user_photos"
            onLoginSuccess={this.handleResponse}
            onLoginFailure={this.handleResponse}>
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
	  )
	}
}

export default withRouter(Login)