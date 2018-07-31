import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './PaymentOptions.css';

import Cash from 'mdi-material-ui/Cash';
import Bank from 'mdi-material-ui/Bank';
import Paypal from 'mdi-material-ui/Paypal';
import Bitcoin from 'mdi-material-ui/Bitcoin';
import CreditCard from 'mdi-material-ui/CreditCard';
import MercadoPago from '../../assets/png/MercadoPago.png';
import PayU from '../../assets/png/PayU.png';
import Culqi from '../../assets/png/Culqi.png';
import PagoFlash from '../../assets/png/PagoFlash.png';

import {
	updateTitle
} from '../../actions/navActions';
import {
	updateSite
} from '../../actions/siteActions';

class PaymentOptions extends Component {
	constructor(props) {
		super(props)
		const { site } = props
		this.state = {
			id: site ? site.id : null,
			checkedCash: true,
			checkedTransfer: site && site.bank_account !== '' ? true : false,
			checkedPayPal: false,
			checkedBitcoin: false,
			checkedMercadoPago: false,
			checkedPayU: false,
			checkedCulqi: false,
			checkedPagoFlash: false,
			checkedCard: false,
			bankAccount: site ? site.bank_account : '',
			loading: false,
			keyboardOpen: false
		};
	}

	componentDidMount() {
		const { updateTitle } = this.props;
		updateTitle('Opciones de Pago');
	}

	static getDerivedStateFromProps = (props, state) => {
		const { site } = props;
		const { id } = state;
		if (site && site.id !== id) {
			return {
				id: site.id,
				checkedTransfer: site.bank_account !== '' ? true : false,
				bankAccount: site.bank_account
			};
		}
		return null;
  }
	
	handleCheckboxChange = name => event => {
		this.setState({ [name]: event.target.checked });
	}

  handleTextFieldChange = (event) => {
		const target = event.target;
		const name = target.name;
		const value = target.value;
		if ((name === 'bankAccount') && !value.match(/^(\s*|\d+)$/)) { return; }
		this.setState({ [name]: value });
	};
	
