import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { uploadMedia, createCategory } from '../../services/WordPress'

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

export class CategoryForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			id: this.props.profile.id ? this.props.profile.id : '',
			businessName: '',
			businessLogo: '',
			name: this.props.profile.name ? this.props.profile.name : '',
			email: this.props.profile.email ? this.props.profile.email : '',
			phone: '',
			dni: '',
			ruc: '',
			bankAccount: '',
			logisticProvider: '',
			uploadDialogOpen: false
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
		this.setState({
			uploadDialogOpen: false,
			businessLogo: value
		})
	}
	
  handleSubmit(event) {
		event.preventDefault()
		const profile = this.state
		const { auth } = this.props
		createCategory(auth, profile)
		.then(res => {
			console.log(res);
			if (res.data && res.data.term_id != null) {
				this.props.handleWpTerm(res.data.term_id, res.data.term_link);
			}
		})
		.catch(err => {
			console.log(err)
		});
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
		const { token } = this.props
		const { uploadDialogOpen } = this.state
	  return (
			<div>
				{uploadDialogOpen && (
					<UploadDialog
						token={token}
						onClose={this.handleUploadDialogClose} />
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
							{this.state.businessLogo === '' ? 'Logo' : null}
							<FileUpload style={{display: this.state.businessLogo === '' ? 'block' : 'none'}} />
							<img style={{display: this.state.businessLogo !== '' ? 'block' : 'none', width: '88px', height: '88px', objectFit: 'cover'}} src={this.state.businessLogo} alt={this.state.businessLogo} />
						</Button>
						<TextField
							style={{width: 'calc(100% - 104px'}}
							margin="normal"
							label="Negocio"
							name="businessName"
							value={this.state.businessName}
							onChange={this.handleInputChange} />
					</div>
					<TextField
						fullWidth
						margin="normal"
						label="Nombre"
						name="name"
						value={this.state.name}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Email"
						name="email"
						value={this.state.email}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Telefono"
						name="phone"
						value={this.state.phone}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin="normal"
						label="DNI"
						name="dni"
						value={this.state.dni}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin="normal"
						label="RUC"
						name="ruc"
						value={this.state.ruc}
						onChange={this.handleInputChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Cuenta de Banco"
						name="bankAccount"
						value={this.state.bankAccount}
						onChange={this.handleInputChange} />
				</form>
				<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant="contained" color="primary">
					Continua
				</Button>
			</div>
	  )
	}
}