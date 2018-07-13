import React, { Component } from 'react'

import OptionsDialog from './OptionsDialog'
import PagesDialog from './PagesDialog'
import AlbumsDialog from './AlbumsDialog'
import CropDialog from './CropDialog'

const constants = {
  FACEBOOK_UPLOAD: 'Suba de Facebook',
  DEVICE_UPLOAD: 'Suba de Dispositivo'
}

class UploadDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      optionsDialogOpen: true,
      pagesDialogOpen: false,
      albumsDialogData: null,
      cropDialogData: null
    }
  }
  
  inputElement = null

  handleOptionsDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
    } else if (value === constants.DEVICE_UPLOAD) {
      this.inputElement.click()
      this.setState({ optionsDialogOpen: false })
		} else if (value === constants.FACEBOOK_UPLOAD) {
      this.setState({
        optionsDialogOpen: false,
        pagesDialogOpen: true
      })
    }
  }
  
  handlePagesDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
		} else {
      const { user } = this.props
      const page = typeof(value) === 'object'
      const id = page ? value.id : user.profile.id
      const token = page ? value.access_token : user.token.accessToken    
      this.setState({
        pagesDialogOpen: false,
        albumsDialogData: {
          id: id,
          token: token
        }
      })
    }
  }

  handleAlbumsDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
		} else {
      this.setState({
        albumsDialogData: null,
        cropDialogData: value
      })
    }
  }
  
  handleImageChanged = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader()
			reader.onload = (e) => {
        this.setState({
          cropDialogData: e.target.result
        })
			}
			reader.readAsDataURL(event.target.files[0])
    } else {
      this.props.onClose(null)
    }
  }

  handleCropDialogClose = (value) => {
    this.setState({ cropDialogData: null })
    if (typeof(value) === 'object') {
      let reader = new FileReader()
			reader.onload = (e) => {
        this.props.onClose({
          imageFile: value,
          imageUrl: e.target.result
        })
			}
			reader.readAsDataURL(value)
    } else {
      this.props.onClose(value)
    }
  }

  render() {
    const { user, aspect } = this.props
    console.log(aspect)
    const { optionsDialogOpen, pagesDialogOpen, albumsDialogData, cropDialogData } = this.state
    return (
      <div>
        <OptionsDialog
          open={optionsDialogOpen}
          options={[constants.FACEBOOK_UPLOAD, constants.DEVICE_UPLOAD]}
          onClose={this.handleOptionsDialogClose} />
        <PagesDialog
          open={pagesDialogOpen}
          token={user.token}
          onClose={this.handlePagesDialogClose} />
        {albumsDialogData && (
          <AlbumsDialog
            open={Boolean(albumsDialogData)}
            id={albumsDialogData ? albumsDialogData.id : null}
            token={albumsDialogData ? albumsDialogData.token : null}
            onClose={this.handleAlbumsDialogClose} />
        )}
        <CropDialog
          open={Boolean(cropDialogData)}
          src={cropDialogData}
          aspect={aspect}
          onClose={this.handleCropDialogClose} />
        <input
          ref={input => this.inputElement = input}
          onChange={this.handleImageChanged}
          style={{display: 'none'}}
          name='imageFile'
          type='file'
        />
      </div>
    )
  }
}

export default UploadDialog