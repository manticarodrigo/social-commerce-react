import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FileUpload from '@material-ui/icons/FileUpload'

import NavBar from '../../components/NavBar/NavBar'

import UploadDialog from '../../components/Dialog/UploadDialog'

import { createProduct } from '../../services/WordPress'

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

export class ProductForm extends Component {
	constructor(props) {
	  super(props)
	  this.state = {
			title: '',
			description: '',
			cost: '',
			inventoryCount: '',
			imageUrl: '',
			imageFile: null,
			uploadDialogOpen: false,
			category: this.props.category
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
			imageUrl: value !== undefined ? value : ''
		})
	}
	
  handleSubmit(event) {
		event.preventDefault()
		const data = this.state
		const { title, description, cost, inventoryCount, imageUrl } = this.state
		if (
			title != '' &&
			description != '' &&
			cost != '' &&
			inventoryCount != '' &&
			imageUrl != ''
		) {
			createProduct(data)
				.then(res => {
					console.log(res)
					this.props.handleSubmit()
				})
				.catch(err => {
					console.log(err)
				})
		} else {
			alert('Favor llenar campos requeridos.')
		}
  }
  
	handleInputChange(event) {
	  const target = event.target;
	  const value = target.type === 'checkbox' ? target.checked : target.value	
	  const name = target.name;
	  this.setState({
			[name]: value
		})
	}

	handleImageChanged(event) {
		if (event.target.files && event.target.files[0]) {
			this.setState({imageFile: event.target.files[0]})
			let reader = new FileReader();
			reader.onload = (e) => {
				this.setState({imageUrl: e.target.result})
			}
			reader.readAsDataURL(event.target.files[0])
		}
	}
  
	render() {
		const { token } = this.props
		const { uploadDialogOpen } = this.state
	  return (
			<div>
				<NavBar title='Crear Productos' />
				<div className='Content'>
					{uploadDialogOpen && (
						<UploadDialog
							token={token}
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
								{this.state.imageUrl === '' ? 'Foto' : null}
								<FileUpload style={{display: this.state.imageUrl === '' ? 'block' : 'none'}} />
								<img style={{display: this.state.imageUrl !== '' ? 'block' : 'none', width: '88px', height: '88px', objectFit: 'cover'}} src={this.state.imageUrl} alt={this.state.imageUrl} />
							</Button>
							<input
									ref={input => this.inputElement = input}
									onChange={this.handleImageChanged.bind(this)}
									style={{display: 'none'}}
									type='file'
								/>
						</div>
						<TextField
							required
							fullWidth
							margin='normal'
							label='Titulo'
							name='title'
							value={this.state.title}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Descripción'
							name='description'
							value={this.state.description}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Costo'
							name='cost'
							value={this.state.cost}
							onChange={this.handleInputChange} />
						<TextField
							required
							fullWidth
							margin='normal'
							label='Cantidad de Inventario'
							name='inventoryCount'
							value={this.state.inventoryCount}
							onChange={this.handleInputChange} />
					</form>
					<Button onClick={this.handleSubmit} style={style.saveButton} size='large' variant='contained' color='primary'>
						Agrega Producto
					</Button>
				</div>
			</div>
	  )
	}
}