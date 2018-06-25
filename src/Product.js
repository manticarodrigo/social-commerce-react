import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export class Product extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
			title: '',
			description: '',
			cost: '',
			inventoryCount: '',
			imageUrl: ''
	  }
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	
  handleSubmit(event) {
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
  
	render() {
	  return (
			<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
				<img width='60' src='https://www.cornerstone-hw.com/wp-content/uploads/2018/02/example-1prdct1.png'/>
				<br />
				<TextField
					fullWidth
					margin="normal"
					label="Titulo"
					name="title"
					checked={this.state.title}
					onChange={this.handleChange} />
				<TextField
					fullWidth
					margin="normal"
					label="Descripción"
					name="description"
					checked={this.state.description}
					onChange={this.handleChange} />
				<TextField
					fullWidth
					margin="normal"
					label="Costo"
					name="cost"
					checked={this.state.cost}
					onChange={this.handleChange} />
				<TextField
					fullWidth
					margin="normal"
					label="Cantidad de Inventario"
					name="inventoryCount"
					checked={this.state.inventoryCount}
					onChange={this.handleChange} />
				<br />
				<Button variant="contained" color="primary">
					Ver vistazo de catalogo
				</Button>
			</form>
	  )
	}
}