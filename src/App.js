// React
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';
// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
import NavBar from './components/NavBar/NavBar';
import Error from './components/Error/Error';
import Loading from './components/Loading/Loading';
// Views (containers)
import Login from './views/Login/Login';
import Dashboard from './views/Dashboard/Dashboard';
import Orders from './views/Orders/Orders';
import SiteForm from './views/Site/SiteForm';
import PaymentOptions from './views/Payment/PaymentOptions';
import ShippingOptions from './views/Shipping/ShippingOptions';
import ProductForm from './views/Product/ProductForm';
import ProductAnalytics from './views/ProductAnalytics/ProductAnalytics';
// Actions
import {
  facebookLogin
} from './actions/authActions';
import {
  updatePathname
} from './actions/navActions';
import {
  fetchSite
} from './actions/siteActions';
import {
  fetchOrders
} from './actions/orderActions';
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
      fetchSite,
      fetchProducts,
      fetchOrders
    } = this.props;
    // Use fb sdk response for wp auth
    facebookLogin(response)
      .then(() => {
        const { auth } = this.props;
        if (auth) {
          // Check for existing site for user_id
          fetchSite(auth)
            .then(() => {
              const { site } = this.props;
              if (site) {
                // Check for existing products for site
                Promise.all([fetchProducts(site.path), fetchOrders(site.path)])
                  .then(() => {
                    this.setState({ loading: false });
                    const { pathname } = this.props;
                    if (pathname === '/ingresar' || pathname === '/') {
                      history.replace(site.public ? '/' : '/producto');
                    } else {
                      history.replace(pathname);
                    }
                  });
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
      .catch(err => {
        console.log(err);
        alert('Error de autenticación.')
      });
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
            <Route exact path='/pedidos' component={Orders} />
            <Route exact path='/perfil' component={SiteForm} />
            <Route exact path='/pagos' component={PaymentOptions} />
            <Route exact path='/envios' component={ShippingOptions} />
            <Route exact path='/producto' component={ProductForm} />
            <Route exact path='/producto/analisis' component={ProductAnalytics} />
            <Route component={Error} />
          </Switch>
        </div>
      </div>
    )
  }s
}

const mapStateToProps = state => ({
  pathname: state.nav.pathname,
  auth: state.auth.auth,
  site: state.site.site
});

const mapDispatchToProps = dispatch => bindActionCreators({
  facebookLogin,
  updatePathname,
  fetchSite,
  fetchOrders,
  fetchProducts
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps, 
    mapDispatchToProps
  )(App)
);