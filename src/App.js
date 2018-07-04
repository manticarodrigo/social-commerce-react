import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.css'

import Error from './views/Error/Error'
import Loading from './views/Loading/Loading'
import Login from './views/Login/Login'
import Dashboard from './views/Dashboard/Dashboard'
import CategoryForm from './views/Category/CategoryForm'
import ProductForm from './views/Product/ProductForm'
import Catalog from './views/Catalog/Catalog'

import { facebookLogin, fetchCategories, fetchProducts } from './services/WordPress'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      incomingPath: this.props.location.pathname,
      user: null,
      auth: null,
      category: null,
      products: null
    }
    this.handleCategorySent = this.handleCategorySent.bind(this)
    this.handleProductsSent = this.handleProductsSent.bind(this)
    this.handleAuthResponse = this.handleAuthResponse.bind(this)

    const response = JSON.parse(localStorage.getItem('response'))
    if (response) {
      this.processAuth(response)
    } else {
      this.props.history.replace('/ingresa')
    }
  }

  processAuth(response) {
    facebookLogin(response._token.accessToken)
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          const auth = res.data
          fetchCategories(auth)
            .then(res => {
              console.log(res)
              const categories = res.data.filter(category => {
                return category.owner_id === auth.wp_user_id.toString()
              })
              const category = categories[0]
              fetchProducts(category.term_id)
                .then(res => {
                  console.log(res)
                  const products = res.data
                  this.setState({
                    user: response,
                    auth: res.data,
                    category: category,
                    products: products
                  })
                  const { incomingPath } = this.state
                  if (incomingPath == '/ingresa' || incomingPath == '/') {
                    this.props.history.replace('/tienda')
                  } else {
                    this.props.history.replace(this.state.incomingPath)
                  }
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleAuthResponse(response) {
    console.log(response)
    if (response.profile) {
      localStorage.setItem('response', JSON.stringify(response))
      this.processAuth(response)
    }
  }

  handleCategorySent(category) {
    this.setState({ category: category })
    this.props.history.replace('/product/new')
  }

  handleProductsSent() {
    this.setState({ products: true })
    this.props.history.replace('/catalog')
  }

  render() {
    const { user, auth, category, products } = this.state
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Loading} />
          <Route
            exact path='/ingresa'
            render={() => (
              <Login
                onResponse={this.handleAuthResponse} />
            )} />
          <Route
            exact path='/tienda'
            render={() => (
              <Dashboard
                user={user}
                auth={auth}
                category={category}
                products={products} />
          )} />
          <Route
            exact path='/tienda/crea'
            render={() => (
              <CategoryForm
                user={user}
                auth={auth ? auth : null}
                handleSubmit={this.handleCategorySent} />
          )} />
          <Route
            exact path='/producto/crea'
            render={() => (
              <ProductForm
                user={user}
                auth={auth ? auth : null}
                handleSubmit={this.handleProductsSent}
                category={category} />
          )} />
          <Route
            exact path='/catalogo'
            render={() => (
              <Catalog
                category={category} />
          )} />
          <Route component={Error} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)