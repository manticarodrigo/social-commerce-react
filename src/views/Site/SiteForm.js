// React
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './SiteForm.css';
// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// Raven
import Raven from "raven-js";
// Material UI Core
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/FileUpload';
// Components
import UploadDialog from '../../components/UploadDialog/UploadDialog';
// Actions
import {
	updateTitle
} from '../../actions/navActions';
import {
	createSite,
	updateSite
} from '../../actions/siteActions';
// Services
import {
	uploadMedia
} from '../../services/WordPress';

class SiteForm extends Component {
	constructor(props) {
		super(props)
		const { user, site } = props;
		this.state = {
			id: site ? site.blog_id : null,
			userName: site ? site.users[0].user_name : user && user.profile.name ? user.profile.name : '',
			userEmail: site ? site.users[0].user_email : user && user.profile.email ? user.profile.email : '',
			userPhone: site ? site.users[0].user_cellphone : '',
			userDni: site ? site.users[0].user_dni : '',
			title: site ? site.title : '',
			bannerUrl: site && site.banner_url ? site.banner_url : '',
			bannerId: site && site.banner_id ? site.banner_id : null,
			bannerFile: null,
			ruc: site ? site.ruc : '',
			uploadDialogOpen: false,
			loading: false
		};
	}

	componentDidMount() {
		const { updateTitle, site } = this.props;
		updateTitle(site ? 'Edita ' + site.title : 'Registra tu Tienda');
	}

	componentDidUpdate(prevProps, prevState) {
		const { updateTitle, site } = this.props;
		const { title } = this.state;
		const prevTitle = prevState.title;
		if (site && (((title === prevTitle) || (prevTitle === '')))) {
			updateTitle(site ? 'Edita ' + site.title : 'Registra tu Tienda')
		}
		if (!site && title === '') {
			updateTitle('Registra tu Tienda')
		}
	}

	static getDerivedStateFromProps = (props, state) => {
		const { auth, user, site } = props;
		if ((auth && site) && site.blog_id !== state.id) {
			const siteUser = site.users[0];
			return {
				id: site.blog_id,
				userName: siteUser.user_name,
				userEmail: siteUser.user_email,
				userPhone: siteUser.user_cellphone,
				userDni: siteUser.user_dni,
				title: site.title,
				bannerUrl: site.banner_url ? site.banner_url : '',
				bannerId: site.banner_id ? site.banner_id : null,
				bannerFile: null,
				ruc: site.ruc,
				uploadDialogOpen: false,
				loading: false
			}
		}
		if ((auth && !site) && state.id !== null) {
			return {
				id: null,
				userName: user && user.profile.name ? user.profile.name : '',
				userEmail: user && user.profile.email ? user.profile.email : '',
				userPhone: '',
				userDni: '',
				title: '',
				bannerUrl: '',
				bannerId: null,
				bannerFile: null,
				ruc: '',
				uploadDialogOpen: false,
				loading: false
			}
		}
		if ((auth && user) && state.userName === '') {
			return {
				userName: user.profile.name,
				userEmail: user.profile.email
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
				bannerFile: value.imageFile
			});
		} else {
			this.setState({
				uploadDialogOpen: false
			});
		}
	}
	
  handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const data = this.state;
		const site = this.props.site;
		const {
			title,
			bannerUrl,
			bannerFile,
			userName,
			userEmail,
			userPhone,
			userDni
		} = this.state;
		if (
			bannerUrl !== '' &&
			title !== '' &&
			userName !== '' &&
			userEmail !== '' &&
			userPhone !== '' &&
			userDni !== ''
		) {
			data.bankAccount = site ? site.bank_account : '';
			data.public = site ? site.public : false;
			if (site) {
				this.updateSite(data);
			} else if (!site && bannerFile) {
				this.registerSite(data);
			} else {
				this.setState({ loading: false });
				alert('Favor llenar campos requeridos.');
			}
		} else {
			this.setState({ loading: false });
			alert('Favor llenar campos requeridos.');
		}
	}

	updateSite = (data) => {
		const {
			auth,
			site,
			updateSite
		} = this.props;
		const {
			bannerFile
		} = this.state;
		if (bannerFile) {
			uploadMedia(site.path, bannerFile)
				.then(res => {
					console.log(res);
					data.bannerId = res.data.id;
					if (res.data.id) {
						updateSite(auth, data)
							.then(() => {
								this.setState({ loading: false });
								this.finishSubmit();
							})
							.catch(err => {
								this.setState({ loading: false });
								console.log(err.response.data.message);
								Raven.captureException(JSON.stringify(err));
								alert(err.response.data.message);
							});
					} else {
						this.setState({ loading: false });
						Raven.captureException(res.data);
						alert(res.data);
					}
				})
				.catch(err => {
					this.setState({ loading: false });
					console.log(err);
					Raven.captureException(JSON.stringify(err));
					alert(err);
				});
		} else {
			updateSite(auth, data)
				.then(() => {
					this.setState({ loading: false });
					this.finishSubmit();
				})
				.catch(err => {
					this.setState({ loading: false });
					console.log(err.response.data.message);
					Raven.captureException(JSON.stringify(err));
					alert(err.response.data.message);
				});
		}
	}

	registerSite = (data) => {
		const {
			auth,
			createSite,
			updateSite
		} = this.props;
		const {
			bannerFile
		} = this.state;
		createSite(auth, data)
			.then(res => {
				console.log(res);
				data.id = res.blog_id;
				uploadMedia(res.path, bannerFile)
					.then(res => {
						console.log(res);
						data.bannerId = res.data.id;
						updateSite(auth, data)
							.then(() => {
								this.setState({ loading: false });
								this.finishSubmit();
							})
							.catch(err => {
								this.setState({ loading: false });
								console.log(err.response.data.message);
								Raven.captureException(JSON.stringify(err));
								alert(err.response.data.message);
							});
					})
					.catch(err => {
						this.setState({ loading: false });
						console.log(err.response.data.message);
						Raven.captureException(JSON.stringify(err));
						alert(err.response.data.message);
					});
			})
			.catch(err => {
				this.setState({ loading: false });
				console.log(err);
				Raven.captureException(JSON.stringify(err));
				alert(err.response.data.message);
			});
	}

	finishSubmit = () => {
    const { site } = this.props;
    if (site.public) {
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
		if ((name === 'title') && (!site || !site.public)) {
			updateTitle(site ? 'Edita ' + value : 'Registra ' + value);
		}
		this.setState({ [name]: value });
	}
  
	render() {
		const { user, site } = this.props;
		const { uploadDialogOpen, loading, bannerUrl } = this.state;
	  return (
			<div className='SiteForm'>
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
					onSubmit={this.handleSubmit}
					autoComplete='off'
				>
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
								alt={bannerUrl}
							/>
							<span
								style={{display: bannerUrl === '' ? 'block' : 'none'}}
								className='Dimensions'
							>
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
						type='text'
					/>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Nombre completo'
						name='userName'
						value={this.state.userName}
						type='text'
					/>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Correo electrónico'
						name='userEmail'
						value={this.state.userEmail}
						type='email' 
						disabled={Boolean(site)}
					/>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de teléfono celular'
						name='userPhone'
						value={this.state.userPhone}
					/>
					<TextField
						required
						fullWidth
						margin='normal'
						label='Número de DNI'
						name='userDni'
						value={this.state.userDni}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='Número RUC'
						name='ruc'
						value={this.state.ruc}
					/>
				</form>
				<div className='SaveButtonWrapper'>
					<Button
						fullWidth
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton'
						disabled={loading}
						onClick={this.handleSubmit}
					>
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