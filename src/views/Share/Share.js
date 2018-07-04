import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'

import './Share.css'

import {
	FacebookShareButton,
	FacebookIcon,
	TwitterShareButton,
	TwitterIcon,
	WhatsappShareButton,
	WhatsappIcon,
	EmailShareButton,
	EmailIcon
} from 'react-share'

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
class Share extends Component {
	constructor(props) {
		super(props)
		const { category } = this.props
		if (!category) this.props.history.replace('/')

		this.handleBack = this.handleBack.bind(this)
	}

	handleBack() {
		this.props.history.replace('/tienda')
	}

	toggleApproved() {
		this.setState({approved: !this.state.approved})
	}
  
	render() {
		const { category } = this.props
	  return (
			<div style={style.fullSize}>
				<NavBar
					title='Compartír Tienda'
					onBack={this.handleBack}/>
				{category && (
					<div className='ContentWrapper'>
						<div style={{textAlign: 'center'}}>
							<WhatsappShareButton
								url={category.term_link}
								title={'Tienda ' + category.term_name}
								children={<WhatsappIcon size={32} round={true} />} />
							<FacebookShareButton
								url={category.term_link}
								quote={'Tienda ' + category.term_name}
								hashtag={category.term_name}
								children={<FacebookIcon size={32} round={true} />} />
							<TwitterShareButton
								url={category.term_link}
								title={'Tienda ' + category.term_name}
								hashtags={[category.term_name]}
								children={<TwitterIcon size={32} round={true} />} />
							<EmailShareButton
								url={category.term_link}
								subject={'Tienda ' + category.term_name}
								body={'Conoce la tienda ' + category.term_name + ' visitando la pagina ' + + category.term_link}
								children={<EmailIcon size={32} round={true} />} />
						</div>
						<div className='IframeContainer'>
							<iframe title='catalog-preview' style={style.iframe} src={category.term_link} />
						</div>
					</div>
				)}
			</div>
	  )
	}
}

export default withRouter(Share)