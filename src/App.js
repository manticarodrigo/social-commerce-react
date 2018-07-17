import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
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

import { updatePathname } from './actions/navActions';
import { fetchCategories } from './actions/categoryActions';
import { fetchProducts, updateProductLocations } from './actions/productActions';

import {
  facebookLogin,
  deleteProduct,
  updateCategory,
  deleteCategory
} from './services/WordPress';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      auth: null,
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
    props.updatePathname(props.location.pathname);
    return null;
  }

  processAuth = (response) => {
    const { fetchCategories, fetchProducts, changePage } = this.props;
    // Use fb sdk response for wp auth
    facebookLogin(response.token.accessToken)
      .then(res => {
        console.log(res);
        if (res.data.cookie) {
          const auth = res.data;
          // Check for existing categories for owner_id
          fetchCategories(auth)
            .then(() => {
              const { categories } = this.props;
              if (categories.length > 0) {
                const category = categories[0];
                // Check for existing products for category
                fetchProducts(category.id)
                  .then(() => {
                    const { products } = this.props;
                    console.log(this.props);
                    this.setState({
                      loading: false,
                      user: response,
                      auth: auth
                    });
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
      .catch(err => {
        console.log(err);
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
    const { auth, category } = this.props;
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

  handleCategorySubmit = (category) => {
    this.setState({
      category: category
    });
    if (category.approved) {
      this.props.changePage('/');
    } else {
      this.props.changePage('/pagos');
    }
  }

  handleCategoryDelete = () => {
		this.setState({
      deleteCategoryOpen: true
    })
  }

  handlePaymentOptionsSubmit = (updatedCategory) => {
    const { category } = this.props;
    this.setState({
      category: updatedCategory ? updatedCategory : category
    });
    if (category && category.approved) {
      this.props.changePage('/');
    } else {
      this.props.changePage('/envios');
    }
  }

  handleShippingOptionsSubmit = (updatedCategory) => {
    const { category, products, currentProduct, updateProductLocations } = this.props;
    this.setState({
      category: updatedCategory ? updatedCategory : category
    });
    if (category && category.approved) {
      this.props.changePage('/');
    } else {
      updateProductLocations('forward', products, currentProduct);
      this.props.changePage('/producto');
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
          deleteCategoryOpen: false
        })
        this.props.changePage('/perfil')
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleProductSubmit = () => {
    const { category } = this.props
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
    this.setState({ currentProduct: product })
    this.props.changePage('/producto')
  }

  handleProductAnalytics = (product) => {
    this.setState({ currentProduct: product })
    this.props.changePage('/producto/analisis')
  }

  handleProductAdd = () => {
    this.setState({ currentProduct: null, nextProduct: null })
    this.props.changePage('/producto')
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
      category,
      products,
      currentProduct,
      nextProduct
    } = this.props;
    const {
      loading,
      user,
      auth,
      deleteCategoryOpen
    } = this.state;
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
                  category={category}
                  auth={auth}
                  onSubmit={this.handlePaymentOptionsSubmit} />
            )} />
            <Route
              exact path='/envios'
              render={() => (
                <ShippingOptions
                  category={category}
                  auth={auth}
                  onSubmit={this.handleShippingOptionsSubmit} />
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
                  onDone={this.handleShare} />
            )} />
            <Route
              exact path='/producto/analisis'
              render={() => (
                <ProductAnalytics
                  user={user}
                  product={currentProduct}
                  onBack={this.handleBack}
                />
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
  
  handleBack = () => {
    console.log('back')
    const { 
      pathname,
      category,
      products,
      currentProduct,
      changePage,
      updateProductLocations
    } = this.props;
    console.log(this.props)
    if (category && !category.approved) {
      updateProductLocations('back', products, currentProduct);
      switch (pathname) {
        case '/envios':
          changePage('/pagos');
          break;
        case '/pagos':
          changePage('/perfil');
          break;
        case '/producto':
          if (
            !Array.isArray(products) ||
            !products.length ||
            (currentProduct === products[products.length - 1])
          ) {
            // Array does not exist, is not an array, or is empty
            changePage('/envios');
            break;
          }
          changePage('/producto');
          break;
        case '/catalogo':
          changePage('/producto');
          break;
      }
    } else {
      this.props.changePage('/');
    }
  }
  
  handleForward = () => {
    console.log('forward')
    const { 
      pathname,
      products,
      currentProduct,
      changePage,
      updateProductLocations
    } = this.props;
    console.log(this.props)
    updateProductLocations('forward', products, currentProduct);
    switch (pathname) {
      case '/perfil':
        changePage('/pagos')
        break;
      case '/pagos':
        changePage('/envios')
        break;
      case '/envios':
        changePage('/producto');
        break;
      case '/producto':
        if (currentProduct === products[0]) {
          changePage('/catalogo') // first product in list
          break;
        }
        changePage('/producto')
        break;
    }
  }
}

const mapStateToProps = state => ({
  categories: state.categories.categories,
  category: state.categories.category,
  products: state.products.products,
  currentProduct: state.products.currentProduct,
  nextProduct: state.products.nextProduct,
  pathname: state.nav.pathname
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (route) => push(route),
  updatePathname,
  updateProductLocations,
  fetchCategories,
  fetchProducts
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)((withRouter(App)));