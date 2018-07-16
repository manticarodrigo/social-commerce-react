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

  render() {
    const { classes, title, category, onBack, onForward } = this.props
    console.log(category)
    console.log(title)
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    return (
      <div className={classes.root}>
        <AppBar position='fixed'>
          <Toolbar>
            {onBack && (
              <IconButton
                className={classes.menuButton}
                color='inherit'
                aria-label='Back'
                disabled={!onBack}
                onClick={this.props.onBack}>
                  <ArrowBackIcon />
              </IconButton>
            )}
            {onForward && (
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
              aria-owns={open ? 'menu-appbar' : null}
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
              open={open}
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
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  title: state.title.title
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (route) => push(route)
}, dispatch)

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(withStyles(styles)(NavBar))