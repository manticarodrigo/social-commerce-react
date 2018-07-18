import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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

import {
  facebookLogin
} from './actions/authActions';
import {
  updatePathname
} from './actions/navActions';
import {
  fetchCategories
} from './actions/categoryActions';
import {
  fetchProducts
} from './actions/productActions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null
    };
  }

  componentDidMount() {
    // Check for current user
    const response = JSON.parse(localStorage.getItem('user'));
    if (response) {
      this.setState({ loading: true })
      this.processAuth(response);
    } else {
      const { history } = this.props;
      history.replace('/ingresar');
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    props.updatePathname(props.location.pathname);
    return null;
  }

  processAuth = (response) => {
    const {
      history,
      facebookLogin,
      fetchCategories,
      fetchProducts
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
                      history.replace(category.approved ? '/' : '/producto');
                    } else {
                      history.replace(pathname);
                    }
                  })
              } else {
                this.setState({ loading: false });
                history.replace('/perfil');
              }
            });
        } else {
          localStorage.clear();
          this.setState({ loading: false });
          history.replace('/ingresar');
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

  handlePaymentOptionsSubmit = () => {
    const {
      history,
      category
    } = this.props;
    if (category && category.approved) {
      history.replace('/');
    } else {
      history.replace('/envios');
    }
  }

  handleShippingOptionsSubmit = () => {
    const {
      history,
      category,
      products,
      currentProduct,
      updateProductLocations
    } = this.props;
    if (category && category.approved) {
      history.replace('/');
    } else {
      updateProductLocations('forward', products, currentProduct);
      history.replace('/producto');
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className='App'>
        {this.props.pathname !== '/ingresar' && (
          <NavBar />
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
            <Route exact path='/' component={Dashboard} />
            <Route exact path='/perfil' component={CategoryForm} />
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
            <Route exact path='/producto' component={ProductForm} />
            <Route exact path='/producto/analisis' component={ProductAnalytics} />
            <Route exact path='/catalogo' component={Catalog} />
            <Route component={Error} />
          </Switch>
        </div>
      </div>
    )
  }s
}

const mapStateToProps = state => ({
  pathname: state.nav.pathname,
  user: state.auth.user,
  auth: state.auth.auth,
  category: state.categories.category,
  products: state.products.products,
  currentProduct: state.products.currentProduct,
  nextProduct: state.products.nextProduct
});

const mapDispatchToProps = dispatch => bindActionCreators({
  facebookLogin,
  updatePathname,
  fetchCategories,
  fetchProducts,
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps, 
    mapDispatchToProps
  )(App)
);