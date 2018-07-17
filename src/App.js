import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchProducts } from './actions/productActions';
import './App.css';

import NavBar from './components/NavBar/NavBar';

import Error from './views/Error/Error';
import Loading from './views/Loading/Loading';
import Login from './views/Login/Login';
import Dashboard from './views/Dashboard/Dashboard';
import CategoryForm from './views/Category/CategoryForm';
import PaymentOptions from './views/Payment/PaymentOptions';
import ShippingOptions from './views/Shipping/ShippingOptions';
import ProductForm from './views/Product/ProductForm';
import ProductAnalytics from './views/ProductAnalytics/ProductAnalytics';
import Catalog from './views/Catalog/Catalog';

import DeleteDialog from './components/Dialog/DeleteDialog';

import {
  facebookLogin,
  fetchCategories,
  deleteProduct,
  updateCategory,
  deleteCategory
} from './services/WordPress';

class App extends Component {
  constructor(props) {
    super(props);
    
    // Check for current user
    const response = JSON.parse(localStorage.getItem('user'));
    if (response) {
      this.processAuth(response);
    } else {
      this.props.history.replace('/ingresar');
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
      deleteCategoryOpen: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props.location.pathname)
    return { pathname: props.location.pathname }
  }

  processAuth = (response) => {
    const { fetchProducts } = this.props;
    console.log(fetchProducts)
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
                  console.log(this.state)
                  const { pathname } = this.state
                  if (pathname === '/ingresar' || pathname === '/') {
                    this.props.history.replace(category.approved ? '/' : '/producto')
                  } else {
                    this.props.history.replace(pathname);
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

  handleAuthResponse = (response) => {
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

  updateProductLocations = (direction) => {
    const { products, currentProduct } = this.state
    if (Boolean(products) && direction === 'back') {
      var index = currentProduct ? (
        products
          .map(e => { return e.name })
          .indexOf(currentProduct.name) + 1
      ) : 0
      this.setState({
        currentProduct: products[index],
        nextProduct: products[index - 1] ? products[index - 1] : null
      })
      return
    }
    if (Boolean(products)) {
      index = currentProduct ? (
        products
          .map(e => { return e.name })
          .indexOf(currentProduct.name) - 1
      ) : products.length - 1
      this.setState({
        currentProduct: products[index !== -1 ? index : 0],
        nextProduct: products[index - 1] ? products[index - 1] : null
      })
      return
    } else {
      this.setState({ currentProduct: null, nextProduct: null })
    }
  }

  handleBack = () => {
    const { pathname, category, products, currentProduct } = this.state;
    this.setState({ navBarTitle: null });
    if (category && !category.approved) {
      if (pathname === '/envios') {
        console.log('back');
        this.props.history.replace('/pagos');
      }
      if (pathname === '/pagos') {
        this.props.history.replace('/perfil');
      }
      if (pathname === '/producto') {
        if (!Array.isArray(products) || !products.length) {
          // Array does not exist, is not an array, or is empty
          this.updateProductLocations('back');
          this.props.history.replace('/envios');
          return;
        } else if (currentProduct === products[products.length - 1]) {
          // Last product in list
          this.setState({ currentProduct: null, nextProduct: null });
          this.props.history.replace('/envios');
          return;
        }
        this.updateProductLocations('back');
        this.props.history.replace('/producto');
      }
      if (pathname === '/catalogo') {
        this.updateProductLocations('back')
        this.props.history.replace('/producto');
      }
    } else {
      this.setState({ navBarTitle: null });
      this.props.history.replace('/');
    }
  }

  handleForward = () => {
    const { pathname, products, currentProduct } = this.state
    this.setState({ navBarTitle: null })
    if (pathname === '/perfil') {
      this.props.history.replace('/pagos')
    }
    if (pathname === '/pagos') {
      this.props.history.replace('/envios')
    }
    if (pathname === '/envios') {
      if (!Array.isArray(products) || !products.length) {
        // Array does not exist, is not an array, or is empty
        this.setState({ currentProduct: null, nextProduct: null, navBarTitle: null })
      } else {
        // Go forward an index
        this.updateProductLocations('forward')
      }
      this.props.history.replace('/producto')
    }
    if (pathname === '/producto') {
      if (currentProduct == products[0]) {
        // First product in list
       this.updateProductLocations('forward')
       this.props.history.replace('/catalogo')
      } else {
        this.updateProductLocations('forward')
        this.props.history.replace('/producto')
      }
    }
  }

  handleShare = () => {
    this.setState({ currentProduct: null, nextProduct: null })
    this.props.history.replace('/catalogo')
  }

  handleApprove = () => {
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

  handleCategorySubmit = (category) => {
    this.setState({
      category: category,
      navBarTitle: null
    })
    if (category.approved) {
      this.props.history.replace('/')
    } else {
      // this.updateProductLocations('forward')
      this.props.history.replace('/pagos')
    }
  }

  handleCategoryDelete = () => {
		this.setState({ deleteCategoryOpen: true })
  }

  handlePaymentOptionsSubmit = (category) => {
    this.setState({
      category: category ? category : this.state.category ? this.state.category : null,
      navBarTitle: null
    })
    if (category && category.approved) {
      this.props.history.replace('/')
    } else {
      // this.updateProductLocations('forward')
      this.props.history.replace('/envios')
    }
  }

  handleShippingOptionsSubmit = (category) => {
    this.setState({ category: category, navBarTitle: null })
    if (category && category.approved) {
      this.props.history.replace('/')
    } else {
      this.updateProductLocations('forward')
      this.props.history.replace('/producto')
    }
  }

  finishCategoryDelete = (category) => {
    deleteCategory(category.id)
      .then(res => {
        console.log(res)
        this.setState({
          category: null,
          products: null,
          currentProduct: null,
          nextProduct: null,
          navBarTitle: null,
          deleteCategoryOpen: false
        })
        this.props.history.replace('/perfil')
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleProductSubmit = () => {
    const { category } = this.state
    const { fetchProducts } = this.props;
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

  handleProductSelected = (product) => {
    this.setState({ currentProduct: product, navBarTitle: null })
    this.props.history.replace('/producto')
  }

  handleProductAnalytics = (product) => {
    this.setState({ currentProduct: product })
    this.props.history.replace('/producto/analisis')
  }

  handleProductAdd = () => {
    this.setState({ currentProduct: null, nextProduct: null, navBarTitle: null })
    this.props.history.replace('/producto')
  }

  handleProductDelete = (product) => {
    const { category } = this.state
    const { fetchProducts } = this.props;
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


  backCase = () => {
    const { pathname, category } = this.state
    if (category && category.approved) {
      return  pathname !== '/' ? true : false
    } else if (pathname !== '/perfil') {
      return true
    }
    return false
  }

  forwardCase = () => {
    const { pathname, category, products, nextProduct } = this.state
    if (category && !category.approved) {
      if (pathname === '/perfil' && products) {
        return true
      } else if (pathname === '/producto' && nextProduct) {
        return true
      } else if (pathname === '/pagos') {
        return true
      } else if (pathname === '/envios') {
        return true
      }
      return false
    }
    return false
  }

  handleTitleChange = (text) => {
    this.setState({ navBarTitle: text })
  }

  render() {
    const {
      loading,
      pathname,
      user,
      auth,
      category,
      currentProduct,
      nextProduct,
      deleteCategoryOpen
    } = this.state
    const { products } = this.props
    console.log(products)
    return (
      <div className='App'>
        {category && (
          <DeleteDialog
            open={deleteCategoryOpen}
            category={category}
            onClose={() => this.setState({ deleteCategoryOpen: false })}
            onConfirm={() => this.finishCategoryDelete(category)} />
        )}
        {pathname !== '/ingresar' && (
          <NavBar
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
                  onTitleChange={this.handleTitleChange}
                  category={category}
                  products={products}
                  onSelect={this.handleProductSelected}
                  onAnalytics={this.handleProductAnalytics}
                  onAdd={this.handleProductAdd}
                  onDelete={this.handleProductDelete} />
            )} />
            <Route
              exact path='/perfil'
              render={() => (
                <CategoryForm
                  onTitleChange={this.handleTitleChange}
                  category={category}
                  products={products}
                  user={user}
                  auth={auth}
                  onBack={this.handleBack}
                  onForward={this.handleForward}
                  onSubmit={this.handleCategorySubmit} />
            )} />
            <Route
              exact path='/pagos'
              render={() => (
                <PaymentOptions
                  onTitleChange={this.handleTitleChange}
                  category={category}
                  auth={auth}
                  onSubmit={this.handlePaymentOptionsSubmit} />
            )} />
            <Route
              exact path='/envios'
              render={() => (
                <ShippingOptions
                  onTitleChange={this.handleTitleChange}
                  category={category}
                  auth={auth}
                  onSubmit={this.handleShippingOptionsSubmit} />
            )} />
            <Route
              exact path='/producto'
              render={() => (
                <ProductForm
                  onTitleChange={this.handleTitleChange}
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
              exact path='/producto/analisis'
              render={() => (
                <ProductAnalytics
                  onTitleChange={this.handleTitleChange}
                  user={user}
                  product={currentProduct}
                  onBack={this.handleBack}
                />
            )} />
            <Route
              exact path='/catalogo'
              render={() => (
                <Catalog
                  onTitleChange={this.handleTitleChange}
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

const mapStateToProps = state => ({
  products: state.products.products
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (route) => push(route),
  fetchProducts

}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)((withRouter(App)));