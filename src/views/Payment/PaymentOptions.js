import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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

class PaymentOptions extends Component {
  state = {
    checkedCash: true,
    checkedTransfer: false,
    checkedPayPal: false,
		checkedBitcoin: false,
		checkedMercadoPago: false,
		checkedPayU: false,
		checkedCulqi: false,
		checkedPagoFlash: false,
		checkedCard: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

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
			checkedCard
		} = this.state
    return (
			<div className='PaymentShipping'>
				<h3>Forma de Pago</h3>
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
								className={'CheckBox' + (checkedTransfer ? ' Checked' : '')}
								color='primary'
								icon={<Bank className='CheckBoxIcon' />}
								checkedIcon={<Bank className='CheckBoxIcon' />}
								checked={checkedTransfer}
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
								className={'CheckBox' + (checkedCard ? ' Checked' : '')}
								color='primary'
								icon={<CreditCard className='CheckBoxIcon' />}
								checkedIcon={<CreditCard className='CheckBoxIcon' />}
								checked={checkedCard}
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
								className={'CheckBox' + (checkedPayPal ? ' Checked' : '')}
								color='primary'
								icon={<Paypal className='CheckBoxIcon' />}
								checkedIcon={<Paypal className='CheckBoxIcon' />}
								checked={checkedPayPal}
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
								className={'CheckBox' + (checkedBitcoin ? ' Checked' : '')}
								color='primary'
								icon={<Bitcoin className='CheckBoxIcon' />}
								checkedIcon={<Bitcoin className='CheckBoxIcon' />}
								checked={checkedBitcoin}
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
								className={'CheckBox' + (checkedMercadoPago ? ' Checked' : '')}
								color='primary'
								icon={<img className='CheckBoxIcon' src={MercadoPago} />}
								checkedIcon={<img className='CheckBoxIcon' src={MercadoPago} />}
								checked={checkedMercadoPago}
								onChange={this.handleChange('checkedMercadoPago')}
								value='checkedMercadoPago'
							/>
						}
						label="MercadoPago"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedPayU ? ' Checked' : '')}
								color='primary'
								icon={<img className='CheckBoxIcon' src={PayU} />}
								checkedIcon={<img className='CheckBoxIcon' src={PayU} />}
								checked={checkedPayU}
								onChange={this.handleChange('checkedPayU')}
								value='checkedPayU'
							/>
						}
						label="PayU"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedCulqi ? ' Checked' : '')}
								color='primary'
								icon={<img className='CheckBoxIcon' src={Culqi} />}
								checkedIcon={<img className='CheckBoxIcon' src={Culqi} />}
								checked={checkedCulqi}
								onChange={this.handleChange('checkedCulqi')}
								value='checkedCulqi'
							/>
						}
						label="Culqi"
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedPagoFlash ? ' Checked' : '')}
								color='primary'
								icon={<img className='CheckBoxIcon' src={PagoFlash} />}
								checkedIcon={<img className='CheckBoxIcon' src={PagoFlash} />}
								checked={checkedPagoFlash}
								onChange={this.handleChange('checkedPagoFlash')}
								value='checkedPagoFlash'
							/>
						}
						label="PagoFlash"
					/>
				</FormGroup>
			</div>
    );
  }
}

export default PaymentOptions;