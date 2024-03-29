import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import './ShippingOptions.css';

import Truck from 'mdi-material-ui/Truck';
import Cabify from '../../assets/png/Cabify.png';
import DHL from '../../assets/png/DHL.png';
import MRW from '../../assets/png/MRW.png';
import Urbaner from '../../assets/png/Urbaner.png';
import Glovo from '../../assets/png/Glovo.png';

import {
	updateTitle
} from '../../actions/navActions';

class ShippingOptions extends Component {
  state = {
    checkedSelf: true,
    checkedCabify: false,
    checkedDHL: false,
		checkedMRW: false,
		checkedUrbaner: false,
		checkedGlovo: false,
		loading: false
	};
	
	componentDidMount() {
		const { updateTitle } = this.props;
		updateTitle('Opciones de Envio');
	}
	
	handleCheckboxChange = name => event => {
		this.setState({ [name]: event.target.checked });
	}

	handleSubmit = () => {
    const {
      history,
      site
    } = this.props;
    if (site && site.public) {
      history.replace('/');
    } else {
      history.replace('/producto');
    }
  }

  render() {
		const {
			checkedSelf,
			checkedCabify,
			checkedDHL,
			checkedMRW,
			checkedUrbaner,
			checkedGlovo,
			loading
		} = this.state;
    return (
			<div className='ShippingOptions'>
				<p style={{maxWidth: '250px', margin: '1em auto'}}>
					Escoga todas las formas de envio que desea ofrecer a sus clientes.
				</p>
				<FormGroup row>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								className={'CheckBox' + (checkedSelf ? ' Checked' : '')}
								color='primary'
								icon={<Truck className='CheckBoxIcon' />}
								checkedIcon={<Truck className='CheckBoxIcon' />}
								checked={checkedSelf}
								onChange={this.handleCheckboxChange('checkedSelf')}
								value='checkedSelf'
							/>
						}
						label='Envio Propio'
					/>
				</FormGroup>
				<p style={{marginTop: '2em'}}>Proximamente</p>
				<FormGroup row>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedCabify ? ' Checked' : '')}
								color='primary'
								icon={<img alt='Cabify' className='CheckBoxIcon' src={Cabify} />}
								checkedIcon={<img alt='Cabify' className='CheckBoxIcon' src={Cabify} />}
								checked={checkedCabify}
								onChange={this.handleCheckboxChange('checkedCabify')}
								value='checkedCabify'
							/>
						}
						label='Cabify'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedDHL ? ' Checked' : '')}
								color='primary'
								icon={<img alt='DHL' className='CheckBoxIcon' src={DHL} />}
								checkedIcon={<img alt='DHL' className='CheckBoxIcon' src={DHL} />}
								checked={checkedDHL}
								onChange={this.handleCheckboxChange('checkedDHL')}
								value='checkedDHL'
							/>
						}
						label='DHL'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedMRW ? ' Checked' : '')}
								color='primary'
								icon={<img alt='MRW' className='CheckBoxIcon' src={MRW} />}
								checkedIcon={<img alt='MRW' className='CheckBoxIcon' src={MRW} />}
								checked={checkedMRW}
								onChange={this.handleCheckboxChange('checkedMRW')}
								value='checkedMRW'
							/>
						}
						label='MRW'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedUrbaner ? ' Checked' : '')}
								color='primary'
								icon={<img alt='Urbaner' className='CheckBoxIcon' src={Urbaner} />}
								checkedIcon={<img alt='Urbaner' className='CheckBoxIcon' src={Urbaner} />}
								checked={checkedUrbaner}
								onChange={this.handleCheckboxChange('checkedUrbaner')}
								value='checkedUrbaner'
							/>
						}
						label='Urbaner'
					/>
					<FormControlLabel
						className='CheckBoxLabel'
						control={
							<Checkbox
								disabled
								className={'CheckBox Disabled' + (checkedGlovo ? ' Checked' : '')}
								color='primary'
								icon={<img alt='Glovo' className='CheckBoxIcon' src={Glovo} />}
								checkedIcon={<img alt='Glovo' className='CheckBoxIcon' src={Glovo} />}
								checked={checkedGlovo}
								onChange={this.handleCheckboxChange('checkedGlovo')}
								value='checkedGlovo'
							/>
						}
						label='Glovo'
					/>
				</FormGroup>
				<div className='SaveButtonWrapper'>
					<Button
						fullWidth
						size='large'
						variant='contained'
						color='primary'
						className='SaveButton'
						disabled={loading || !checkedSelf}
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
  site: state.site.site
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle
}, dispatch)

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ShippingOptions)
);