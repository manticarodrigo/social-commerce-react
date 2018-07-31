import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/FileUpload';
import './ProductForm.css';

import UploadDialog from '../../components/Dialog/UploadDialog';

import {
	updateTitle
} from '../../actions/navActions';
import {
	createProduct,
	updateProduct
} from '../../actions/productActions';
import {
	uploadMedia
} from '../../services/WordPress';
import {
  updateSite
} from '../../actions/siteActions';
import {
	updateCurrentProduct
} from '../../actions/productActions';

class ProductForm extends Component {
	constructor(props) {
		super(props);
		const { product } = this.props;
		this.state = {
			id: product ? product.id : '',
			name: product ? product.name : '',
			description: product ? product.description.replace(/<[^>]+>/g, '') : '',
			cost: product ? product.price : '',
			inventoryCount: product && product.stock_quantity ? product.stock_quantity : '',
			imageUrl: product ? product.images[0].src : '',
			imageId: product ? product.images[0].id : null,
			imageFile: null,
			uploadDialogOpen: false,
			loading: false,
			adding: false,
			keyboardOpen: false
		}
	}

	componentDidMount() {
		const { updateTitle, product } = this.props;
		updateTitle(product ? 'Edita ' + product.name : 'Crea Producto');
	}

	componentDidUpdate(prevProps, prevState) {
		const { updateTitle, product } = this.props;
		if (!product || !product.id) {
			updateTitle('Crea Producto')
		} else {
			updateTitle(product ? 'Edita ' + product.name : 'Crea Producto')
		}
	}

	static getDerivedStateFromProps = (props, state) => {
		const { product } = props;
		if (product && product.id !== state.id) {
			return {
				id: product.id,
				name: product.name,
				description: product.description.replace(/<[^>]+>/g, ''),
				cost: product.price,
				inventoryCount: product.stock_quantity ? product.stock_quantity : '',
				imageUrl: product.images[0].src,
				imageId: product.images[0].id,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				adding: false
			}
		}
		return null;
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
				imageUrl: value.imageUrl,
				imageId: null,
				imageFile: value.imageFile
			});
		} else {
			this.setState({
				uploadDialogOpen: false
			});
		}
	}
	
  handleSubmit = (type) => {
		this.setState({ loading: true, adding: type === 'add' ? true : false });
		const data = this.state;
		const { name, description, cost, imageUrl, imageFile } = this.state;
		if (
			name !== '' &&
			description !== '' &&
			cost !== '' &&
			imageUrl !== ''
		) {
			const { product, site, updateProduct, createProduct } = this.props;
			const callback = product ? updateProduct : createProduct;
			data.site = site;
			if (imageFile) {
				uploadMedia(site.path, imageFile)
					.then(res => {
						console.log(res);
						if (res.data.id) {
							data.imageId = res.data.id;
							callback(site.path, data)
								.then(() => {
									this.setState({ loading: false });
									this.finishSubmit(type);
								})
						} else {
							this.setState({ loading: false });
							alert(res.data);
						}
					})
					.catch(err => {
						this.setState({ loading: false });
						alert(err);
					})
			} else {
				callback(site.path, data)
					.then(() => {
						this.setState({ loading: false });
						this.finishSubmit(type);
					})
			}
		} else {
			this.setState({ loading: false });
			alert('Favor llenar campos requeridos.');
		}
	}
	
	finishSubmit = (type) => {
		const {
			history,
			auth,
			site,
			updateSite,
			updateCurrentProduct
		} = this.props;
		if (type === 'add') {
			updateCurrentProduct(null);
			this.setState({
				id: '',
				name: '',
				description: '',
				cost: '',
				inventoryCount: '',
				imageUrl: '',
				imageId: null,
				imageFile: null,
				uploadDialogOpen: false,
				loading: false,
				adding: false
			});
			history.replace('/producto')
		} else {
			const siteUser = site.users[0];
			const data = {
				id: site.blog_id,
				userName: siteUser.user_name,
				userEmail: siteUser.user_email,
				userPhone: siteUser.user_cellphone,
				userDni: siteUser.user_dni,
				title: site.title,
				bannerUrl: site.banner_url ? site.banner_url : '',
				bannerId: site.banner_id ? site.banner_id : null,
				ruc: site.ruc,
				public: true
			}
			updateSite(auth, data)
				.then(() => {
					updateCurrentProduct(null);
					history.replace('/');
				})
		}
	}
  
	handleInputChange = (event) => {
	  const target = event.target
	  var value = target.type === 'checkbox' ? target.checked : target.value	
		const name = target.name
		if (name === 'cost' && !value.match(/^\d*\.?\d*$/)) {
			return
		} else if	(name === 'inventoryCount' && !value.match(/^(\s*|\d+)$/)) {
			 return
		} else if (name === 'description' && value.length >= 300) {
			return 
		}
	  this.setState({ [name]: value })
	}

	handleInputFocus = (event) => {
		this.setState({ keyboardOpen: true})
	}

	handleInputBlur = (event) => {
		this.setState({ keyboardOpen: false})
	}
  
	render() {
		const { user, product } = this.props;
		const { uploadDialogOpen, loading, adding, keyboardOpen } = this.state;
	  return (
			<div className='ProductForm' style={{paddingBottom: 'calc(75px + 2em'}}>
				{uploadDialogOpen && (
					<UploadDialog
						user={user}
						aspect={'1/1'}
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
							{this.state.imageUrl === '' ? 'Foto' : null}
							<FileUpload style={{display: this.state.imageUrl === '' ? 'block' : 'none'}} />
							<img
								style={{display: this.state.imageUrl !== '' ? 'block' : 'none'}}
								src={this.state.imageUrl}
								alt={this.state.imageUrl} />
							<span
								style={{display: this.state.imageUrl === '' ? 'block' : 'none'}}
								className='Dimensions'>
								300 x 300
							</span>
						</Button>
						<TextField
							required
							style={{width: 'calc(100% - 104px'}}
							margin='normal'
							label='Nombre del producto'
							name='name'
							value={this.state.name}
							type='text' />
					</div>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Descripción'
						name='description'
						multiline
						rows={3}
						value={this.state.description} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Costo'
						name='cost'
						value={this.state.cost} />
					<TextField
						fullWidth
						margin='normal'
						label='Cantidad de inventario'
						name='inventoryCount'
						value={this.state.inventoryCount} />
				</form>
				<div
					className='AddButtonWrapper'
					style={{
						opacity: keyboardOpen ? '0.25' : '1',
					}}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton'
						disabled={loading}
						onClick={() => this.handleSubmit('add')}
					>
						{product ? 'Guardar' : 'Crear'} y Añadir Otro
					</Button>
					{(loading && adding) && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
				<div
					className='ShareButtonWrapper'
					style={{
						opacity: keyboardOpen ? '0.25' : '1',
					}}>
					<Button
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton ShareButton'
						disabled={loading}
						onClick={() => this.handleSubmit('finish')}
					>
						{product ? 'Guardar' : 'Crear'} y Finalizar
					</Button>
					{(loading && !adding) && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
			</div>
	  )
	}
}

const mapStateToProps = state => ({
	user: state.auth.user,
	auth: state.auth.auth,
	site: state.site.site,
  	product: state.products.currentProduct
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	updateSite,
	updateProduct,
	createProduct,
	updateCurrentProduct
}, dispatch);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProductForm)
);