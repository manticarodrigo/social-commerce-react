import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getImagesIn } from '../../services/Facebook'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

class ImageDialog extends Component {
  constructor(props) {
    super(props)
    this.fetchFacebookImages()
  }

  state = {
    images: []
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = value => {
    this.props.onClose(value)
  }

  fetchFacebookImages() {
    const accessToken = this.props.token.accessToken
    getImagesIn(this.props.album.id, accessToken)
    .then(res => {
      console.log(res)
      this.setState({ images: res })
    })
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="image-dialog-title" {...other}>
        <DialogTitle id="image-dialog-title">Choose Image in {this.props.album.name}</DialogTitle>
        <div>
          <GridList cellHeight={160} cols={4}>
            {this.state.images.map(url => (
              <GridListTile key={url} cols={4}>
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
  selectedValue: PropTypes.string,
}

export default ImageDialog