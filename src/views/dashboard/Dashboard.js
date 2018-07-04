import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

import NavBar from '../../components/NavBar/NavBar'

const style = {
	
}

function generate(element) {
	return [0, 1, 2].map(value =>
		React.cloneElement(element, {
			key: value,
		}),
	);
}

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dense: false,
			secondary: false,
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
		const { classes, user, category, products } = this.props
		const { dense, secondary } = this.state
	  return (
			<div>
				<NavBar title='Tu Tienda' />
				<div className='Content'>
					<List dense={dense}>
						{generate(
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<FolderIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Single-line item"
									secondary={secondary ? 'Secondary text' : null}
								/>
								<ListItemSecondaryAction>
									<IconButton aria-label="Delete">
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						)}
					</List>
				</div>
			</div>
	  )
	}
}

export default withRouter(Dashboard)