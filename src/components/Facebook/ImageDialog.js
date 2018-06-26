import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getImagesIn } from '../../utils/Facebook'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

var images = []

class ImageDialog extends Component {
  constructor(props) {
    super(props)
    this.fetchFacebookImages()
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedImageValue)
  }

  handleListItemClick = value => {
    this.props.onClose(value)
  }

  fetchFacebookImages() {
    const accessToken = this.props.token.accessToken
    getImagesIn(this.props.album.id, accessToken)
    .then(res => {
      console.log(res)
      images = res
    })
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="image-dialog-title" {...other}>
        <DialogTitle id="image-dialog-title">Choose image in {this.props.album.name}</DialogTitle>
        <div>
          <GridList cellHeight={160} cols={3}>
            {images.map(url => (
              <GridListTile key={url} cols={3}>
                <img src={url} alt={url} onClick={() => this.handleListItemClick(url)} key={url} />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </Dialog>
    )
  }
}

ImageDialog.propTypes = {
  onClose: PropTypes.func,
  selectedImageValue: PropTypes.string,
}

export default ImageDialog