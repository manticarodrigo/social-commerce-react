import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import NavBar from '../../components/NavBar/NavBar'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createProduct, updateProduct } from '../../services/WordPress'

const style = {
	saveButton: {
		width: 'calc(100% - 1em)',
		height:'50px',
		margin: '0.5em',
		position: 'fixed',
		bottom: '0',
		left: '0'
	}
}

class ProductForm extends Component {
	constructor(props) {
		super(props)

		const { user, category, product } = this.props
		if (!user) this.props.history.replace('/')

	  this.state = {
			id: product ? product.id : '',
			title: product ? product.name : '',
			description: product ? product.description.replace('<p>', '').replace('</p>', '') : '',
			cost: product ? product.price : '',
			inventoryCount: product ? product.stock_quantity : '',
			imageUrl: product ? product.images[0].src : '',
			imageId: product ? product.images[0].id : null,
			imageFile: null,
			uploadDialogOpen: false,
			category: category
		}
		
		this.handleBack = this.handleBack.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleUploadDialogOpen = this.handleUploadDialogOpen.bind(this)
		this.handleUploadDialogClose = this.handleUploadDialogClose.bind(this)
	}

	handleBack() {
		this.props.onBack()
		this.props.history.replace('/tienda')
	}

	handleUploadDialogOpen() {
    this.setState({
			uploadDialogOpen: true
		})
  }

	handleUploadDialogClose(value) {
		const { imageId } = this.state
		if (typeof(value) === 'object') {
			this.setState({
				uploadDialogOpen: false,
				imageUrl: value !== null ? value.imageUrl : '',
				imageId: null,
				imageFile: value.imageFile
			})
		} else {
			this.setState({
				uploadDialogOpen: false,
				imageUrl: value !== undefined ? value : '',
				imageId: value !== undefined ? null : imageId
			})
		}
	}
	
  handleSubmit(event) {
		event.preventDefault()
		const data = this.state
		const { title, description, cost, inventoryCount, imageUrl, imageFile } = this.state
		if (
			title !== '' &&
			description !== '' &&
			cost !== '' &&
			inventoryCount !== '' &&
			imageUrl !== ''
		) {
			const { product } = this.props
			if (imageFile) {
				uploadMedia(imageFile)
					.then(res => {
						console.log(res)
						if (product) {
							product.imageId = res.data.id
							updateProduct(data)
							.then(res => {
								console.log(res)
								this.props.onSubmit()
							})
							.catch(err => {
								console.log(err)
							})
						} else {
							data.imageId = res.data.id
							createProduct(data)
								.then(res => {
									console.log(res)
									this.props.onSubmit()
								})
								.catch(err => {
									console.log(err)
								})
						}
					})
					.catch(err => {
						console.log(err)
					})
			} else {
				if (product) {
					updateProduct(data)
					.then(res => {
						console.log(res)
						this.props.onSubmit()
					})
					.catch(err => {
						console.log(err)
					})
				} else {
					createProduct(data)
						.then(res => {
							console.log(res)
							this.props.onSubmit()
						})
						.catch(err => {
							console.log(err)
						})
				}
			}
		} else {
			alert('Favor llenar campos requeridos.')
		}
  }
  
	handleInputChange(event) {
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
			reader.onload = (e) => {
				this.setState({imageUrl: e.target.result})
			}
			reader.readAsDataURL(event.target.files[0])
		}
	}
  
	render() {
		const { user, product } = this.props
		const { uploadDialogOpen } = this.state
	  return (
			<div>
				<NavBar
					title={product ? 'Edita Producto' :'Crea Producto'}
					onBack={this.handleBack}/>
				<div className='Content' style={{paddingBottom: 'calc(50px + 3em'}}>
					{uploadDialogOpen && (
						<UploadDialog
							token={user.token}
							onClose={this.handleUploadDialogClose} />
					)}
					<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
						<div>
							<Button
								style={{width: '88px', height: '88px', margin: '0 16px 0 0'}}
								variant='outlined'
								component='label'
								color='primary'
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
									type='file'
								/>
						</div>
						<TextField
							required
							fullWidth
							margin='normal'
							label='Titulo'
							name='title'
							value={this.state.title}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Descripción'
							name='description'
							value={this.state.description}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Costo'
							name='cost'
							value={this.state.cost}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Cantidad de Inventario'
							name='inventoryCount'
							value={this.state.inventoryCount}
							onChange={this.handleInputChange} />
					</form>
					<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant='contained' color='primary'>
						{product ? 'Guarda' : 'Agrega'} Producto
					</Button>
				</div>
			</div>
	  )
	}
}

export default withRouter(ProductForm)