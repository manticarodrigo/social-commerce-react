import React, { Component } from 'react'
import SocialButton from './components/SocialButton/SocialButton'
import './App.css'

import { CategoryForm } from './views/category/CategoryForm'
import { ProductForm } from './views/product/ProductForm'
import { Catalog } from './views/catalog/Catalog'

import { facebookLogin } from './services/WordPress'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login: true,
      user: null,
      auth: null,
      category: null,
      productsCreated: false
    }
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
          // // Test state
          // const testCategory = {
          //   term_id: 16,
          //   term_link: 'http://localhost:8080/product-category/test',
          //   term_name: 'Test'
          // }
          // this.setState({category: testCategory, productsCreated: true})
          this.setState({user: response, auth: res.data})
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  handleCategorySent(category) {
    console.log('Term created, id: ', category.term_id)
    this.setState({ category: category })
  }

  handleProductsSent() {
    this.setState({ productsCreated: true })
  }

  responseGoogle(response) {
    console.log(response)
    // this.setState({user: response})
  }

  render() {
    const { user, auth, category, productsCreated } = this.state
    return (
      <div className="App">
          {user ? (
            <div style={{height: '100%'}}>
              { !category ? (
                <CategoryForm
                  profile={user.profile}
                  token={user.token}
                  auth={auth}
                  handleSubmit={this.handleCategorySent.bind(this)} />
              ) : (
                !productsCreated ? (
                  <ProductForm
                    profile={user.profile}
                    token={user.token}
                    auth={auth}
                    handleSubmit={this.handleProductsSent.bind(this)}
                    category={category} />
                ) : (
                  <Catalog
                    category={category} />
                )
              )}
            </div>
          ) : (
            <div className='Login'>
              <div>
                <h1 style={{color: '#fff'}}>
                  Social Commerce
                </h1>
                <SocialButton
                  provider="facebook"
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
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
