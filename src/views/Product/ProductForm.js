import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createProduct, updateProduct } from '../../services/WordPress'

const style = {
	addButtonWrapper: {
		position: 'fixed',
		bottom: '45px',
		left: '0',
		width: '100%'
	},
	shareButtonWrapper: {
		position: 'fixed',
		bottom: '0',
		left: '0',
		width: '100%'
	},
	saveButton: {
		width: 'calc(100% - 1em)',
		height:'30px',
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

		const { user, product } = this.props
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
			loading: false,
			saved: false
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleUploadDialogOpen = this.handleUploadDialogOpen.bind(this)
		this.handleUploadDialogClose = this.handleUploadDialogClose.bind(this)
	}

	static getDerivedStateFromProps(props, state) {
		const { product } = props
		const { id } = state
		if (product && product.id !== id) {
			return {
				id: product.id,
				title: product.name,
				description: product.description.replace('<p>', '').replace('</p>', ''),
				cost: product.price,
				inventoryCount: product.stock_quantity,
				imageUrl: product.images[0].src,
				imageId: product.images[0].id,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				saved: false
			}
		}
		return null
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
	
  handleSubmit(type) {
		this.setState({ loading: true })
		const data = this.state
		const { title, description, cost, inventoryCount, imageUrl, imageFile } = this.state
		if (
			title !== '' &&
			description !== '' &&
			cost !== '' &&
			inventoryCount !== '' &&
			imageUrl !== ''
		) {
			const { product, category } = this.props
			const callback = product ? updateProduct : createProduct
			data.category = category
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
								this.finishSubmit(type)
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
						this.finishSubmit(type)
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
	
	finishSubmit(type) {
		if (type === 'add') {
			this.props.onAdd()
			this.setState({
				id: '',
				title: '',
				description: '',
				cost: '',
				inventoryCount: '',
				imageUrl: '',
				imageId: null,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				saved: false
			})
		} else {
			this.props.onDone()
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
  
	render() {
		const { user, product } = this.props
		const { uploadDialogOpen, loading } = this.state
	  return (
			<div style={{paddingBottom: 'calc(75px + 2em'}}>
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
					</div>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Titulo (Nombre)'
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
						multiline={true}
						rows={2}
						rowsMax={5}
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
				<div style={style.addButtonWrapper}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						style={style.saveButton}
						disabled={loading}
						onClick={() => this.handleSubmit('add')}
					>
						{product ? 'Guardar' : 'Crear'} y Añadir Otro
					</Button>
					{loading && <CircularProgress size={24} style={style.buttonProgress} />}
				</div>
				<div style={style.shareButtonWrapper}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						style={style.saveButton}
						disabled={loading}
						onClick={() => this.handleSubmit('share')}
					>
						{product ? 'Guardar' : 'Crear'} y Compartir
					</Button>
					{loading && <CircularProgress size={24} style={style.buttonProgress} />}
				</div>
			</div>
	  )
	}
}

export default ProductForm