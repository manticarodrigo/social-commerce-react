import React, { Component } from 'react'
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
import ShareIcon from '@material-ui/icons/Share'

import NavBar from '../../components/NavBar/NavBar'
import DeleteDialog from '../../components/Dialog/DeleteDialog'
import ShareDialog from '../../components/Dialog/ShareDialog'

const style = {
	avatar: {
		borderRadius: '0px',
		width: '60px',
		height: '60px',
	},
	img: {
		minWidth: '60px',
		width: '60px',
		height: '60px',
		objectFit: 'cover'
	},
	shareFab: {
		position: 'fixed',
		bottom: '1em',
		right: '4em'
	},
	addFab: {
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
			deleteDialog: null,
			shareDialog: null
		}
		this.handleShare = this.handleShare.bind(this)
		this.handleProductShare = this.handleProductShare.bind(this)
		this.handleProductDelete = this.handleProductDelete.bind(this)
		this.handleProductSelected = this.handleProductSelected.bind(this)
	}

	handleShare() {
		const { category } = this.props
		const shareDialog = (
			<ShareDialog
				category={category}
				onClose={() => this.setState({ shareDialog: null })}
				onConfirm={() => this.setState({ shareDialog: null })} />
		)
		this.setState({ shareDialog: shareDialog})
	}

	handleProductShare(product) {
		const shareDialog = (
			<ShareDialog
				product={product}
				onClose={() => this.setState({ shareDialog: null })}
				onConfirm={() => this.setState({ shareDialog: null })} />
		)
		this.setState({ shareDialog: shareDialog})
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
		const { dense, deleteDialog, shareDialog } = this.state
	  return (
			<div>
				{deleteDialog}
				{shareDialog}
				<NavBar
					category={category}
					title={category ? category.name : 'Tu Tienda'} />
				<div className='Content'>
					<List dense={dense}>
						{products && products.map(product => (
							<ListItem
								key={product.id}
								onClick={() => this.handleProductSelected(product)}>
								<ListItemAvatar>
									<Avatar style={style.avatar}>
										{product.images ? (
											<img style={style.img} src={product.images[0].src} alt={product.id} />
										) : (
											<CardGiftcard style={style.img} />
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
										aria-label='Share'
										onClick={() => this.handleProductShare(product)}>
										<ShareIcon />
									</IconButton>
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
						color='secondary'
						aria-label='add'
						style={style.shareFab}
						onClick={this.handleShare}>
						<ShareIcon />
					</Button>
					<Button
						variant='fab'
						color='primary'
						aria-label='add'
						style={style.addFab}
						onClick={this.props.onAdd}>
						<AddIcon />
					</Button>
				</div>
			</div>
	  )
	}
}

export default Dashboard