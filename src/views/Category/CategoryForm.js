import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import NavBar from '../../components/NavBar/NavBar'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createCategory, updateCategory} from '../../services/WordPress'

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

class CategoryForm extends Component {
	constructor(props) {
		super(props)
		
		const { user, category } = this.props
		if (!user) this.props.history.replace('/')

		this.state = {
			id: user && user.profile.id ? user.profile.id : '',
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
			uploadDialogOpen: false
		}

		this.handleBack = this.handleBack.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleUploadDialogOpen = this.handleUploadDialogOpen.bind(this)
		this.handleUploadDialogClose = this.handleUploadDialogClose.bind(this)
	}

	handleBack() {
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
			const fn = category ? updateCategory : createCategory; 
			if (imageFile) {
				uploadMedia(imageFile)
				.then(res => {
					console.log(res)
					data.imageId = res.data.id
					fn(auth, data)
					.then(res => {
						console.log(res)
						if (res.data && res.data.id !== null) {
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
				fn(auth, data)
				.then(res => {
					console.log(res)
					if (res.data && res.data.id !== null) {
						this.props.onSubmit(res.data)
					}
				})
				.catch(err => {
					console.log(err)
				})
			}
		}
  }
  
	handleInputChange(event) {
	  const target = event.target
	  const value = target.type === 'checkbox' ? target.checked : target.value	
	  const name = target.name
	  this.setState({
			[name]: value
	  })
	}
  
	render() {
		const { user, category } = this.props
		const { uploadDialogOpen } = this.state
	  return (
			<div>
				<NavBar
					noCategory={!category}
					title={category ? 'Edita Tienda' : 'Crea Tienda'}
					onBack={category ? this.handleBack : null}/>
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
								{this.state.businessLogo === '' ? 'Logo' : null}
								<FileUpload style={{display: this.state.businessLogo === '' ? 'block' : 'none'}} />
								<img style={{display: this.state.businessLogo !== '' ? 'block' : 'none', width: '88px', height: '88px', objectFit: 'cover'}} src={this.state.businessLogo} alt={this.state.businessLogo} />
							</Button>
							<TextField
								required
								style={{width: 'calc(100% - 104px'}}
								margin='normal'
								label='Negocio'
								name='businessName'
								value={this.state.businessName}
								onChange={this.handleInputChange} />
						</div>
						<TextField
							required
							fullWidth
							margin='normal'
							label='Nombre'
							name='name'
							value={this.state.name}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Email'
							name='email'
							value={this.state.email}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Telefono'
							name='phone'
							value={this.state.phone}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='DNI'
							name='dni'
							value={this.state.dni}
							onChange={this.handleInputChange} />
						<TextField
							fullWidth
							margin='normal'
							label='RUC'
							name='ruc'
							value={this.state.ruc}
							onChange={this.handleInputChange} />
						<TextField
							fullWidth
							margin='normal'
							label='Cuenta de Banco'
							name='bankAccount'
							value={this.state.bankAccount}
							onChange={this.handleInputChange} />
					</form>
					<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant='contained' color='primary'>
						{category ? 'Guarda' : 'Agrega'} Tienda
					</Button>
				</div>
			</div>
	  )
	}
}

export default withRouter(CategoryForm)