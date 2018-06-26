import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import AlbumDialog from '../../components/Facebook/AlbumDialog'

const style = {
	button: {
		width: '100%',
		height:'50px',
		marginTop: '1em',
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
	state = {
		id: this.props.profile.id ? this.props.profile.id : "",
		business: "",
		businessLogo: "",
		name: this.props.profile.name ? this.props.profile.name : "",
		email: this.props.profile.email ? this.props.profile.email : "",
		phone: "",
		dni: "",
		ruc: "",
		bankAcct: "",
		logisticProvider: "",
    albumDialogOpen: false,
    selectedAlbumValue: null,
  };

  handleAlbumDialogOpen = () => {
    this.setState({
      albumDialogOpen: true,
    })
  }

  handleAlbumDialogClose = value => {
		this.setState({ selectedAlbumValue: value, albumDialogOpen: false })
		console.log(value)
  }
	
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.name)
		event.preventDefault()
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
				<Button
					style={{width: '88px', margin: '0 16px 0 0'}}
					variant="outlined"
					component="label"
					color="primary"
					onClick={this.handleAlbumDialogOpen}
				>
					Album Dialog
				</Button>
				<AlbumDialog
					token={this.props.token}
          selectedValue={this.state.selectedAlbumValue}
          open={this.state.albumDialogOpen}
          onClose={this.handleAlbumDialogClose} />
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<div>
						<Button
							style={{width: '88px', margin: '0 16px 0 0'}}
							variant="outlined"
							component="label"
							color="primary"
							disabled={this.state.loading}
						>
							<FileUpload style={{display: this.state.businessLogo == '' ? 'block' : 'none'}} />
							<img style={{display: this.state.businessLogo != '' ? 'block' : 'none', width: '88px', objectFit: 'cover'}} src={this.state.businessLogo} />
							<input
								onChange={this.handleImageChanged.bind(this)}
								style={{display: 'none'}}
								type="file"
							/>
						</Button>
						<TextField
							style={{width: 'calc(100% - 104px'}}
							margin="normal"
							label="Negocio"
							name="business"
							checked={this.state.business}
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
				<Button onClick={this.handleSubmit} style={style.button} size='large' variant="contained" color="primary">
					Continua
				</Button>
			</div>
	  )
	}
}