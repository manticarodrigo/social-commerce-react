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
      currentDialog: (
        <OptionsDialog
          options={[constants.FACEBOOK_UPLOAD, constants.DEVICE_UPLOAD]}
          onClose={this.handleOptionsDialogClose} />
      )
    }
  }
  
  inputElement = null

  handleOptionsDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
    } else if (value === constants.DEVICE_UPLOAD) {
      this.inputElement.click()
      this.setState({ currentDialog: null })
		} else if (value === constants.FACEBOOK_UPLOAD) {
      const { token } = this.props.user
      this.setState({
        currentDialog: (
          <PagesDialog
            token={token}
            onClose={this.handlePagesDialogClose} />
        )
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
        currentDialog: (
          <AlbumsDialog
            id={id}
            token={token}
            onClose={this.handleAlbumsDialogClose} />
        )
      })
    }
  }

  handleAlbumsDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
		} else {
      // const { aspect } = this.props
      this.setState({
        currentDialog: (
          <CropDialog
            src={value}
            onClose={(croppedValue) => {
              this.handleCropDialogClose(croppedValue ? croppedValue : value)
            }} />
        )
      })
    }
  }
  
  handleImageChanged = (event) => {
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader()
			reader.onload = (e) => {
        this.setState({
          currentDialog: (
            <CropDialog
              src={e.target.result}
              onClose={this.handleCropDialogClose} />
          )
        })
			}
			reader.readAsDataURL(event.target.files[0])
    } else {
      this.props.onClose(null)
    }
  }

  handleCropDialogClose = (value) => {
    this.setState({ currentDialog: null })
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
    const { currentDialog } = this.state
    return (
      <div>
        {currentDialog}
        <input
          ref={input => this.inputElement = input}
          onChange={this.handleImageChanged}
          style={{display: 'none'}}
          name="imageFile"
          type="file"
        />
      </div>
    )
  }
}

export default UploadDialog