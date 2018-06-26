import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getAlbums } from '../../utils/Facebook'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

import ImageDialog from './ImageDialog'

var albums = []


class AlbumDialog extends Component {
  constructor(props) {
    super(props)
    this.fetchFacebookAlbums()
  }

  state = {
    selectedAlbumValue: null,
    imageDialogOpen: false,
    selectedImageValue: null,
  }

  handleImageDialogOpen = () => {
    this.setState({ imageDialogOpen: true })
  }

  handleImageDialogClose = value => {
		this.setState({ selectedImageValue: value, imageDialogOpen: false })
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedAlbumValue)
  }

  handleListItemClick = value => {
    // this.props.onClose(value)
    this.setState({selectedAlbumValue: value, imageDialogOpen: true})
  }

  fetchFacebookAlbums() {
    const accessToken = this.props.token.accessToken
    getAlbums(accessToken)
    .then(res => {
      console.log(res)
      albums = res
    })
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props
    return (
      <div>
        <ImageDialog
            album={this.selectedAlbumValue}
            token={this.props.token}
            selectedValue={this.state.selectedPhotoValue}
            open={this.state.imageDialogOpen}
            onClose={this.handleImageDialogClose} />
        <Dialog onClose={this.handleClose} aria-labelledby="album-dialog-title" {...other}>
          <DialogTitle id="album-dialog-title">Choose Facebook album</DialogTitle>
          <div>
            <List>
              {albums.map(album => (
                <ListItem button onClick={() => this.handleListItemClick(album)} key={album.id}>
                  <ListItemText primary={album.name} />
                </ListItem>
              ))}
            </List>
          </div>
        </Dialog>
      </div>
    )
  }
}
  
AlbumDialog.propTypes = {
  onClose: PropTypes.func,
  selectedAlbumValue: PropTypes.string,
}

export default AlbumDialog