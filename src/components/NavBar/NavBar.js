import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import MoreVert from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import DeleteDialog from '../Dialog/DeleteDialog';

import {
  deleteSite
} from '../../actions/siteActions';

import {
  updateCurrentProduct
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
      anchorEl: null,
      deleteDialogOpen: false
    };
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleEditSite = () => {
    this.handleClose()
    this.props.history.replace('/perfil')
  }

  handleEditPayments = () => {
    this.handleClose()
    this.props.history.replace('/pagos')
  }

  handleEditShipping = () => {
    this.handleClose()
    this.props.history.replace('/envios')
  }

  handleDeleteSite = () => {
    this.setState({ deleteDialogOpen: true });
  }

  finishSiteDelete = (site) => {
    const { history, deleteSite } = this.props;
    deleteSite(site.id)
      .then(() => {
        this.setState({
          deleteDialogOpen: false
        })
        history.replace('/perfil');
      });
  }

  handleLogout = () => {
    this.handleClose();
    localStorage.clear();
    this.props.history.replace('/ingresar');
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

  render() {
    const { classes, title, site } = this.props;
    const { anchorEl, deleteDialogOpen } = this.state;
    return (
      <div className={classes.root}>
        <DeleteDialog
					open={deleteDialogOpen}
					site={site}
					onClose={() => this.setState({ deleteDialogOpen: false })}
					onConfirm={() => this.finishSiteDelete(site)} />
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
                onClick={this.handleForward}>
                  <ArrowForwardIcon />
              </IconButton>
            )}
            <Typography variant='title' color='inherit' className={classes.flex}>
              {title}
            </Typography>
            <IconButton
              aria-owns={Boolean(anchorEl) ? 'menu-appbar' : null}
              aria-haspopup='true'
              onClick={this.handleMenu}
              color='inherit'
            >
              <MoreVert />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem
                style={{display: site && site.public ? 'block' : 'none'}}
                onClick={this.handleShareSite}>
                <a
                  style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)'}}
                  target='_blank'
                  href={site && site.siteurl}>
                Ver Tienda
                </a>
              </MenuItem>
              <MenuItem
                style={{display: site && site.public ? 'block' : 'none'}}
                onClick={this.handleEditSite}>
                Editar Tienda
              </MenuItem>
              <MenuItem
                style={{display: site && site.public ? 'block' : 'none'}}
                onClick={this.handleEditPayments}>
                Editar Pagos
              </MenuItem>
              <MenuItem
                style={{display: site && site.public ? 'block' : 'none'}}
                onClick={this.handleEditShipping}>
                Editar Envios
              </MenuItem>
              <MenuItem
                style={{display: site && site.public ? 'block' : 'none'}}
                onClick={this.handleDeleteSite}>
                Eliminár Tienda
              </MenuItem>
              <MenuItem
                onClick={this.handleLogout}>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
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
  deleteSite,
  updateCurrentProduct
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(NavBar))
);