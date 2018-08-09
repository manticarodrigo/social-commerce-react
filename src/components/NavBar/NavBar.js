// React
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Material UI Core
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// Material UI Icons
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
// Components
import DrawerMenu from '../DrawerMenu/DrawerMenu';
// Actions
import {
  updateCurrentProduct,
  updateProducts
} from '../../actions/productActions';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    fontSize: '1.2em'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 0,
  },
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  backCase = () => {
    const { pathname, site } = this.props;
    if (site && site.public) {
      return  pathname !== '/' ? true : false;
    } else if (pathname !== '/perfil') {
      return true;
    }
    return false;
  }
  
  forwardCase = () => {
    const { pathname, site, products, currentProduct } = this.props;
    var index = currentProduct ? (
      products
        .map(e => { return e.name; })
        .indexOf(currentProduct.name)
    ) : 0;
    const nextProduct = products[index - 1] ? products[index - 1] : null;
    if (site && !site.public) {
      if (pathname === '/perfil') {
        return true;
      } else if (pathname === '/producto' && nextProduct) {
        return true;
      } else if (pathname === '/pagos') {
        return true;
      } else if (pathname === '/envios') {
        return true;
      }
      return false;
    }
    return false;
  }

  toggleDrawer = () => {
    const { drawerOpen } = this.state;
    this.setState({
      drawerOpen: !drawerOpen,
    });
  };

  render() {
    const { classes, title } = this.props;
    const { anchorEl, drawerOpen } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position='fixed'>
          <Toolbar>
            {this.backCase() && (
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='Back'
                onClick={this.handleBack}>
                  <ArrowBackIcon />
              </IconButton>
            )}
            {this.forwardCase() && (
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='Forward'
                onClick={this.handleForward}
              >
                  <ArrowForwardIcon />
              </IconButton>
            )}
            <Typography variant='title' color='inherit' className={classes.flex}>
              {title}
            </Typography>
            <IconButton
              aria-owns={Boolean(anchorEl) ? 'menu-appbar' : null}
              aria-haspopup='true'
              onClick={this.toggleDrawer}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DrawerMenu
          open={drawerOpen}
          onClose={this.toggleDrawer}
        />
      </div>
    )
  }

  handleBack = () => {
    const {
      history,
      pathname,
      site,
      products,
      currentProduct
    } = this.props;
    if (site && site.public) {
      history.replace('/');
      return;
    }
    this.updateProductLocations('back');
    switch (pathname) {
      case '/envios':
        history.replace('/pagos');
        break;
      case '/pagos':
        history.replace('/perfil');
        break;
      case '/producto':
        if (
          !Array.isArray(products) || // does not exist || is not an array,
          !products.length || // empty array
          (currentProduct === products[products.length - 1]) // last in list
        ) {
          history.replace('/envios');
          break;
        }
        history.replace('/producto');
        break;
      default:
        history.replace('/producto');
    }
  }
  
  handleForward = () => {
    const {
      history,
      pathname
    } = this.props;
    switch (pathname) {
      case '/perfil':
        history.replace('/pagos');
        break;
      case '/pagos':
        history.replace('/envios');
        break;
      case '/envios':
        history.replace('/producto');
        break;
      case '/producto':
        history.replace('/producto');
        break;
      default:
        history.replace('/producto');
    }
    this.updateProductLocations('forward');
  }

  updateProductLocations = (direction) => {
    const {
      products,
      currentProduct,
      updateCurrentProduct
    } = this.props;
    if (Boolean(products) && direction === 'back') {
      var index = currentProduct ? (
        products
          .map(e => { return e.name; })
          .indexOf(currentProduct.name) + 1
      ) : 0;
      updateCurrentProduct(products[index]);
      return;
    }
    if (Boolean(products)) {
      index = currentProduct ? (
        products
          .map(e => { return e.name })
          .indexOf(currentProduct.name) - 1
      ) : products.length - 1;
      updateCurrentProduct(products[index !== -1 ? index : 0]);
      return;
    }
    updateCurrentProduct(null);
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  site: PropTypes.object,
  products: PropTypes.array,
  pathname: PropTypes.string
}

const mapStateToProps = state => ({
  pathname: state.nav.pathname,
  title: state.nav.title,
  site: state.site.site,
  products: state.products.products,
  currentProduct: state.products.currentProduct
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCurrentProduct,
  updateProducts
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(NavBar))
);