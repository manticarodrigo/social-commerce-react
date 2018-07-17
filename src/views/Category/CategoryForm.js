import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateTitle } from '../../actions/titleActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/FileUpload';
import './CategoryForm.css';

import UploadDialog from '../../components/Dialog/UploadDialog';
import { uploadMedia, createCategory, updateCategory } from '../../services/WordPress';

class CategoryForm extends Component {
	constructor(props) {
		super(props)
		const { user, category } = props;
		this.state = {
			id: category ? category.id : null,
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
			uploadDialogOpen: false,
			loading: false,
			keyboardOpen: false
		};
	}

	componentDidMount() {
		const { updateTitle, category } = this.props;
		updateTitle(category ? 'Edita ' + category.name : 'Registra tu Tienda');
	}

	static getDerivedStateFromProps = (props, state) => {
		const { user, category } = props;
		const { id } = state;
		if ((user && category) && category.id !== id) {
			return {
				id: category.id,
				ownerId: category.ownerId,
				businessName: category.name,
				businessLogo: category.image ? category.image.src : '',
				imageId: category.image ? category.image.id : null,
				imageFile: null,
				name: user.profile.name,
				email: user.profile.email,
				phone: category.phone,
				dni: category.dni,
				ruc: category.ruc,
				uploadDialogOpen: false,
				loading: false,
				keyboardOpen: false
			}
		}
		return null
  }
	
	handleUploadDialogOpen = () => {
    this.setState({
			uploadDialogOpen: true
		});
  }

  handleUploadDialogClose = (value) => {
		if (typeof(value) === 'object' && value !== null) {
			this.setState({
				uploadDialogOpen: false,
				businessLogo: value.imageUrl,
				imageId: null,
				imageFile: value.imageFile
			});
		} else {
			this.setState({
				uploadDialogOpen: false
			});
		}
	}
	
  handleSubmit = (event) => {
		this.setState({ loading: true });
		event.preventDefault();
		const data = this.state;
		const { businessName, businessLogo, imageFile, name, email, phone, dni } = this.state;
		const { auth, category, onSubmit } = this.props;
		if (
			businessName !== '' &&
			businessLogo !== '' &&
			name !== '' &&
			email !== '' &&
			phone !== '' &&
			dni !== ''
		) {
			const callback = category ? updateCategory : createCategory;
			if (imageFile) {
				uploadMedia(imageFile)
					.then(res => {
						console.log(res);
						data.imageId = res.data.id;
						callback(auth, data)
							.then(res => {
								console.log(res);
								if (res.data && res.data.id !== null) {
									this.setState({ loading: false });
									onSubmit(res.data);
								}
							})
							.catch(err => {
								console.log(err)
							})
					})
					.catch(err => {
						console.log(err)
					});
			} else {
				callback(auth, data)
					.then(res => {
						console.log(res);
						if (res.data && res.data.id !== null) {
							this.setState({ loading: false });
							onSubmit(res.data);
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		} else {
			this.setState({ loading: false });
			alert('Favor llenar campos requeridos.');
		}
  }
  
	handleInputChange = (event) => {
		const { category, updateTitle } = this.props;
		const target = event.target;
		const name = target.name;
		const value = target.value;
		if ((
			name === 'phone' ||
			name === 'dni' ||
			name === 'ruc'
		) && !value.match(/^(\s*|\d+)$/)) { return; }
		if (name === 'businessName') {
			updateTitle(category ? 'Edita ' + value : 'Registra ' + value);
		}
		this.setState({ [name]: value });
	}

	handleInputFocus = (event) => {
		this.setState({ keyboardOpen: true})
	}

	handleInputBlur = (event) => {
		this.setState({ keyboardOpen: false})
	}
  
	render() {
		const { user, category } = this.props;
		const { uploadDialogOpen, loading, businessLogo, keyboardOpen } = this.state;
	  return (
			<div className='CategoryForm' style={{paddingBottom: 'calc(30px + 2em'}}>
				{uploadDialogOpen && (
					<UploadDialog
						user={user}
						aspect={'16/9'}
						onClose={this.handleUploadDialogClose} />
				)}
				<form
					style={{textAlign:'left'}}
					onChange={this.handleInputChange}
					onFocus={this.handleInputFocus}
					onBlur={this.handleInputBlur}
					onSubmit={this.handleSubmit}>
					<div className='UploadWrapper'>
						<Button
							className='UploadButton'
							variant='outlined'
							component='label'
							color='primary'
							onClick={this.handleUploadDialogOpen}
						>
							{businessLogo === '' ? 'Banner' : null}
							<FileUpload style={{display: businessLogo === '' ? 'block' : 'none'}} />
							<img
								style={{display: businessLogo !== '' ? 'block' : 'none'}}
								src={businessLogo}
								alt={businessLogo} />
							<span
								style={{display: businessLogo === '' ? 'block' : 'none'}}
								className='Dimensions'>
								480 x 270
							</span>
						</Button>
					</div>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Nombre del negocio'
						name='businessName'
						value={this.state.businessName}
						type='text' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Nombre completo'
						name='name'
						value={this.state.name}
						type='text' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Correo electrónico'
						name='email'
						value={this.state.email}
						type='email' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de teléfono celular'
						name='phone'
						value={this.state.phone} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de DNI'
						name='dni'
						value={this.state.dni} />
					<TextField
						fullWidth
						margin='normal'
						label='Número RUC'
						name='ruc'
						value={this.state.ruc} />
				</form>
				<div
					className='SaveButtonWrapper'
					style={{
						opacity: keyboardOpen ? '0.25' : '1',
					}}>
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

const mapStateToProps = state => ({
  // title: state.title.title
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTitle: (title) => updateTitle(title)
}, dispatch)

export default connect(
	null,
	mapDispatchToProps
)(CategoryForm);