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

import { facebookLogin, fetchCategories, fetchProducts, deleteProduct, updateCategory } from './services/WordPress'

class App extends Component {
  constructor(props) {
    super(props)
    // Check for current user
    const response = JSON.parse(localStorage.getItem('user'))
    if (response) {
      this.processAuth(response)
    } else {
      this.props.history.replace('/ingresar')
    }
    // Set initial app state
    this.state = {
      loading: response ? true : false,
      pathname: this.props.location.pathname,
      user: null,
      auth: null,
      category: null,
      products: null,
      selectedProduct: null,
      selectedIndex: null
    }
    // Bind function scopes
    this.handleBack = this.handleBack.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleAuthResponse = this.handleAuthResponse.bind(this)
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this)
    this.handleProductSubmit = this.handleProductSubmit.bind(this)
    this.handleProductSelected = this.handleProductSelected.bind(this)
    this.handleProductAdd = this.handleProductAdd.bind(this)
    this.handleProductDelete = this.handleProductDelete.bind(this)
    this.handleApprove = this.handleApprove.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    return { pathname: props.location.pathname }
  }

  processAuth(response) {
    // Use fb sdk response for wp auth
    facebookLogin(response.token.accessToken)
      .then(res => {
        console.log(res)
        if (res.data.cookie) {
          const auth = res.data
          // Check for existing categories for owner_id
          fetchCategories(auth)
            .then(res => {
              console.log(res)
              const category = res.data[0]
              // Check for existing products for category
              fetchProducts(category.id)
                .then(res => {
                  console.log(res)
                  const products = res.data
                  this.setState({
                    loading: false,
                    user: response,
                    auth: auth,
                    category: category,
                    products: products,
                    selectedProduct: products[0],
                    selectedIndex: 0
                  })
                  const { pathname } = this.state
                  if (pathname === '/ingresar' || pathname === '/') {
                    this.props.history.replace(category.approved ? '/' : '/producto')
                  } else {
                    this.props.history.replace(pathname)
                  }
                })
                .catch(err => {
                  console.log(err)
                  this.setState({ loading: false, user: response, auth: auth })
                  this.props.history.replace('/')
                })
            })
            .catch(err => {
              console.log(err)
              this.setState({ loading: false, user: response, auth: auth })
              this.props.history.replace('/perfíl')
            })
        } else {
          localStorage.clear()
          this.setState({ loading: false })
          this.props.history.replace('/ingresar')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleAuthResponse(response) {
    // Facebook login callback
    console.log(response)
    if (response.profile) {
      const user = {
        profile: response._profile,
        token: response._token
      }
      localStorage.setItem('user', JSON.stringify(user))
      this.setState({ loading: true })
      this.processAuth(response)
    }
  }

  handleBack() {
    const { pathname, category, products, selectedIndex } = this.state
    console.log(this.state)
    if (category && !category.approved) {
      if (!Array.isArray(products) || !products.length) {
        // Array does not exist, is not an array, or is empty
        this.props.history.replace('/perfíl')
      } else {
        // Go back an index
        const index = selectedIndex ? selectedIndex + 1 : 1
        if (index > products.length - 1) {
          this.props.history.replace('/perfíl')
        } else {
          this.setState({ selectedProduct: products[index], selectedIndex: index })
          this.props.history.replace('/producto')
        }
      }
    } else {
      this.props.history.replace('/')
    }
  }

  handleShare() {
    this.props.history.replace('/catálogo')
  }

  handleApprove() {
    const { auth, category } = this.state
    category.approved = true
    updateCategory(auth, category)
      .then(res => {
        console.log(res)
        this.props.history.replace('/')
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleCategorySubmit(category) {
    const { products, selectedProduct } = this.state
    this.setState({ category: category, selectedIndex: null })
    this.props.history.replace(selectedProduct ? '/producto' : '/')
  }

  handleProductSubmit() {
    const { category } = this.state
    fetchProducts(category.id)
      .then(res => {
        console.log(res)
        const products = res.data
        this.setState({ products: products })
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleProductSelected(product) {
    const { products } = this.state
    const index = products.map(e => { return e.name }).indexOf(product.name);
    this.setState({ selectedProduct: product, selectedIndex: index })
    this.props.history.replace('/producto')
  }

  handleProductAdd() {
    console.log(this.state)
    this.setState({ selectedProduct: null })
    this.props.history.replace('/producto')
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
    const { loading, user, auth, category, products, selectedProduct } = this.state
    return (
      <div className='App'>
        {loading && (
          <Loading />
        )}
        <Switch>
          <Route
            exact path='/ingresar'
            render={() => (
              <Login
                onResponse={this.handleAuthResponse} />
            )} />
          <Route
            exact path='/'
            render={() => (
              <Dashboard
                category={category}
                products={products}
                onSelect={this.handleProductSelected}
                onAdd={this.handleProductAdd}
                onDelete={this.handleProductDelete} />
          )} />
          <Route
            exact path='/perfíl'
            render={() => (
              <CategoryForm
                category={category}
                user={user}
                auth={auth ? auth : null}
                onBack={this.handleBack}
                onSubmit={this.handleCategorySubmit} />
          )} />
          <Route
            exact path='/producto'
            render={() => (
              <ProductForm
                product={selectedProduct}
                user={user}
                auth={auth}
                onAdd={this.handleProductAdd}
                onSubmit={this.handleProductSubmit}
                onBack={this.handleBack}
                onDone={this.handleShare}
                category={category} />
          )} />
          <Route
            exact path='/catálogo'
            render={() => (
              <Catalog
                category={category}
                onApprove={this.handleApprove}
                onBack={this.handleBack} />
          )} />
          <Route component={Error} />
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)