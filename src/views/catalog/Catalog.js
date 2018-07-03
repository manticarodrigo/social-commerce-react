import React, { Component } from 'react'

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
export class Catalog extends Component {
	// constructor(props) {
	// 	super(props)
	// }
	
	// shouldComponentUpdate() {
	// 	return false
	// }

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props(old) !== nextProps(new) {
	// 		// send message...
	// 	}
	// }
  
	render() {
		const { wpTermLink } = this.props
	  return (
			<div style={style.fullSize}>
				<iframe title='catalog-preview' style={style.iframe} src={wpTermLink} />
			</div>
	  )
	}
}