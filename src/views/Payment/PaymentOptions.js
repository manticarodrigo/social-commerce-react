import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SvgIcon from '@material-ui/core/SvgIcon';
import {
	Cash,
	Bank,
	Paypal,
	Bitcoin,
	CreditCard
} from 'mdi-material-ui';
import PayU from '../../assets/png/PayU.png';
import './PaymentOptions.css';

class PaymentOptions extends Component {
  state = {
    checkedCash: true,
    checkedTransfer: false,
    checkedPayPal: false,
		checkedBitcoin: false,
		checkedMercadoPago: false,
		checkedPayU: false,
		checkedCulki: false,
		checkedPagoflash: false,
		checkedCard: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    return (
			<div className='PaymentShipping'>
				<h3>Forma de Pago</h3>
				<FormGroup row>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<Cash className='CheckBoxIcon' />}
								checkedIcon={<Cash className='CheckBoxIcon' />}
								checked={this.state.checkedCash}
								onChange={this.handleChange('checkedCash')}
								value='checkedCash'
							/>
						}
						label="Efectivo"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<Bank className='CheckBoxIcon' />}
								checkedIcon={<Bank className='CheckBoxIcon' />}
								checked={this.state.checkedTransfer}
								onChange={this.handleChange('checkedTransfer')}
								value='checkedTransfer'
							/>
						}
						label="Deposito"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<CreditCard className='CheckBoxIcon' />}
								checkedIcon={<CreditCard className='CheckBoxIcon' />}
								checked={this.state.checkedCard}
								onChange={this.handleChange('checkedCard')}
								value='checkedCard'
							/>
						}
						label="Debito/Credito"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<Paypal className='CheckBoxIcon' />}
								checkedIcon={<Paypal className='CheckBoxIcon' />}
								checked={this.state.checkedPayPal}
								onChange={this.handleChange('checkedPayPal')}
								value='checkedPayPal'
							/>
						}
						label="PayPal"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<Bitcoin className='CheckBoxIcon' />}
								checkedIcon={<Bitcoin className='CheckBoxIcon' />}
								checked={this.state.checkedBitcoin}
								onChange={this.handleChange('checkedBitcoin')}
								value='checkedBitcoin'
							/>
						}
						label="Bitcoin"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className='CheckBox'
								color='primary'
								icon={<img className='CheckBoxIcon' src={PayU} />}
								checkedIcon={<img className='CheckBoxIcon' src={PayU} />}
								checked={this.state.checkedPayU}
								onChange={this.handleChange('checkedPayU')}
								value='checkedPayU'
							/>
						}
						label="PayU"
					/>
				</FormGroup>
			</div>
    );
  }
}

export default PaymentOptions;