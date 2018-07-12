import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { getPages } from '../../services/Facebook'

class PagesDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pages: [],
      currentPages: [],
      searchInput: ''
    }
    this.fetchFacebookPages()
  }

  fetchFacebookPages = () => {
    const { accessToken } = this.props.token
    getPages(accessToken)
    .then(res => {
      console.log(res)
      this.setState({ Pages: res, currentPages: res })
    })
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleListItemClick = (value) => {
    this.props.onClose(value)
  }

  handleInputChange = (event) => {
	  const target = event.target
	  const value = target.type === 'checkbox' ? target.checked : target.value	
    const name = target.name
    const currentPages = this.state.Pages
      .filter(page => {
        return page.name.toLowerCase().includes(value)
      })
	  this.setState({
      [name]: value,
      currentPages: currentPages
    })
	}

  render() {
    const { currentPages, searchInput } = this.state
    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
        aria-labelledby='page-dialog-title'>
      <DialogTitle id="page-dialog-title">
        <TextField
          fullWidth
          margin='none'
          label='Busqueda de Paginas'
          name='searchInput'
          value={searchInput}
          type='search'
          onChange={this.handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }} />
        </DialogTitle>
        <div>
          <List>
            <ListItem button onClick={() => this.handleListItemClick('user')} key='user-page'>
              <ListItemText primary='Tu Perfíl' />
            </ListItem>
            {currentPages.map(page => (
              <ListItem button onClick={() => this.handleListItemClick(page)} key={page.id}>
                <ListItemText primary={page.name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}
  
PagesDialog.propTypes = {
  onClose: PropTypes.func
}

export default PagesDialog