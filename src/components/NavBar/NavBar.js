import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import AccountCircle from '@material-ui/icons/AccountCircle'
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
      user: true,
      anchorEl: null,
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleShareCategory = this.handleShareCategory.bind(this)
    this.handleEditCategory = this.handleEditCategory.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleBack() {
    this.props.onBack()
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorEl: null })
  }

  handleEditCategory() {
    this.handleClose()
    this.props.history.replace('/tienda/edita')
  }

  handleShareCategory() {
    this.handleClose()
    this.props.history.replace('/comparte')
  }

  handleLogout() {
    this.handleClose()
    localStorage.clear()
    this.props.history.replace('/ingresa')
  }

  render() {
    const { classes, title, onBack, noCategory } = this.props
    const { user, anchorEl } = this.state
    const open = Boolean(anchorEl)
    return (
      <div className={classes.root}>
        <AppBar position='fixed'>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color='inherit'
              aria-label='Menu'>
              {onBack && (
                <ArrowBackIcon
                  onClick={this.handleBack} />
              )}
            </IconButton>
            <Typography variant='title' color='inherit' className={classes.flex}>
              {title}
            </Typography>
            {user && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup='true'
                  onClick={this.handleMenu}
                  color='inherit'
                >
                  <AccountCircle />
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
                  <MenuItem onClick={this.handleShareCategory}>Compartír Tienda</MenuItem>
                  {!noCategory && (
                    <MenuItem onClick={this.handleEditCategory}>Editar Tienda</MenuItem>
                  )}
                  <MenuItem onClick={this.handleLogout}>Cerrar sesión</MenuItem>
                </Menu>
              </div>
            )}
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