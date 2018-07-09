import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import NavBar from '../../components/NavBar/NavBar'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createProduct, updateProduct } from '../../services/WordPress'

const style = {
	saveButtonWrapper: {
		position: 'fixed',
		bottom: '0',
		left: '0',
		width: '100%'
	},
	saveButton: {
		width: 'calc(100% - 1em)',
		height:'50px',
		margin: '0.5em'
	},
	buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}

class ProductForm extends Component {
	constructor(props) {
		super(props)

		const { user, category, product } = this.props
		if (!user) this.props.onBack()

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
			category: category,
			loading: false
		}
		
		this.handleBack = this.handleBack.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleUploadDialogOpen = this.handleUploadDialogOpen.bind(this)
		this.handleUploadDialogClose = this.handleUploadDialogClose.bind(this)
	}

	handleBack() {
		this.props.onBack()
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
		this.setState({ loading: true })
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
			const callback = product ? updateProduct : createProduct
			if (imageFile) {
				uploadMedia(imageFile)
					.then(res => {
						console.log(res)
						data.imageId = res.data.id
						callback(data)
							.then(res => {
								console.log(res)
								this.setState({ loading: false })
								this.props.onSubmit()
							})
							.catch(err => {
								console.log(err)
							})
					})
					.catch(err => {
						console.log(err)
					})
			} else {
				callback(data)
					.then(res => {
						console.log(res)
						this.setState({ loading: false })
						this.props.onSubmit()
					})
					.catch(err => {
						console.log(err)
					})
			}
		} else {
			this.setState({ loading: false })
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
		const { uploadDialogOpen, loading } = this.state
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
							type='text'
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Descripción'
							name='description'
							value={this.state.description}
							type='textarea'
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Costo'
							name='cost'
							value={this.state.cost}
							type='number'
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Cantidad de Inventario'
							name='inventoryCount'
							value={this.state.inventoryCount}
							type='number'
							onChange={this.handleInputChange} />
					</form>
					<div style={style.saveButtonWrapper}>
						<Button
							size='large'
							variant='contained'
							color='primary'
							style={style.saveButton}
							disabled={loading}
							onClick={this.handleSubmit}
						>
							{product ? 'Guarda' : 'Crea'} Producto
						</Button>
						{loading && <CircularProgress size={24} style={style.buttonProgress} />}
					</div>
				</div>
			</div>
	  )
	}
}

export default ProductForm