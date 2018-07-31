import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { updateTitle } from '../../actions/navActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/FileUpload';
import './SiteForm.css';

import UploadDialog from '../../components/Dialog/UploadDialog';

import {
	createSite,
	updateSite
} from '../../actions/siteActions';
import {
	uploadMedia
} from '../../services/WordPress';

class SiteForm extends Component {
	constructor(props) {
		super(props)
		const { user, site } = props;
		this.state = {
			id: site ? site.id : null,
			userId: user && user.profile.id ? user.profile.id : '',
			userName: user && user.profile.name ? user.profile.name : '',
			userEmail: user && user.profile.email ? user.profile.email : '',
			userPhone: site ? site.userPhone : '',
			userDni: site ? site.userDni : '',
			title: site ? site.name : '',
			bannerUrl: site && site.image ? site.image.src : '',
			bannerId: site && site.image ? site.image.id : null,
			bannerFile: null,
			ruc: site ? site.ruc : '',
			uploadDialogOpen: false,
			loading: false,
			keyboardOpen: false
		};
	}

	componentDidMount() {
		const { updateTitle, site } = this.props;
		updateTitle(site ? 'Edita ' + site.name : 'Registra tu Tienda');
	}

	componentDidUpdate(prevProps, prevState) {
		const { updateTitle, site } = this.props;
		const { title } = this.state;
		const prevBusinessName = prevState.title;
		if (site && (((title === prevBusinessName) || (prevBusinessName === '')))) {
			updateTitle(site ? 'Edita ' + site.name : 'Registra tu Tienda')
		}
	}

	static getDerivedStateFromProps = (props, state) => {
		const { user, site } = props;
		const { id, userId } = state;
		if ((user && site) && site.id !== id) {
			return {
				id: site.id,
				userId: site.userId,
				userName: user.profile.name,
				userEmail: user.profile.email,
				userPhone: site.userPhone,
				userDni: site.userDni,
				title: site.name,
				bannerUrl: site.image ? site.image.src : '',
				bannerId: site.image ? site.image.id : null,
				bannerFile: null,
				ruc: site.ruc,
				uploadDialogOpen: false,
				loading: false,
				keyboardOpen: false
			}
		}
		if (user && userId === '') {
			return {
				userId: user && user.profile.id ? user.profile.id : '',
				userName: user && user.profile.name ? user.profile.name : '',
				userEmail: user && user.profile.email ? user.profile.email : '',
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
				bannerUrl: value.imageUrl,
				bannerId: null,
				bannerFile: value.bannerFile
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
		const { title, bannerFile, userName, userEmail, userPhone, userDni } = this.state;
		const { auth, site, createSite, updateSite } = this.props;
		if (
			title !== '' &&
			userName !== '' &&
			userEmail !== '' &&
			userPhone !== '' &&
			userDni !== ''
		) {
			const callback = site ? updateSite : createSite;
			if (bannerFile) {
				uploadMedia(site.path, bannerFile)
					.then(res => {
						console.log(res);
						data.bannerId = res.data.id;
						callback(auth, data)
							.then(() => {
								this.setState({ loading: false });
								this.finishSubmit();
							})
					})
					.catch(err => {
						console.log(err)
					});
			} else {
				callback(auth, data)
					.then(() => {
						this.setState({ loading: false });
						this.finishSubmit();
					})
			}
		} else {
			this.setState({ loading: false });
			alert('Favor llenar campos requeridos.');
		}
	}

	finishSubmit = () => {
    const { site } = this.props;
    if (site.approved) {
      this.props.history.replace('/');
    } else {
      this.props.history.replace('/pagos');
    }
  }
  
	handleInputChange = (event) => {
		const { updateTitle, site } = this.props;
		const target = event.target;
		const name = target.name;
		const value = target.value;
		if ((
			name === 'userPhone' ||
			name === 'userDni' ||
			name === 'ruc'
		) && !value.match(/^(\s*|\d+)$/)) { return; }
		if ((name === 'title') && (!site || !site.approved)) {
			updateTitle(site ? 'Edita ' + value : 'Registra ' + value);
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
		const { user, site } = this.props;
		const { uploadDialogOpen, loading, bannerUrl, keyboardOpen } = this.state;
	  return (
			<div className='SiteForm' style={{paddingBottom: 'calc(30px + 2em'}}>
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
							{bannerUrl === '' ? 'Banner' : null}
							<FileUpload style={{display: bannerUrl === '' ? 'block' : 'none'}} />
							<img
								style={{display: bannerUrl !== '' ? 'block' : 'none'}}
								src={bannerUrl}
								alt={bannerUrl} />
							<span
								style={{display: bannerUrl === '' ? 'block' : 'none'}}
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
						name='title'
						value={this.state.title}
						type='text' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Nombre completo'
						name='name'
						value={this.state.userName}
						type='text' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Correo electrónico'
						name='email'
						value={this.state.userEmail}
						type='email' />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de teléfono celular'
						name='userPhone'
						value={this.state.userPhone} />
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de DNI'
						name='userDni'
						value={this.state.userDni} />
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
						{site ? 'Guardar' : 'Agregar'} Tienda
					</Button>
					{loading && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
			</div>
	  )
	}
}

const mapStateToProps = state => ({
	user: state.auth.user,
  auth: state.auth.auth,
	site: state.site.site
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	createSite,
	updateSite
}, dispatch)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SiteForm));