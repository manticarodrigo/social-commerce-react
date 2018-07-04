import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import CardGiftcard from '@material-ui/icons/CardGiftcard'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import NavBar from '../../components/NavBar/NavBar'

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dense: false,
		}
		const { user, category, products } = this.props
		if (!user) {
			this.props.history.replace('/login')
		} else if (!category) {
			this.props.history.replace('/category/new')
		} else if (!products) {
			this.props.history.replace('/product/new')
		}
	}
  
	render() {
		const { user, category, products } = this.props
		const { dense } = this.state
	  return (
			<div>
				<NavBar title={category ? 'Tienda ' + category.name : 'Tu Tienda'} />
				<div className='Content'>
					<List dense={dense}>
						{products && products.map(product => (
							<ListItem key={product.id}>
								<ListItemAvatar>
									<Avatar>
										<CardGiftcard />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={product.name}
									secondary={
										product.description
											.replace('<p>', '')
											.replace('</p>', '')
									}
								/>
								<ListItemSecondaryAction>
									<IconButton aria-label="Delete">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</div>
			</div>
	  )
	}
}

export default withRouter(Dashboard)