	handleSubmit = () => {
		this.setState({ loading: true });
		const { auth, site, updateSite } = this.props;
		const { checkedTransfer, bankAccount } = this.state;
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
			public: site.public
		}
		if (site && checkedTransfer) {
			if (bankAccount !== '') {
				data.bankAccount = bankAccount;
				updateSite(auth, site)
					.then(() => {
						this.setState({ loading: false });
							this.finishSubmit();
					})
			} else {
				this.setState({ loading: false });
				alert('Favor llenar campos requeridos.');
			}
		} else {
			// data.bankAccount = '';
			updateSite(auth, data)
				.then(() => {
					this.setState({ loading: false });
					this.finishSubmit();
				});
		}
	}

	finishSubmit() {
		const {
			history,
			site
		} = this.props;
		if (site && site.public) {
			history.replace('/');
		} else {
			history.replace('/envios');
		}
	}

	handleInputFocus = (event) => {
		this.setState({ keyboardOpen: true})
	}

	handleInputBlur = (event) => {
		this.setState({ keyboardOpen: false})
	}

  render() {
		const {
			checkedCash,
			checkedTransfer,
			checkedPayPal,
			checkedBitcoin,
			checkedMercadoPago,
			checkedPayU,
			checkedCulqi,
			checkedPagoFlash,
			checkedCard,
			bankAccount,
			loading,
			keyboardOpen
		} = this.state;
    return (
			<div className='PaymentOptions'>
				<p style={{maxWidth: '250px', margin: '1em auto'}}>
					Escoga todas las formas de pago que desea ofrecer a sus clientes.
				</p>
				<FormGroup row>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedCash ? ' Checked' : '')}
								color='primary'
								icon={<Cash className='CheckBoxIcon' />}
								checkedIcon={<Cash className='CheckBoxIcon' />}
								checked={checkedCash}
								onChange={this.handleCheckboxChange('checkedCash')}
								value='checkedCash'
							/>
						}
						label='Efectivo'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedTransfer ? ' Checked' : '')}
								color='primary'
								icon={<Bank className='CheckBoxIcon' />}
								checkedIcon={<Bank className='CheckBoxIcon' />}
								checked={checkedTransfer}
								onChange={this.handleCheckboxChange('checkedTransfer')}
								value='checkedTransfer'
							/>
						}
						label='Transferencia'
					/>
				</FormGroup>
				{checkedTransfer && (
					<form
						style={{textAlign:'left'}}
						onChange={this.handleTextFieldChange}
						onFocus={this.handleInputFocus}
						onBlur={this.handleBlur}
						onSubmit={this.handleSubmit}>
						<TextField
							required
							fullWidth
							margin='normal'
							label='Numero de cuenta bancaria'
							name='bankAccount'
							value={bankAccount} />
					</form>
				)}
				<p style={{marginTop: '2em'}}>Proximamente</p>
				<FormGroup row>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedCard ? ' Checked' : '')}
								color='primary'
								icon={<CreditCard className='CheckBoxIcon' />}
								checkedIcon={<CreditCard className='CheckBoxIcon' />}
								checked={checkedCard}
								onChange={this.handleCheckboxChange('checkedCard')}
								value='checkedCard'
							/>
						}
						label='Debito/Credito'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedPayPal ? ' Checked' : '')}
								color='primary'
								icon={<Paypal className='CheckBoxIcon' />}
								checkedIcon={<Paypal className='CheckBoxIcon' />}
								checked={checkedPayPal}
								onChange={this.handleCheckboxChange('checkedPayPal')}
								value='checkedPayPal'
							/>
						}
						label='PayPal'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedBitcoin ? ' Checked' : '')}
								color='primary'
								icon={<Bitcoin className='CheckBoxIcon' />}
								checkedIcon={<Bitcoin className='CheckBoxIcon' />}
								checked={checkedBitcoin}
								onChange={this.handleCheckboxChange('checkedBitcoin')}
								value='checkedBitcoin'
							/>
						}
						label='Bitcoin'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedMercadoPago ? ' Checked' : '')}
								color='primary'
								icon={<img alt='MercadoPago' className='CheckBoxIcon' src={MercadoPago} />}
								checkedIcon={<img alt='MercadoPago' className='CheckBoxIcon' src={MercadoPago} />}
								checked={checkedMercadoPago}
								onChange={this.handleCheckboxChange('checkedMercadoPago')}
								value='checkedMercadoPago'
							/>
						}
						label='MercadoPago'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedPayU ? ' Checked' : '')}
								color='primary'
								icon={<img alt='PayU' className='CheckBoxIcon' src={PayU} />}
								checkedIcon={<img alt='PayU' className='CheckBoxIcon' src={PayU} />}
								checked={checkedPayU}
								onChange={this.handleCheckboxChange('checkedPayU')}
								value='checkedPayU'
							/>
						}
						label='PayU'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedCulqi ? ' Checked' : '')}
								color='primary'
								icon={<img alt='Culqi' className='CheckBoxIcon' src={Culqi} />}
								checkedIcon={<img alt='Culqi' className='CheckBoxIcon' src={Culqi} />}
								checked={checkedCulqi}
								onChange={this.handleCheckboxChange('checkedCulqi')}
								value='checkedCulqi'
							/>
						}
						label='Culqi'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedPagoFlash ? ' Checked' : '')}
								color='primary'
								icon={<img alt='PagoFlash' className='CheckBoxIcon' src={PagoFlash} />}
								checkedIcon={<img alt='PagoFlash' className='CheckBoxIcon' src={PagoFlash} />}
								checked={checkedPagoFlash}
								onChange={this.handleCheckboxChange('checkedPagoFlash')}
								value='checkedPagoFlash'
							/>
						}
						label='PagoFlash'
					/>
				</FormGroup>
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
						Guardar Ajustes
					</Button>
					{loading && <CircularProgress size={24} className='ButtonProgress' />}
				</div>
			</div>
    );
  }
}

const mapStateToProps = state => ({
	auth: state.auth.auth,
	site: state.site.site
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	updateSite
}, dispatch)

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(PaymentOptions)
);
