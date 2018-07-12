import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'
import './CategoryForm.css'

import UploadDialog from '../../components/Dialog/UploadDialog'
import { uploadMedia, createCategory, updateCategory } from '../../services/WordPress'

class CategoryForm extends Component {
	constructor(props) {
		super(props)
		
		const { user, category } = this.props
		if (!user) this.props.onBack()
		this.props.navBarTitle(category ? 'Edita ' + category.name : null)

		this.state = {
			id: category ? category.id : false,
			ownerId: user && user.profile.id ? user.profile.id : '',
			businessName: category ? category.name : '',
			businessLogo: category && category.image ? category.image.src : '',
			imageId: category && category.image ? category.image.id : null,
			imageFile: null,
			name: user && user.profile.name ? user.profile.name : '',
			email: user && user.profile.email ? user.profile.email : '',
			phone: category ? category.phone : '',
			dni: category ? category.dni : '',
			ruc: category ? category.ruc : '',
			uploadDialogOpen: false,
			loading: false
		}
	}
	
	handleUploadDialogOpen = () => {
    this.setState({
			uploadDialogOpen: true
		})
  }

  handleUploadDialogClose = (value) => {
		const { imageId } = this.state
		if (typeof(value) === 'object') {
			console.log(value)
			this.setState({
				uploadDialogOpen: false,
				businessLogo: value !== null ? value.imageUrl : '',
				imageId: null,
				imageFile: value.imageFile
			})
		} else {
			this.setState({
				uploadDialogOpen: false,
				businessLogo: value !== undefined ? value : '',
				imageId: value !== undefined ? null : imageId
			})
		}
	}
	
  handleSubmit = (event) => {
		this.setState({ loading: true })
		event.preventDefault()
		const data = this.state
		const { businessName, businessLogo, imageFile, name, email, phone, dni } = this.state
		const { auth, category, onSubmit } = this.props
		if (
			businessName !== '' &&
			businessLogo !== '' &&
			name !== '' &&
			email !== '' &&
			phone !== '' &&
			dni !== ''
		) {
			const callback = category ? updateCategory : createCategory
			if (imageFile) {
				uploadMedia(imageFile)
				.then(res => {
					console.log(res)
					data.imageId = res.data.id
					callback(auth, data)
					.then(res => {
						console.log(res)
						if (res.data && res.data.id !== null) {
							this.setState({ loading: false })
							onSubmit(res.data)
						}
					})
					.catch(err => {
						console.log(err)
					})
				})
				.catch(err => {
					console.log(err)
				})
			} else {
				callback(auth, data)
				.then(res => {
					console.log(res)
					if (res.data && res.data.id !== null) {
						this.setState({ loading: false })
						onSubmit(res.data)
					}
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
  
	handleInputChange = (event) => {
		const { category, navBarTitle } = this.props
		const target = event.target
		const name = target.name
		const value = target.value
		if ((
			name === 'phone' ||
			name === 'dni' ||
			name === 'ruc' ||
			name === 'bankAccount'
		) && !value.match(/^(\s*|\d+)$/)) { return }
		if (name === 'businessName') {
			navBarTitle(category ? 'Edita ' + value : 'Registra ' + value)
		}
		this.setState({ [name]: value })
	}
  
	render() {
		const { user, category } = this.props
		const { uploadDialogOpen, loading, businessLogo } = this.state
		console.log(this.props)
	  return (
			<div style={{paddingBottom: 'calc(30px + 2em'}}>
				{uploadDialogOpen && (
					<UploadDialog
						user={user}
						onClose={this.handleUploadDialogClose} />
				)}
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<div className='UploadWrapper'>
						<Button
							style={{width: '88px', height: '88px', margin: '0 16px 0 0'}}
							variant='outlined'
							component='label'
							color='primary'
							onClick={this.handleUploadDialogOpen}
						>
							{businessLogo === '' ? 'Logo' : null}
							<FileUpload style={{display: businessLogo === '' ? 'block' : 'none'}} />
							<span
								style={{display: businessLogo === '' ? 'block' : 'none'}}
								className='Dimensions'>
								480 x 270
							</span>
							<img
								style={{display: businessLogo !== '' ? 'block' : 'none'}}
								src={businessLogo}
								alt={businessLogo} />
						</Button>
						<TextField
							required
							style={{width: 'calc(100% - 104px'}}
							margin='normal'
							label='Nombre del Negocio'
							name='businessName'
							value={this.state.businessName}
							type='text'
							onChange={this.handleInputChange} />
					</div>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Nombre completo'
						name='name'
						value={this.state.name}
						type='text'
						onChange={this.handleInputChange} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Correo electronico'
						name='email'
						value={this.state.email}
						type='email'
						onChange={this.handleInputChange} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Numero de Telefono Celular'
						name='phone'
						value={this.state.phone}
						onChange={this.handleInputChange} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Numero de DNI'
						name='dni'
						value={this.state.dni}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin='normal'
						label='Numero RUC'
						name='ruc'
						value={this.state.ruc}
						onChange={this.handleInputChange} />
				</form>
				<div className='SaveButtonWrapper'>
					<Button
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton'
						disabled={loading}
						onClick={this.handleSubmit}>
						{category ? 'Guardar' : 'Agregar'} Tienda
					</Button>
					{loading && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
			</div>
	  )
	}
}

export default CategoryForm