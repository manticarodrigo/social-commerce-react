import React, { Component } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import Button from '@material-ui/core/Button'

import './Catalog.css'

const style = {
	fullSize: {
		width: '100%',
		height: '100%'
	},
	iframe: {
		width: '100%',
		height: '100%',
		border: 'none'
	}
}
class Catalog extends Component {
	constructor(props) {
		super(props)
		const { category } = this.props
		if (!category) this.props.onBack()
		this.handleBack = this.handleBack.bind(this)
		this.handleApprove = this.handleApprove.bind(this)
	}

	handleBack() {
		this.props.onBack()
	}

	handleApprove() {
		const { approved } = this.state
		this.setState({ approved: !approved })
	}
  
	render() {
		const { category } = this.props
	  return (
			<div style={style.fullSize}>
				<NavBar
					title='Tu Tienda'
					onBack={this.handleBack}/>
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

export default Catalog