import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

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
	  super(props);
	  this.state = {
			id: this.props.id ? this.props.id : "",
			business: "",
			businessLogo: "",
			name: this.props.name ? this.props.name : "",
			email: this.props.email ? this.props.email : "",
			phone: "",
			dni: "",
			ruc: "",
			bankAcct: "",
			logisticProvider: "",
	  }
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.name)
		event.preventDefault()
		this.props.history.replace('/new-product')
  }
  
	handleChange(event) {
	  const target = event.target;
	  const value = target.type === 'checkbox' ? target.checked : target.value	
	  const name = target.name;
	  this.setState({
			[name]: value
	  })
	}
  
	render() {
	  return (
			<div>
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<TextField
						fullWidth
						margin="normal"
						label="Negocio"
						name="business"
						checked={this.state.business}
						onChange={this.handleChange} />
					<TextField
						fullWidth
						margin="normal"
						label="Logo URL"
						name="businessLogo"
						value={this.state.businessLogo}
						onChange={this.handleChange} />
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