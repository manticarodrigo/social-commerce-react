import React, { Component } from 'react'

import OptionsDialog from './OptionsDialog'
import AlbumDialog from './AlbumDialog'

class UploadDialog extends Component {
  constructor(props) {
    super(props)
    const options = ['Suba de Facebook', 'Suba de Dispositivo']
    const optionsDialog = (
      <OptionsDialog
        options={options}
        open={true}
        onClose={this.handleOptionsDialogClose.bind(this)} />
    )
    this.state = {
      currentDialog: optionsDialog
    }
    this.handleImageChanged = this.handleImageChanged.bind(this)
  }
  
  inputElement = null

  handleOptionsDialogClose(value) {
    if (value === undefined) {
      this.props.onClose(value)
    } else if (value === 'Suba de Dispositivo') {
      this.inputElement.click()
      this.setState({ currentDialog: null })
		} else {
      const albumDialog = (
        <AlbumDialog
          token={this.props.token}
          open={true}
          onClose={this.handleAlbumDialogClose.bind(this)} />
      )
      this.setState({ currentDialog: albumDialog })
    }
	}

  handleAlbumDialogClose(value) {
    this.props.onClose(value)
  }
  
  handleImageChanged(event) {
		if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0]
			let reader = new FileReader();
			reader.onload = (e) => {
        this.props.onClose({
          imageFile: imageFile,
          imageUrl: e.target.result
        })
			}
			reader.readAsDataURL(event.target.files[0]);
    } else {
      this.props.onClose(null)
    }
	}

  render() {
    const { currentDialog } = this.state
    return (
      <div>
        {currentDialog && (
          currentDialog
        )}
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