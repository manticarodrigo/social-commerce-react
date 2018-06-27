import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import UploadDialog from '../../components/Dialog/UploadDialog'
import AlbumDialog from '../../components/Dialog/AlbumDialog'
import ImageDialog from '../../components/Dialog/ImageDialog'

import { updateUser } from '../../services/WordPress'

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

export class ProfileForm extends Component {
	constructor(props) {
		super(props)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	inputElement = null
	state = {
		id: this.props.profile.id ? this.props.profile.id : "",
		businessName: "",
		businessLogo: "",
		name: this.props.profile.name ? this.props.profile.name : "",
		email: this.props.profile.email ? this.props.profile.email : "",
		phone: "",
		dni: "",
		ruc: "",
		bankAcct: "",
		logisticProvider: "",
		uploadDialogOpen: false,
    albumDialogOpen: false,
		selectedAlbumValue: null,
		imageDialogOpen: false,
		selectedImageValue: null,
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
			businessLogo: value,
			selectedImageValue: value,
			imageDialogOpen: false
		})
	}
	
  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.name)
		event.preventDefault()
		const profile = this.state
		updateUser(this.props.auth, profile)
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
		console.log(event.target.files[0])
		if (event.target.files && event.target.files[0]) {
			let reader = new FileReader();
			reader.onload = (e) => {
					this.setState({businessLogo: e.target.result})
			}
			reader.readAsDataURL(event.target.files[0]);
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
							{this.state.businessLogo === '' ? 'Logo' : null}
							<FileUpload style={{display: this.state.businessLogo === '' ? 'block' : 'none'}} />
							<img style={{display: this.state.businessLogo !== '' ? 'block' : 'none', width: '88px', height: '88px', objectFit: 'cover'}} src={this.state.businessLogo} alt={this.state.businessLogo} />
						</Button>
						<input
								ref={input => this.inputElement = input}
								onChange={this.handleImageChanged.bind(this)}
								style={{display: 'none'}}
								type="file"
							/>
						<TextField
							style={{width: 'calc(100% - 104px'}}
							margin="normal"
							label="Negocio"
							name="businessName"
							checked={this.state.businessName}
							onChange={this.handleChange} />
					</div>
					<TextField
						fullWidth
						margin="normal"
						label="Nombre"
						name="name"
						value={this.state.name}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Email"
						name="email"
						value={this.state.email}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Telefono"
						name="phone"
						value={this.state.phone}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="DNI"
						name="dni"
						value={this.state.dni}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="RUC"
						name="ruc"
						value={this.state.ruc}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Cuenta de Banco"
						name="bankAcct"
						value={this.state.bankAcct}
						onChange={this.handleChange} />
				</form>
				<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant="contained" color="primary">
					Continua
				</Button>
			</div>
	  )
	}
}