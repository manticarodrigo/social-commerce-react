import React, { Component } from 'react'
import SocialButton from '../../components/SocialButton/SocialButton'
import './Login.css'
import Logo from '../../assets/png/Logo.png'

import TermsDialog from '../../components/Dialog/TermsDialog'

class Login extends Component {
	constructor(props) {
    super(props)
    this.state = {
      login: true,
      termsDialogOpen: false
    }
  }
  
  toggleLogin = () => {
    this.setState({login: !this.state.login})
  }

  handleTerms = () => {
    this.setState({ termsDialogOpen: true })
  }

  handleResponse = (response) => {
    this.props.onResponse(response)
  }
  
	render() {
    const { termsDialogOpen } = this.state
	  return (
			<div className='Login'>
        <TermsDialog
          open={termsDialogOpen}
          onClose={() => this.setState({
            termsDialogOpen: false
          })} />
        <div>
          <img src={Logo} alt='HeyShopper Logo' />
          <SocialButton
            type='facebook'
            provider='facebook'
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            scope='user_photos, pages_show_list'
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
            style={{color: '#fff', fontSize: '15px'}}>
            {!this.state.login ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
            <a 
              onClick={this.toggleLogin}>
              {!this.state.login ? 'Ingresa acá.' : 'Registra acá.'}
            </a>
          </p>
          <p
            style={{color: '#fff', fontSize: '14px'}}>
            Al ingresar esta indicando que ha leido<br />y acepta nuestros <a onClick={this.handleTerms}>Terminos y Condiciones</a>.
          </p>
        </div>
      </div>
	  )
	}
}

export default Login