import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import UploadDialog from '../../components/Dialog/UploadDialog'
import AlbumDialog from '../../components/Dialog/AlbumDialog'
import ImageDialog from '../../components/Dialog/ImageDialog'

import { uploadMedia, createProduct } from '../../services/WordPress'

const style = {
	saveButton: {
		width: 'calc(100% - 2em)',
		height:'50px',
		margin: '1em',
		position: 'absolute',
		bottom: '0',
		left: '0'
	}
}

export class ProductForm extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
			title: '',
			description: '',
			cost: '',
			inventoryCount: '',
			imageUrl: '',
			imageFile: null,
			uploadDialogOpen: false,
			albumDialogOpen: false,
			selectedAlbumValue: null,
			imageDialogOpen: false,
			selectedImageValue: null,
			wpTermId: this.props.wpTermId
	  }
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleUploadDialogOpen = () => {
    this.setState({
			uploadDialogOpen: true
		})
  }

  handleUploadDialogClose = value => {
		this.setState({
			uploadDialogOpen: false,
			albumDialogOpen: value === 'Upload from Facebook' ? true : false
		})
		if (value === 'Upload from Device') {
			this.inputElement.click()
		}
	}

  handleAlbumDialogOpen = () => {
    this.setState({
			albumDialogOpen: true
		})
  }

  handleAlbumDialogClose = value => {
		this.setState({
			selectedAlbumValue: value,
			albumDialogOpen: false,
			imageDialogOpen: value != null ? true : false
		})
	}

	handleImageDialogOpen = () => {
    this.setState({
			imageDialogOpen: true
		})
  }

  handleImageDialogClose = value => {
		this.setState({
			imageUrl: value,
			selectedImageValue: value,
			imageDialogOpen: false
		})
	}
	
  handleSubmit(event) {
		event.preventDefault()
		const product = this.state
		
		// Media is uploaded by woocommerce, when pass an url
		createProduct(product)
		  .then(res => {
		    console.log(res)
		  })
		  .catch(err => {
		    console.log(err)
		  })

		// We should find a way to send an file or a url
		
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
  
	handleChange(event) {
	  const target = event.target;
	  const value = target.type === 'checkbox' ? target.checked : target.value	
	  const name = target.name;
	  this.setState({
			[name]: value
		})
	}

	handleImageChanged(event) {
		if (event.target.files && event.target.files[0]) {
			this.setState({imageFile: event.target.files[0]})
			let reader = new FileReader();
			// reader.onload = (e) => {
			// 	this.setState({imageUrl: e.target.result})
			// }
			reader.readAsDataURL(event.target.files[0])
		}
	}
  
	render() {
	  return (
			<div>
				<UploadDialog
					options={['Upload from Facebook', 'Upload from Device']}
          			selectedValue={this.state.selectedUploadValue}
			        open={this.state.uploadDialogOpen}
			        onClose={this.handleUploadDialogClose} />
				<AlbumDialog
					token={this.props.token}
			        selectedValue={this.state.selectedAlbumValue}
			        open={this.state.albumDialogOpen}
			        onClose={this.handleAlbumDialogClose} />
				{this.state.imageDialogOpen && (
					<ImageDialog
						album={this.state.selectedAlbumValue}
						token={this.props.token}
						selectedValue={this.state.selectedImageValue}
						open={this.state.imageDialogOpen}
						onClose={this.handleImageDialogClose} />
				)}
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<div>
						<Button
							style={{width: '88px', height: '88px', margin: '0 16px 0 0'}}
							variant="outlined"
							component="label"
							color="primary"
							onClick={this.handleUploadDialogOpen}
						>
							{this.state.imageUrl === '' ? 'Foto' : null}
							<FileUpload style={{display: this.state.imageUrl === '' ? 'block' : 'none'}} />
							<img style={{display: this.state.imageUrl !== '' ? 'block' : 'none', width: '88px', height: '88px', objectFit: 'cover'}} src={this.state.imageUrl} alt={this.state.imageUrl} />
						</Button>
						<input
								ref={input => this.inputElement = input}
								onChange={this.handleImageChanged.bind(this)}
								style={{display: 'none'}}
								type="file"
							/>
					</div>
					<TextField
						fullWidth
						margin="normal"
						label="Titulo"
						name="title"
						checked={this.state.title}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Descripción"
						name="description"
						checked={this.state.description}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Costo"
						name="cost"
						checked={this.state.cost}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Cantidad de Inventario"
						name="inventoryCount"
						checked={this.state.inventoryCount}
						onChange={this.handleChange} />
				</form>
				<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant="contained" color="primary">
					Agrega Producto
				</Button>
			</div>
	  )
	}
}