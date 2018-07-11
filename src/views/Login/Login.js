import React, { Component } from 'react'
import SocialButton from '../../components/SocialButton/SocialButton'
import './Login.css'

import TermsDialog from '../../components/Dialog/TermsDialog'

class Login extends Component {
	constructor(props) {
    super(props)
    this.state = {
      login: true,
      termsDialog: null
    }

    this.handleTerms = this.handleTerms.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }
  
  toggleLogin() {
    this.setState({login: !this.state.login})
  }

  handleTerms() {
    const termsDialog = (
      <TermsDialog
        onClose={() => this.setState({ termsDialog: null })} />
    )
    this.setState({ termsDialog: termsDialog })
  }

  handleResponse(response) {
    this.props.onResponse(response)
  }
  
	render() {
    const { termsDialog } = this.state
	  return (
			<div className='Login'>
        {termsDialog}
        <div>
          <h1 style={{color: '#fff'}}>
            <span>HeyShopper</span>
          </h1>
          <SocialButton
            type='facebook'
            provider='facebook'
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            scope='user_photos'
            onLoginSuccess={this.handleResponse}
            onLoginFailure={this.handleResponse}>
            {this.state.login ? 'Ingresar' : 'Registrar'} con Facebook
          </SocialButton>
          <br />
          <SocialButton
            type='google'
            provider='google'
            appId={process.env.REACT_APP_GOOGLE_APP_ID}
            // onLoginSuccess={this.handleResponse}
            // onLoginFailure={this.handleResponse}
            onClick={() => alert('Not implemented')}>
            {this.state.login ? 'Ingresar' : 'Registrar'} con Google
          </SocialButton>
          <p
            style={{color: '#fff', fontSize: '14px'}}
            onClick={this.toggleLogin.bind(this)}>
            {!this.state.login ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <a >{!this.state.login ? 'Ingresa acá.' : 'Registra acá.'}</a>
          </p>
          <p
            style={{color: '#fff', fontSize: '13px'}}>
            Al ingresar esta indicando que ha leido<br />y acepta nuestros <a onClick={this.handleTerms}>Terminos y Condiciones</a>.
          </p>
        </div>
      </div>
	  )
	}
}

export default Login