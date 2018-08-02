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
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// Material UI Icons
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LaunchIcon from '@material-ui/icons/Launch';
import StoreIcon from '@material-ui/icons/Store';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DeleteIcon from '@material-ui/icons/Delete';
import PowerOffIcon from '@material-ui/icons/Power';
// Components
import DeleteDialog from '../Dialog/DeleteDialog';

// Actions
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
      deleteDialogOpen: false,
      drawerOpen: false
    };
  }

  handleClose = () => {
    this.setState({ drawerOpen: false });
  }

  handleEditSite = () => {
    this.handleClose();
    this.props.history.replace('/perfil');
  }

  handleEditPayments = () => {
    this.handleClose();
    this.props.history.replace('/pagos');
  }

  handleEditShipping = () => {
    this.handleClose();
    this.props.history.replace('/envios');
  }

  handleDeleteSite = () => {
    this.setState({ deleteDialogOpen: true });
  }

  finishSiteDelete = (site) => {
    const { history, deleteSite } = this.props;
    deleteSite(site.blog_id)
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

  toggleDrawer = () => {
    const { drawerOpen } = this.state;
    this.setState({
      drawerOpen: !drawerOpen,
    });
  };

  render() {
    const { classes, title, site } = this.props;
    const { anchorEl, deleteDialogOpen, drawerOpen } = this.state;
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
              onClick={this.toggleDrawer}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor='right'
          open={drawerOpen}
          onClose={this.toggleDrawer}>
          <div className={classes.list}>
            {(site && site.public) && (
              <List>
                <ListItem
                  button
                  component='a'
                  href={site && site.siteurl}
                  target='_blank'
                >
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Ver Tienda'} />
                </ListItem>
                <ListItem button onClick={this.handleEditSite}>
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Tienda'} />
                </ListItem>
                <ListItem button onClick={this.handleEditPayments}>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Pagos'} />
                </ListItem>
                <ListItem button onClick={this.handleEditShipping}>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Envios'} />
                </ListItem>
                <ListItem button onClick={this.handleDeleteSite}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Eliminár Tienda'} />
                </ListItem>
              </List>
            )}
            <Divider />
            <List>
              <ListItem onClick={this.handleLogout}>
                  <ListItemIcon>
                    <PowerOffIcon />
                  </ListItemIcon>
                <ListItemText primary={'Cerrar sesión'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
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