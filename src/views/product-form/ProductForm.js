import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export class ProductForm extends Component {
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
			<div>
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<img style={{width: '100px', height: '100px', objectFit: 'cover'}} src='https://cdn.shopify.com/s/files/1/1204/3402/products/Cypress-Black_1024x1024.jpg?v=1480613608'/>
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
				</form>
				<Button onClick={this.handleSubmit} style={{width: '100%', marginTop: '1em'}} size='large' variant="contained" color="primary">
					Previstar catalogo
				</Button>
			</div>
	  )
	}
}