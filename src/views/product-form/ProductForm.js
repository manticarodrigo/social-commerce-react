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

export class ProductForm extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
			title: '',
			description: '',
			cost: '',
			inventoryCount: '',
			imageUrl: 'https://www.foot.com/wp-content/uploads/2017/03/placeholder.gif'
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
		if (value !== '') {
			this.setState({imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHF2PqPq0dbM-PMpcY4xXgF2iwx8OqhISJrPrKnDV5WGOs4P2htw'})
		}
	}
  
	render() {
	  return (
			<div>
				<form style={{textAlign:'left'}} onSubmit={this.handleSubmit}>
					<img style={{width: '100px', height: '100px', objectFit: 'cover'}} src={this.state.imageUrl} alt={this.state.imageUrl} />
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
				<Button onClick={this.handleSubmit} style={style.button} size='large' variant="contained" color="primary">
					Revisa tu catalogo
				</Button>
			</div>
	  )
	}
}