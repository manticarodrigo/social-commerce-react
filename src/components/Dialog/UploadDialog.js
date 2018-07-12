import React, { Component } from 'react'

import OptionsDialog from './OptionsDialog'
import AlbumDialog from './AlbumDialog'
import CropDialog from './CropDialog'

const options = {
  facebook: {
    title: 'Suba de Facebook'
  },
  device: {
    title: 'Suba de Dispositivo'
  }
}

class UploadDialog extends Component {
  constructor(props) {
    super(props)
    const { facebook, device } = options
    this.state = {
      currentDialog: (
        <OptionsDialog
          options={[facebook.title, device.title]}
          onClose={this.handleOptionsDialogClose} />
      )
    }
  }
  
  inputElement = null

  handleOptionsDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
    } else if (value === options.device.title) {
      this.inputElement.click()
      this.setState({ currentDialog: null })
		} else if (value === options.facebook.title) {
      this.setState({
        currentDialog: (
          <AlbumDialog
            token={this.props.token}
            onClose={this.handleAlbumDialogClose} />
        )
      })
    }
	}

  handleAlbumDialogClose = (value) => {
    if (value === undefined) {
      this.props.onClose(value)
		} else {
      const cropDialog = (
        <CropDialog
          src={value}
          onClose={(croppedValue) => {
            this.handleCropDialogClose(croppedValue ? croppedValue : value)
          }} />
      )
      this.setState({ currentDialog: cropDialog })
    }
  }
  
  handleImageChanged = (event) => {
		if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0]
			let reader = new FileReader()
			reader.onload = (e) => {
        this.props.onClose({
          imageFile: imageFile,
          imageUrl: e.target.result
        })
			}
			reader.readAsDataURL(event.target.files[0])
    } else {
      this.props.onClose(null)
    }
  }

  handleCropDialogClose = (value) => {
    this.setState({ currentDialog: null })
    console.log(typeof(value))
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