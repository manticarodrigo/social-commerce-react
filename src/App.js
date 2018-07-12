import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.css'

import NavBar from './components/NavBar/NavBar'

import Error from './views/Error/Error'
import Loading from './views/Loading/Loading'
import Login from './views/Login/Login'
import Dashboard from './views/Dashboard/Dashboard'
import CategoryForm from './views/Category/CategoryForm'
import ProductForm from './views/Product/ProductForm'
import Catalog from './views/Catalog/Catalog'

import DeleteDialog from './components/Dialog/DeleteDialog'

import {
  facebookLogin,
  fetchCategories,
  fetchProducts,
  deleteProduct,
  updateCategory,
  deleteCategory
} from './services/WordPress'

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
      navBarTitle: null,
      user: null,
      auth: null,
      category: null,
      products: null,
      currentProduct: null,
      nextProduct: null,
      deleteCategoryDialog: null
    }

    // Bind function scopes
    this.handleNavBarTitleUpdates = this.handleNavBarTitleUpdates.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleForward = this.handleForward.bind(this)
    this.handleShare = this.handleShare.bind(this)
    this.handleAuthResponse = this.handleAuthResponse.bind(this)
    this.handleCategorySubmit = this.handleCategorySubmit.bind(this)
    this.handleCategoryDelete = this.handleCategoryDelete.bind(this)
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
                    currentProduct: products[0],
                    nextProduct: null
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
              this.props.history.replace('/perfil')
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

  updateProductLocations(direction) {
    const { products, currentProduct } = this.state
    console.log(this.state)
    if (products && direction === 'back') {
      const index = currentProduct ? products.map(e => { return e.name }).indexOf(currentProduct.name) + 1 : 0
      this.setState({ currentProduct: products[index], nextProduct: products[index - 1] ? products[index - 1] : null })
    } else if (products) {
      const index = currentProduct ? products.map(e => { return e.name }).indexOf(currentProduct.name) - 1 : products.length - 1
      this.setState({ currentProduct: products[index], nextProduct: products[index - 1] ? products[index - 1] : null })
    } else {
      this.setState({ currentProduct: null, nextProduct: null })
    }
  }

  handleBack() {
    const { category, products, currentProduct } = this.state
    if (category && !category.approved) {
      if (!Array.isArray(products) || !products.length) {
        // Array does not exist, is not an array, or is empty
        this.props.history.replace('/perfil')
      } else {
        // Go back an index
        if (currentProduct === products[products.length - 1]) {
          this.setState({ currentProduct: null, nextProduct: null })
          this.props.history.replace('/perfil')
        } else {
          this.updateProductLocations('back')
          this.props.history.replace('/producto')
        }
      }
    } else {
      this.props.history.replace('/')
    }
  }

  handleForward() {
    const { products } = this.state
    if (!Array.isArray(products) || !products.length) {
      // Array does not exist, is not an array, or is empty
      this.setState({ currentProduct: null, nextProduct: null })
      this.props.history.replace('/producto')
    } else {
      // Go forward an index
      this.updateProductLocations('forward')
      this.props.history.replace('/producto')
    }
  }

  handleShare() {
    this.setState({ currentProduct: null, nextProduct: null })
    this.props.history.replace('/catalogo')
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
    this.setState({ category: category })
    if (category.approved) {
      this.props.history.replace('/')
    } else {
      this.updateProductLocations('forward')
      this.props.history.replace('/producto')
    }
  }

  handleCategoryDelete() {
    const { category } = this.state
    const deleteCategoryDialog = (
			<DeleteDialog
				category={category}
				onClose={() => this.setState({ deleteCategoryDialog: null })}
        onConfirm={() => this.finishCategoryDelete(category)} />
		)
		this.setState({ deleteCategoryDialog: deleteCategoryDialog})
  }

  finishCategoryDelete(category) {
    deleteCategory(category.id)
      .then(res => {
        console.log(res)
        this.setState({
          category: null,
          products: null,
          currentProduct: null,
          nextProduct: null
        })
        this.props.history.replace('/perfil')
      })
      .catch(err => {
        console.log(err)
      })
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
    this.setState({ currentProduct: product })
    this.props.history.replace('/producto')
  }

  handleProductAdd() {
    this.setState({ currentProduct: null, nextProduct: null })
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


  backCase() {
    const { pathname, category } = this.state
    if (category && category.approved) {
      return  pathname !== '/' ? true : false
    } else if (pathname !== '/perfil') {
      return true
    }
    return false
  }

  forwardCase() {
    const { pathname, category, products, nextProduct } = this.state
    if (category && !category.approved) {
      if (pathname === '/perfil' && products) {
        return true
      } else if (pathname === '/producto' && nextProduct) {
        return true
      }
    }
    return false
  }

  handleNavBarTitleUpdates(text) {
    this.setState({ navBarTitle: text })
  }

  render() {
    const {
      loading,
      pathname,
      navBarTitle,
      user,
      auth,
      category,
      products,
      currentProduct,
      nextProduct,
      deleteCategoryDialog
    } = this.state
    return (
      <div className='App'>
        {deleteCategoryDialog}
        {pathname !== '/ingresar' && (
          <NavBar
            title={navBarTitle}
            category={category}
            product={currentProduct}
            onBack={this.backCase() ? this.handleBack : null}
            onForward={this.forwardCase() ? this.handleForward : null}
            onDelete={this.handleCategoryDelete}/>
        )}
        {loading && (
          <Loading />
        )}
        <div className='Content'>
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
              exact path='/perfil'
              render={() => (
                <CategoryForm
                  navBarTitle={this.handleNavBarTitleUpdates}
                  category={category}
                  products={products}
                  user={user}
                  auth={auth ? auth : null}
                  onBack={this.handleBack}
                  onForward={this.handleForward}
                  onSubmit={this.handleCategorySubmit} />
            )} />
            <Route
              exact path='/producto'
              render={() => (
                <ProductForm
                  category={category}
                  product={currentProduct}
                  nextProduct={nextProduct}
                  user={user}
                  auth={auth}
                  onAdd={this.handleProductAdd}
                  onSubmit={this.handleProductSubmit}
                  onBack={this.handleBack}
                  onForward={this.handleForward}
                  onDone={this.handleShare} />
            )} />
            <Route
              exact path='/catalogo'
              render={() => (
                <Catalog
                  category={category}
                  onApprove={this.handleApprove}
                  onBack={this.handleBack} />
            )} />
            <Route component={Error} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(App)