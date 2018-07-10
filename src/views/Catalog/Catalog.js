import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

import './Catalog.css'

const style = {
	fullSize: {
		width: '100%',
		height: '100%'
	},
}
class Catalog extends Component {
	constructor(props) {
		super(props)
		const { category } = this.props
		if (!category) this.props.onBack()
		this.disableInputs()
	}

	disableInputs() {
		var buttons = document.getElementsByTagName('button');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].disabled = true;
		}
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].disabled = true;
		}
		var selects = document.getElementsByTagName('select');
		for (var j = 0; j < selects.length; j++) {
			selects[j].disabled = true;
		}
		var textareas = document.getElementsByTagName('textarea');
		for (var k = 0; k < textareas.length; k++) {
			textareas[k].disabled = true;
		}
	}
  
	render() {
		const { category } = this.props
	  return (
			<div style={style.fullSize}>
				{category && (
					<div className='ContentWrapper'>
						{!category.approved && (
							<Button
								size='large'
								variant='contained'
								color='primary'
								className='ApproveButton'
								onClick={this.props.onApprove}>
								Aprobár
							</Button>
						)}
						<div className='IframeContainer'>
							<iframe title='catalog-preview' style={style.iframe} src={category.term_link} />
						</div>
					</div>
				)}
			</div>
	  )
	}
}

export default Catalog