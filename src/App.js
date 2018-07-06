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

import { facebookLogin, fetchCategories, fetchProducts, deleteProduct } from './services/WordPress'

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

    this.handleBack = this.handleBack.bind(this)
    this.handleAuthResponse = this.handleAuthResponse.bind(this)
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this)
    this.handleProductSubmit = this.handleProductSubmit.bind(this)
    this.handleProductSelected = this.handleProductSelected.bind(this)
    this.handleProductDelete = this.handleProductDelete.bind(this)

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
              const category = res.data[0]
              fetchProducts(category.id)
                .then(res => {
                  console.log(res)
                  const products = res.data
                  this.setState({
                    user: response,
                    auth: auth,
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
                  this.setState({ user: response, auth: auth })
                  this.props.history.replace('/tienda')
                })
            })
            .catch(err => {
              console.log(err)
              this.setState({ user: response, auth: auth })
              this.props.history.replace('/tienda')
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

  handleBack() {
    this.setState({ selectedProduct: null })
  }

  handleCategorySubmit(category) {
    const { products } = this.state
    this.setState({ category: category })
    this.props.history.replace(products ? '/tienda' : '/producto/crea')
  }

  handleProductSubmit() {
    const { category } = this.state
    fetchProducts(category.id)
      .then(res => {
        console.log(res)
        const products = res.data
        this.setState({ products: products })
        this.props.history.replace('/comparte')
      })
      .catch(err => {
        console.log(err)
        this.props.history.replace('/comparte')
      })
  }

  handleProductSelected(product) {
    this.setState({ selectedProduct: product })
    this.props.history.replace('/producto/edita')
  }

  handleProductDelete(product) {
    const { category } = this.state
    deleteProduct(product.id)
      .then(res => {
        console.log(res)
        fetchProducts(category.id)
          .then(res => {
            console.log(res)
            const products = res.data
            this.setState({ products: products })
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
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
                onSelect={this.handleProductSelected}
                onDelete={this.handleProductDelete} />
          )} />
          <Route
            exact path='/tienda/crea'
            render={() => (
              <CategoryForm
                user={user}
                auth={auth ? auth : null}
                onSubmit={this.handleCategorySubmit} />
          )} />
          <Route
            exact path='/tienda/edita'
            render={() => (
              <CategoryForm
                category={category}
                user={user}
                auth={auth ? auth : null}
                onSubmit={this.handleCategorySubmit} />
          )} />
          <Route
            exact path='/producto/crea'
            render={() => (
              <ProductForm
                user={user}
                auth={auth ? auth : null}
                product={selectedProduct}
                onBack={this.handleBack}
                onSubmit={this.handleProductSubmit}
                category={category} />
          )} />
          <Route
            exact path='/producto/edita'
            render={() => (
              <ProductForm
                product={selectedProduct}
                user={user}
                auth={auth ? auth : null}
                onBack={this.handleBack}
                onSubmit={this.handleProductSubmit}
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