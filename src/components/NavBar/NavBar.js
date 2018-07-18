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
  deleteCategory
} from '../../actions/categoryActions';
import {
  updateProductLocations
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

  handleEditCategory = () => {
    this.handleClose()
    this.props.history.replace('/perfil')
  }

  handleShareCategory = () => {
    this.handleClose()
    this.props.history.replace('/catalogo')
  }

  handleDeleteCategory = () => {
    this.setState({ deleteDialogOpen: true });
  }

  finishCategoryDelete = (category) => {
    const { history, deleteCategory } = this.props;
    deleteCategory(category.id)
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
    const { pathname, category } = this.props;
    if (category && category.approved) {
      return  pathname !== '/' ? true : false;
    } else if (pathname !== '/perfil') {
      return true;
    }
    return false;
  }
  
  forwardCase = () => {
    const { pathname, category, nextProduct } = this.props;
    if (category && !category.approved) {
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
    const { classes, title, category } = this.props;
    const { anchorEl, deleteDialogOpen } = this.state;
    return (
      <div className={classes.root}>
        <DeleteDialog
					open={deleteDialogOpen}
					category={category}
					onClose={() => this.setState({ deleteDialogOpen: false })}
					onConfirm={() => this.finishCategoryDelete(category)} />
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
                style={{display: category && category.approved ? 'block' : 'none'}}
                onClick={this.handleShareCategory}>
                Ver Tienda
              </MenuItem>
              <MenuItem
                style={{display: category && category.approved ? 'block' : 'none'}}
                onClick={this.handleEditCategory}>
                Editar Tienda
              </MenuItem>
              <MenuItem
                style={{display: category && category.approved ? 'block' : 'none'}}
                onClick={this.handleDeleteCategory}>
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
      category,
      products,
      currentProduct,
      updateProductLocations
    } = this.props;
    if (category && category.approved) {
      history.replace('/');
      return;
    }
    updateProductLocations(
      'back',
      products,
      currentProduct
    );
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
      case '/catalogo':
        history.replace('/producto');
        break;
      default:
        history.replace('/producto');
    }
  }
  
  handleForward = () => {
    const {
      history,
      pathname,
      products,
      currentProduct,
      updateProductLocations
    } = this.props;
    updateProductLocations(
      'forward',
      products,
      currentProduct
    );
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
        if (currentProduct === products[0]) {
          history.replace('/catalogo'); // first product in list
          break;
        }
        history.replace('/producto');
        break;
      default:
        history.replace('/producto');
    }
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.object,
  products: PropTypes.array,
  pathname: PropTypes.string
}

const mapStateToProps = state => ({
  pathname: state.nav.pathname,
  title: state.nav.title,
  category: state.categories.category,
  products: state.products.products,
  currentProduct: state.products.currentProduct,
  nextProduct: state.products.nextProduct
});

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteCategory,
  updateProductLocations
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(NavBar))
);