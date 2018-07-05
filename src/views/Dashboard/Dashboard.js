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
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import NavBar from '../../components/NavBar/NavBar'
import DeleteDialog from '../../components/Dialog/DeleteDialog'

const style = {
	avatar: {
		width: '60px',
		height: '60px',
		objectFit: 'cover'
	},
	fab: {
		position: 'fixed',
		bottom: '1em',
		right: '1em'
	}
}
class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dense: false,
			deleteDialog: null
		}

		this.handleProductAdd = this.handleProductAdd.bind(this)
		this.handleProductDelete = this.handleProductDelete.bind(this)
		this.handleProductSelected = this.handleProductSelected.bind(this)

		const { user, category, products } = this.props
		if (!user) {
			this.props.history.replace('/')
		} else if (!category) {
			this.props.history.replace('/tienda/crea')
		} else if (!products) {
			this.props.history.replace('/producto/crea')
		}
	}

	handleProductAdd() {
		this.props.history.replace('/producto/crea')
	}

	handleProductDelete(product) {
		const deleteDialog = (
			<DeleteDialog
				product={product}
				onClose={() => this.setState({ deleteDialog: null })}
				onConfirm={() => this.props.onDelete(product)} />
		)
		this.setState({ deleteDialog: deleteDialog})
	}

	handleProductSelected(product) {
		this.props.onSelect(product)
	}
  
	render() {
		const { category, products } = this.props
		const { dense, deleteDialog } = this.state
	  return (
			<div>
				{deleteDialog}
				<NavBar title={category ? 'Tienda ' + category.name : 'Tu Tienda'} />
				<div className='Content'>
					<List dense={dense}>
						{products && products.map(product => (
							<ListItem
								key={product.id}
								onClick={() => this.handleProductSelected(product)}>
								<ListItemAvatar>
									<Avatar style={style.avatar}>
										{product.images ? (
											<img style={style.avatar} src={product.images[0].src} alt={product.id} />
										) : (
											<CardGiftcard />
										)}
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
									<IconButton
									aria-label='Delete'
									onClick={() => this.handleProductDelete(product)}>
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
					<Button
						variant='fab'
						color='primary'
						aria-label='add'
						style={style.fab}
						onClick={this.handleProductAdd}>
						<AddIcon />
					</Button>
				</div>
			</div>
	  )
	}
}

export default withRouter(Dashboard)