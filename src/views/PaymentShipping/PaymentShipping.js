import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './PaymentShipping.css';

class PaymentShipping extends Component {
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
			<div>
				<h3>Forma de Pago:</h3>
				<FormGroup row>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.checkedCash}
								onChange={this.handleChange('checkedCash')}
								value='checkedCash'
								color='primary'
							/>
						}
						label='Contra Entrega'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.checkedTransfer}
								onChange={this.handleChange('checkedTransfer')}
								value='checkedTransfer'
								color='primary'
							/>
						}
						label='Deposito'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.checkedPayPal}
								onChange={this.handleChange('checkedPayPal')}
								value='checkedPayPal'
								color='primary'
							/>
						}
						label='PayPal'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={this.state.checkedBitcoin}
								onChange={this.handleChange('checkedBitcoin')}
								value='checkedBitcoin'
								color='primary'
							/>
						}
						label='Bitcoin'
					/>
				</FormGroup>
			</div>
    );
  }
}

export default PaymentShipping;