import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'
import './ProductForm.css'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createProduct, updateProduct } from '../../services/WordPress'

class ProductForm extends Component {
	constructor(props) {
		super(props)

		const { user, product } = this.props
		if (!user) this.props.onBack()

		this.state = {
			id: product ? product.id : '',
			name: product ? product.name : '',
			description: product ? product.description.replace(/<[^>]+>/g, '') : '',
			cost: product ? product.price : '',
			inventoryCount: product && product.stock_quantity ? product.stock_quantity : '',
			imageUrl: product ? product.images[0].src : '',
			imageId: product ? product.images[0].id : null,
			imageFile: null,
			uploadDialogOpen: false,
			loading: false,
			adding: false,
			keyboardOpen: false
		}
	}

	static getDerivedStateFromProps = (props, state) => {
		const { product } = props
		const { id } = state
		if (product && product.id !== id) {
			return {
				id: product.id,
				name: product.name,
				description: product.description.replace(/<[^>]+>/g, ''),
				cost: product.price,
				inventoryCount: product.stock_quantity ? product.stock_quantity : '',
				imageUrl: product.images[0].src,
				imageId: product.images[0].id,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				adding: false
			}
		}
		return null
  }

	handleUploadDialogOpen = () => {
    this.setState({
			uploadDialogOpen: true
		})
  }

	handleUploadDialogClose = (value) => {
		if (typeof(value) === 'object' && value !== null) {
			this.setState({
				uploadDialogOpen: false,
				imageUrl: value.imageUrl,
				imageId: null,
				imageFile: value.imageFile
			});
		} else {
			this.setState({
				uploadDialogOpen: false
			});
		}
	}
	
  handleSubmit = (type) => {
		this.setState({ loading: true, adding: type === 'add' ? true : false })
		const data = this.state
		const { name, description, cost, inventoryCount, imageUrl, imageFile } = this.state
		if (
			name !== '' &&
			description !== '' &&
			cost !== '' &&
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
						console.log(data.imageId)
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
	
	finishSubmit = (type) => {
		const { category } = this.props
		if (type === 'add') {
			this.props.onAdd()
			this.setState({
				id: '',
				name: '',
				description: '',
				cost: '',
				inventoryCount: '',
				imageUrl: '',
				imageId: null,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				adding: false
			})
		} else {
			if (category && category.approved) {
				this.props.onBack()
			} else {
				this.props.onDone()
			}
		}
	}
  
	handleInputChange = (event) => {
	  const target = event.target
	  var value = target.type === 'checkbox' ? target.checked : target.value	
		const name = target.name
		if (name === 'cost' && !value.match(/^\d*\.?\d*$/)) {
			return
		} else if	(name === 'inventoryCount' && !value.match(/^(\s*|\d+)$/)) {
			 return
		} else if (name === 'description' && value.length >= 300) {
			return 
		}
	  this.setState({ [name]: value })
	}

	handleInputFocus = (event) => {
		this.setState({ keyboardOpen: true})
	}

	handleInputBlur = (event) => {
		this.setState({ keyboardOpen: false})
	}
  
	render() {
		const { user, product, category } = this.props
		const { uploadDialogOpen, loading, adding, keyboardOpen } = this.state
	  return (
			<div className='ProductForm' style={{paddingBottom: 'calc(75px + 2em'}}>
				{uploadDialogOpen && (
					<UploadDialog
						user={user}
						aspect={'1/1'}
						onClose={this.handleUploadDialogClose} />
				)}
				<form
					style={{textAlign:'left'}}
					onChange={this.handleInputChange}
					onFocus={this.handleInputFocus}
					onBlur={this.handleInputBlur}
					onSubmit={this.handleSubmit}>
					<div className='UploadWrapper'>
						<Button
							className='UploadButton'
							variant='outlined'
							component='label'
							color='primary'
							onClick={this.handleUploadDialogOpen}
						>
							{this.state.imageUrl === '' ? 'Foto' : null}
							<FileUpload style={{display: this.state.imageUrl === '' ? 'block' : 'none'}} />
							<img
								style={{display: this.state.imageUrl !== '' ? 'block' : 'none'}}
								src={this.state.imageUrl}
								alt={this.state.imageUrl} />
							<span
								style={{display: this.state.imageUrl === '' ? 'block' : 'none'}}
								className='Dimensions'>
								300 x 300
							</span>
						</Button>
						<TextField
							required
							style={{width: 'calc(100% - 104px'}}
							margin='normal'
							label='Nombre del producto'
							name='name'
							value={this.state.name}
							type='text' />
					</div>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Descripción'
						name='description'
						multiline
						rows={3}
						value={this.state.description} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Costo'
						name='cost'
						value={this.state.cost} />
					<TextField
						fullWidth
						margin='normal'
						label='Cantidad de inventario'
						name='inventoryCount'
						value={this.state.inventoryCount} />
				</form>
				<div
					className='AddButtonWrapper'
					style={{
						opacity: keyboardOpen ? '0.25' : '1',
					}}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton'
						disabled={loading}
						onClick={() => this.handleSubmit('add')}
					>
						{product ? 'Guardar' : 'Crear'} y Añadir Otro
					</Button>
					{(loading && adding) && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
				<div
					className='ShareButtonWrapper'
					style={{
						opacity: keyboardOpen ? '0.25' : '1',
					}}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton ShareButton'
						disabled={loading}
						onClick={() => this.handleSubmit('finish')}
					>
						{product ? 'Guardar' : 'Crear'} y {category && category.approved ? 'Finalizar' : 'Compartir'}
					</Button>
					{(loading && !adding) && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
			</div>
	  )
	}
}

export default ProductForm