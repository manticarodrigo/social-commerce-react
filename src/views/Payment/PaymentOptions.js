import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
	Cash,
	Bank,
	Paypal,
	Bitcoin,
	CreditCard
} from 'mdi-material-ui';
import MercadoPago from '../../assets/png/MercadoPago.png';
import PayU from '../../assets/png/PayU.png';
import Culqi from '../../assets/png/Culqi.png';
import PagoFlash from '../../assets/png/PagoFlash.png';
import './PaymentOptions.css';

import { updateCategory } from '../../services/WordPress';

class PaymentOptions extends Component {
	constructor(props) {
		super(props)
		const { category } = props
		this.state = {
			id: category ? category.id : null,
			checkedCash: true,
			checkedTransfer: category && category.bank_account !== '' ? true : false,
			checkedPayPal: false,
			checkedBitcoin: false,
			checkedMercadoPago: false,
			checkedPayU: false,
			checkedCulqi: false,
			checkedPagoFlash: false,
			checkedCard: false,
			bankAccount: category && category.bank_account !== '' ? category.bank_account : '',
			loading: false
		};
	}

	static getDerivedStateFromProps = (props, state) => {
		const { category } = props;
		const { id } = state
		if (category && category.id !== id) {
			return {
				checkedTransfer: category.bank_account !== '' ? true : false,
				bankAccount: category.bank_account !== '' ? category.bank_account : ''
			}
		}
		return null
  }
	
	handleCheckboxChange = name => event => {
		console.log(event.target.checked)
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
		const { auth, category, onSubmit } = this.props;
		console.log(category)
		const { checkedTransfer, bankAccount } = this.state;
		if (category && checkedTransfer) {
			if (bankAccount !== '') {
				category.bankAccount = bankAccount
				updateCategory(auth, category)
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
			} else {
				this.setState({ loading: false });
				alert('Favor llenar campos requeridos.');
			}
		} else {
			category.bankAccount = null
			updateCategory(auth, category)
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
		}
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
			loading
		} = this.state
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
						label='Deposito'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedCard ? ' Checked' : '')}
								color='primary'
								icon={<CreditCard className='CheckBoxIcon' />}
								checkedIcon={<CreditCard className='CheckBoxIcon' />}
								checked={checkedCard}
								onChange={this.handleCheckboxChange('checkedCard')}
								value='checkedCard'
							/>
						}
						label='Debito/Credito (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedPayPal ? ' Checked' : '')}
								color='primary'
								icon={<Paypal className='CheckBoxIcon' />}
								checkedIcon={<Paypal className='CheckBoxIcon' />}
								checked={checkedPayPal}
								onChange={this.handleCheckboxChange('checkedPayPal')}
								value='checkedPayPal'
							/>
						}
						label='PayPal (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedBitcoin ? ' Checked' : '')}
								color='primary'
								icon={<Bitcoin className='CheckBoxIcon' />}
								checkedIcon={<Bitcoin className='CheckBoxIcon' />}
								checked={checkedBitcoin}
								onChange={this.handleCheckboxChange('checkedBitcoin')}
								value='checkedBitcoin'
							/>
						}
						label='Bitcoin (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedMercadoPago ? ' Checked' : '')}
								color='primary'
								icon={<img alt='MercadoPago' className='CheckBoxIcon' src={MercadoPago} />}
								checkedIcon={<img alt='MercadoPago' className='CheckBoxIcon' src={MercadoPago} />}
								checked={checkedMercadoPago}
								onChange={this.handleCheckboxChange('checkedMercadoPago')}
								value='checkedMercadoPago'
							/>
						}
						label='MercadoPago (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedPayU ? ' Checked' : '')}
								color='primary'
								icon={<img alt='PayU' className='CheckBoxIcon' src={PayU} />}
								checkedIcon={<img alt='PayU' className='CheckBoxIcon' src={PayU} />}
								checked={checkedPayU}
								onChange={this.handleCheckboxChange('checkedPayU')}
								value='checkedPayU'
							/>
						}
						label='PayU (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedCulqi ? ' Checked' : '')}
								color='primary'
								icon={<img alt='Culqi' className='CheckBoxIcon' src={Culqi} />}
								checkedIcon={<img alt='Culqi' className='CheckBoxIcon' src={Culqi} />}
								checked={checkedCulqi}
								onChange={this.handleCheckboxChange('checkedCulqi')}
								value='checkedCulqi'
							/>
						}
						label='Culqi (proximamente)'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox' + (checkedPagoFlash ? ' Checked' : '')}
								color='primary'
								icon={<img alt='PagoFlash' className='CheckBoxIcon' src={PagoFlash} />}
								checkedIcon={<img alt='PagoFlash' className='CheckBoxIcon' src={PagoFlash} />}
								checked={checkedPagoFlash}
								onChange={this.handleCheckboxChange('checkedPagoFlash')}
								value='checkedPagoFlash'
							/>
						}
						label='PagoFlash (proximamente)'
					/>
				</FormGroup>
				{checkedTransfer && (
					<form
						style={{textAlign:'left'}}
						onChange={this.handleTextFieldChange}
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
				<div className='SaveButtonWrapper'>
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

export default PaymentOptions;