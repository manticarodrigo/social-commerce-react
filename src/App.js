import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.css'

import Error from './views/Error/Error'
import Loading from './views/Loading/Loading'
import Login from './views/Login/Login'
import Dashboard from './views/Dashboard/Dashboard'
import CategoryForm from './views/Category/CategoryForm'
import ProductForm from './views/Product/ProductForm'
import Share from './views/Share/Share'

import { facebookLogin, fetchCategories, fetchProducts } from './services/WordPress'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      incomingPath: this.props.location.pathname,
      user: null,
      auth: null,
      category: null,
      products: null,
      selectedProduct: null
    }

    this.handleAuthResponse = this.handleAuthResponse.bind(this)
    this.handleCategoryCreate = this.handleCategoryCreate.bind(this)
    this.handleProductCreate = this.handleProductCreate.bind(this)
    this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this)
    this.handleProductUpdate = this.handleProductUpdate.bind(this)
    this.handleProductSelected = this.handleProductSelected.bind(this)

    const response = JSON.parse(localStorage.getItem('user'))
    if (response) {
      this.processAuth(response)
    } else {
      this.props.history.replace('/ingresa')
    }
  }

  processAuth(response) {
    facebookLogin(response.token.accessToken)
      .then(res => {
        console.log(res)
        if (res.data.cookie) {
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
                  if (incomingPath === '/ingresa' || incomingPath === '/') {
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
        } else {
          localStorage.clear()
          this.props.history.replace('/ingresa')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleAuthResponse(response) {
    console.log(response)
    if (response.profile) {
      const user = {
        profile: response._profile,
        token: response._token
      }
      localStorage.setItem('user', JSON.stringify(user))
      this.processAuth(response)
    }
  }

  handleCategoryCreate(category) {
    this.setState({ category: category })
    this.props.history.replace('/producto/crea')
  }

  handleProductCreate(product) {
    // this.setState({ products: true })
    this.props.history.replace('/comparte')
  }

  handleCategoryUpdate(category) {
    this.setState({ category: category })
    this.props.history.replace('/tienda')
  }

  handleProductUpdate(product) {
    // this.setState({ products: true })
    this.props.history.replace('/tienda')
  }

  handleProductSelected(product) {
    console.log(product)
    this.setState({ selectedProduct: product })
    this.props.history.replace('/producto/edita')
  }

  render() {
    const { user, auth, category, products, selectedProduct } = this.state
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
                products={products}
                onSelect={this.handleProductSelected} />
          )} />
          <Route
            exact path='/tienda/crea'
            render={() => (
              <CategoryForm
                user={user}
                auth={auth ? auth : null}
                onSubmit={this.handleCategoryCreate} />
          )} />
          <Route
            exact path='/tienda/edita'
            render={() => (
              <CategoryForm
                editing={true}
                user={user}
                auth={auth ? auth : null}
                onSubmit={this.handleCategoryUpdate} />
          )} />
          <Route
            exact path='/producto/crea'
            render={() => (
              <ProductForm
                user={user}
                auth={auth ? auth : null}
                product={selectedProduct}
                onSubmit={this.handleProductCreate}
                category={category} />
          )} />
          <Route
            exact path='/producto/edita'
            render={() => (
              <ProductForm
                product={selectedProduct}
                user={user}
                auth={auth ? auth : null}
                onSubmit={this.handleProductUpdate}
                category={category} />
          )} />
          <Route
            exact path='/comparte'
            render={() => (
              <Share
                category={category} />
          )} />
          <Route component={Error} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)