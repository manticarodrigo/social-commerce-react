import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getAlbums } from '../../utils/Facebook'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class AlbumDialog extends Component {
  constructor(props) {
    super(props)
    this.fetchFacebookAlbums()
  }

  state = {
    albums: []
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = value => {
    this.props.onClose(value)
  }

  fetchFacebookAlbums() {
    const accessToken = this.props.token.accessToken
    getAlbums(accessToken)
    .then(res => {
      console.log(res)
      this.setState({ albums: res })
    })
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="album-dialog-title" {...other}>
        <DialogTitle id="album-dialog-title">Choose Facebook Album</DialogTitle>
        <div>
          <List>
            {this.state.albums.map(album => (
              <ListItem button onClick={() => this.handleListItemClick(album)} key={album.id}>
                <ListItemText primary={album.name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}
  
AlbumDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.object,
}

export default AlbumDialog