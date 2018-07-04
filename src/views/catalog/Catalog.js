import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import NavBar from '../../components/NavBar/NavBar'

import './Catalog.css'

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
class Catalog extends Component {
	constructor(props) {
		super(props)
		const { category } = this.props
		if (!category) this.props.history.replace('/')
		this.state = {
			approved: false
		}
	}
	
	// shouldComponentUpdate() {
	// 	return false
	// }

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props(old) !== nextProps(new) {
	// 		// send message...
	// 	}
	// }

	toggleApproved() {
		this.setState({approved: !this.state.approved})
	}
  
	render() {
		const { category } = this.props
		const { approved } = this.state
	  return (
			<div style={style.fullSize}>
				<NavBar title='Tu Catálogo' />
				<Button
					size='large'
					variant='contained'
					color='primary'
					style={{display: approved ? 'none' : 'block'}}
					className={'ApproveButton'}
					onClick={this.toggleApproved.bind(this)}>
					Aprobár
				</Button>
				{approved && (
					<div style={{textAlign: 'center'}}>
						<br />Compartír Catálogo<br />
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
				)}
				{category && (
					<div className='IframeContainer'>
						<iframe title='catalog-preview' style={style.iframe} src={category.term_link} />
					</div>
				)}
			</div>
	  )
	}
}

export default withRouter(Catalog)