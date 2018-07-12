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
			bankAccount: category ? category.bank_account : '',
			logisticProvider: category ? category.logistic_provider : '',
			uploadDialogOpen: false,
			loading: false
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleUploadDialogOpen = this.handleUploadDialogOpen.bind(this)
		this.handleUploadDialogClose = this.handleUploadDialogClose.bind(this)
	}
	
	handleUploadDialogOpen() {
    this.setState({
			uploadDialogOpen: true
		})
  }

  	handleUploadDialogClose(value) {
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
	
  handleSubmit(event) {
		this.setState({ loading: true })
		event.preventDefault()
		const data = this.state
		const { businessName, businessLogo, imageFile, name, email, phone, dni } = this.state
		const { auth, category } = this.props
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
							this.props.onSubmit(res.data)
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
						this.props.onSubmit(res.data)
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
  
	handleInputChange(event) {
	  const target = event.target
	  const value = target.type === 'checkbox' ? target.checked : target.value	
		const name = target.name
		this.setState({
			[name]: value
	  })
		const { category } = this.props
		if (name === 'businessName') {
			this.props.navBarTitle(category ? 'Edita ' + value : 'Registra ' + value)
		}
	}
  
	render() {
		const { user, category } = this.props
		const { uploadDialogOpen, loading, businessLogo } = this.state
	  return (
			<div style={{paddingBottom: 'calc(30px + 2em'}}>
				{uploadDialogOpen && (
					<UploadDialog
						token={user.token}
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
								300 x 300
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
						type='number'
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin='normal'
						label='Numero RUC'
						name='ruc'
						value={this.state.ruc}
						type='number'
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin='normal'
						label='Número de cuenta de Banco'
						name='bankAccount'
						value={this.state.bankAccount}
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