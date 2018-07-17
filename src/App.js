import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  facebookLogin
} from './actions/authActions';
import {
  updatePathname
} from './actions/navActions';
import {
  fetchCategories,
  updateCategory,
  deleteCategory
} from './actions/categoryActions';
import {
  fetchProducts,
  updateProductLocations,
  resetProductLocations
} from './actions/productActions';
import {
  deleteProduct,
} from './services/WordPress';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      deleteCategoryOpen: false
    };
  }

  componentDidMount() {
    // Check for current user
    const response = JSON.parse(localStorage.getItem('user'));
    if (response) {
      this.setState({ loading: true })
      this.processAuth(response);
    } else {
      this.props.changePage('/ingresar');
    }
  }

  static getDerivedStateFromProps(props, state) {
    props.updatePathname(props.history.location.pathname);
    return null;
  }

  processAuth = (response) => {
    const {
      facebookLogin,
      fetchCategories,
      fetchProducts,
      changePage
    } = this.props;
    // Use fb sdk response for wp auth
    facebookLogin(response)
      .then(() => {
        const { auth } = this.props;
        if (auth) {
          // Check for existing categories for owner_id
          fetchCategories(auth)
            .then(() => {
              const { category } = this.props;
              if (category) {
                // Check for existing products for category
                fetchProducts(category.id)
                  .then(() => {
                    this.setState({ loading: false });
                    const { pathname } = this.props;
                    if (pathname === '/ingresar' || pathname === '/') {
                      changePage(category.approved ? '/' : '/producto');
                    } else {
                      changePage(pathname);
                    }
                  })
              } else {
                this.setState({ loading: false });
                changePage('/perfil');
              }
            });
        } else {
          localStorage.clear();
          this.setState({ loading: false });
          changePage('/ingresar');
        }
      })
  }

  handleAuthResponse = (response) => {
    // Facebook login callback
    console.log(response);
    if (response.profile) {
      const user = {
        profile: response._profile,
        token: response._token
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.setState({ loading: true });
      this.processAuth(response);
    }
  }

  handleShare = () => {
    this.setState({ currentProduct: null, nextProduct: null });
    this.props.changePage('/catalogo');
  }

  handleApprove = () => {
    const { auth, category, updateCategory } = this.props;
    category.approved = true;
    updateCategory(auth, category)
      .then(res => {
        console.log(res);
        this.props.changePage('/');
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleCategorySubmit = () => {
    const { category, changePage } = this.props;
    if (category.approved) {
      changePage('/');
    } else {
      changePage('/pagos');
    }
  }

  handleCategoryDelete = () => {
		this.setState({
      deleteCategoryOpen: true
    })
  }

  handlePaymentOptionsSubmit = () => {
    const {
      category,
      changePage
    } = this.props;
    if (category && category.approved) {
      changePage('/');
    } else {
      changePage('/envios');
    }
  }

  handleShippingOptionsSubmit = () => {
    const {
      category,
      products,
      currentProduct,
      changePage,
      updateProductLocations
    } = this.props;
    if (category && category.approved) {
      changePage('/');
    } else {
      updateProductLocations('forward', products, currentProduct);
      changePage('/producto');
    }
  }

  finishCategoryDelete = (category) => {
    const { deleteCategory, changePage } = this.props;
    deleteCategory(category.id)
      .then(() => {
        this.setState({
          deleteCategoryOpen: false
        })
        changePage('/perfil');
      });
  }

  handleProductSelected = (product) => {
    this.setState({ currentProduct: product })
    this.props.changePage('/producto')
  }

  handleProductAnalytics = (product) => {
    this.setState({ currentProduct: product })
    this.props.changePage('/producto/analisis')
  }

  handleProductAdd = () => {
    const { resetProductLocations, changePage } = this.props;
    resetProductLocations()
    changePage('/producto')
  }

  handleProductDelete = (product) => {
    const { category, fetchProducts } = this.props;
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
    const {
      pathname,
      category
    } = this.props;
    const {
      loading,
      deleteCategoryOpen
    } = this.state;
    return (
      <div className='App'>
        {category && (
          <DeleteDialog
            open={deleteCategoryOpen}
            onClose={() => this.setState({ deleteCategoryOpen: false })}
            onConfirm={() => this.finishCategoryDelete(category)} />
        )}
        {pathname !== '/ingresar' && (
          <NavBar
            onBack={this.handleBack}
            onForward={this.handleForward}
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
                  onSelect={this.handleProductSelected}
                  onAnalytics={this.handleProductAnalytics}
                  onAdd={this.handleProductAdd}
                  onDelete={this.handleProductDelete} />
            )} />
            <Route
              exact path='/perfil'
              render={() => (
                <CategoryForm
                  onBack={this.handleBack}
                  onForward={this.handleForward}
                  onSubmit={this.handleCategorySubmit} />
            )} />
            <Route
              exact path='/pagos'
              render={() => (
                <PaymentOptions
                  onSubmit={this.handlePaymentOptionsSubmit} />
            )} />
            <Route
              exact path='/envios'
              render={() => (
                <ShippingOptions
                  onSubmit={this.handleShippingOptionsSubmit} />
            )} />
            <Route
              exact path='/producto'
              render={() => (
                <ProductForm
                  onAdd={this.handleProductAdd}
                  onBack={this.handleBack}
                  onDone={this.handleShare} />
            )} />
            <Route
              exact path='/producto/analisis'
              render={() => (
                <ProductAnalytics
                  onBack={this.handleBack}
                />
            )} />
            <Route
              exact path='/catalogo'
              render={() => (
                <Catalog
                  onApprove={this.handleApprove}
                  onBack={this.handleBack} />
            )} />
            <Route component={Error} />
          </Switch>
        </div>
      </div>
    )
  }
  
  handleBack = () => {
    const { 
      pathname,
      category,
      products,
      currentProduct,
      changePage,
      updateProductLocations
    } = this.props;
    if (category && category.approved) {
      this.props.changePage('/');
      return;
    }
    updateProductLocations(
      'back',
      products,
      currentProduct
    );
    switch (pathname) {
      case '/envios':
        changePage('/pagos');
        break;
      case '/pagos':
        changePage('/perfil');
        break;
      case '/producto':
        if (
          !Array.isArray(products) || // does not exist || is not an array,
          !products.length || // empty array
          (currentProduct === products[products.length - 1]) // last in list
        ) {
          changePage('/envios');
          break;
        }
        changePage('/producto');
        break;
      case '/catalogo':
        changePage('/producto');
        break;
      default:
        changePage('/producto');
    }
  }
  
  handleForward = () => {
    const { 
      pathname,
      products,
      currentProduct,
      changePage,
      updateProductLocations
    } = this.props;
    updateProductLocations(
      'back',
      products,
      currentProduct
    );
    switch (pathname) {
      case '/perfil':
        changePage('/pagos');
        break;
      case '/pagos':
        changePage('/envios');
        break;
      case '/envios':
        changePage('/producto');
        break;
      case '/producto':
        if (currentProduct === products[0]) {
          changePage('/catalogo'); // first product in list
          break;
        }
        changePage('/producto');
        break;
      default:
        changePage('/producto');
    }
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  auth: state.auth.auth,
  category: state.categories.category,
  products: state.products.products,
  currentProduct: state.products.currentProduct,
  nextProduct: state.products.nextProduct,
  pathname: state.nav.pathname
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (route) => push(route),
  facebookLogin,
  updatePathname,
  updateProductLocations,
  resetProductLocations,
  fetchCategories,
  updateCategory,
  deleteCategory,
  fetchProducts
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(App);