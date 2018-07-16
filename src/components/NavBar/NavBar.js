import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import MoreVert from '@material-ui/icons/MoreVert'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

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
}

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pathname: props.location.pathname,
      anchorEl: null,
    }

    this.handleMenu = this.handleMenu.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShareCategory = this.handleShareCategory.bind(this)
    this.handleEditCategory = this.handleEditCategory.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    return { pathname: props.location.pathname }
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorEl: null })
  }

  handleEditCategory() {
    this.handleClose()
    this.props.history.replace('/perfil')
  }

  handleShareCategory() {
    this.handleClose()
    this.props.history.replace('/catalogo')
  }

  handleLogout() {
    this.handleClose()
    localStorage.clear()
    this.props.history.replace('/ingresar')
  }

  getLocationTitle() {
    const { pathname } = this.state
    const { category, product } = this.props
    switch (pathname) {
      case '/':
        return category ? category.name : 'Tu Tienda'
      case '/perfil':
        return category ? 'Edita tu Tienda' : 'Registra tu Tienda'
      case '/pagos':
        return 'Opciones de Pago'
      case '/envios':
        return 'Opciones de Envio'
      case '/producto':
        return product ? 'Edita tu Producto' : 'Crea tu Producto'
      case '/catalogo':
        return 'Tu Tienda'
      default:
        return 'Tu Tienda'
    }
  }

  render() {
    const { classes, title, category, onBack, onForward } = this.props
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
              {title && (title !== null && title !== '') ? title : this.getLocationTitle()}
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
}

export default withStyles(styles)(withRouter(NavBar))