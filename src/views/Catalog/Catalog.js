import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import './Catalog.css';

import {
	updateTitle
} from '../../actions/navActions';
import {
  updateCategory
} from '../../actions/categoryActions';

const style = {
	fullSize: {
		width: '100%',
		height: '100%'
	},
}
class Catalog extends Component {
	constructor(props) {
		super(props)
		this.disableInputs()
	}

	disableInputs() {
		var buttons = document.getElementsByTagName('button');
		for (var h = 0; h < buttons.length; h++) {
			buttons[h].disabled = true;
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

	componentDidMount() {
		const { updateTitle } = this.props;
		updateTitle('Tu Tienda');
	}

	handleApprove = () => {
    const { history, auth, category, updateCategory } = this.props;
    category.approved = true;
    updateCategory(auth, category)
      .then(res => {
        console.log(res);
        history.replace('/');
      })
      .catch(err => {
        console.log(err);
      })
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
								onClick={this.handleApprove}>
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

const mapStateToProps = state => ({
	auth: state.auth.auth,
  category: state.categories.category
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
  updateCategory
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps, 
    mapDispatchToProps
  )(Catalog)
);