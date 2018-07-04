import React, { Component } from 'react'
// import { uploadMedia } from '../../services/WordPress'

import OptionsDialog from './OptionsDialog'
import AlbumDialog from './AlbumDialog'

class UploadDialog extends Component {
  constructor(props) {
    super(props)
    const options = ['Upload from Facebook', 'Upload from Device']
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
    } else if (value === 'Upload from Device') {
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

  handleImageDialogClose(value) {
		this.props.onClose(value)
  }
  
  handleImageChanged(event) {
		// if (event.target.files && event.target.files[0]) {
		// 	let reader = new FileReader();
		// 	reader.onload = (e) => {
    //     console.log(e.target.result)
		// 	}
		// 	reader.readAsDataURL(event.target.files[0]);
    // }
    
    // uploadMedia(product.imageFile)
		// .then(res => {
		// 	console.log(res)
		// 	product.imageUrl = res.data.source_url
		// 	createProduct(product)
		// 	.then(res => {
		// 		console.log(res)
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 	})
		// })
		// .catch(err => {
		// 	console.log(err)
		// })
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