import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
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
    this.props.changePage('/perfil')
  }

  handleShareCategory = () => {
    this.handleClose()
    this.props.changePage('/catalogo')
  }

  handleLogout = () => {
    this.handleClose()
    localStorage.clear()
    this.props.changePage('/ingresar')
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
    const { pathname, category, products, nextProduct } = this.props;
    if (category && !category.approved) {
      if (pathname === '/perfil' && products) {
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
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position='fixed'>
          <Toolbar>
            {this.backCase() && (
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='Back'
                onClick={this.props.onBack}>
                  <ArrowBackIcon />
              </IconButton>
            )}
            {this.forwardCase() && (
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='Forward'
                onClick={this.props.onForward}>
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
                onClick={this.props.onDelete}>
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
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.object,
  products: PropTypes.array,
  pathname: PropTypes.string
}

const mapStateToProps = state => ({
  title: state.nav.title,
  category: state.categories.category,
  products: state.products.products,
  pathname: state.nav.pathname
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (route) => push(route)
}, dispatch);

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(withStyles(styles)(NavBar));