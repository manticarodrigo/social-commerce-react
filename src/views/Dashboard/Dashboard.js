import React, { Component } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Avatar from '@material-ui/core/Avatar'

import CardGiftcard from '@material-ui/icons/CardGiftcard'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import ShareIcon from '@material-ui/icons/Share'
import ShowChartIcon from '@material-ui/icons/ShowChart'

import './Dashboard.css'

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
			shareDialog: null,
			anchorEl: null
		}

		this.handleClick = this.handleClick.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.handleShare = this.handleShare.bind(this)
		this.handleProductShare = this.handleProductShare.bind(this)
		this.handleProductDelete = this.handleProductDelete.bind(this)
		this.handleProductSelected = this.handleProductSelected.bind(this)
		this.handleProductAnalytics = this.handleProductAnalytics.bind(this)
	}

	handleClick(event) {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose() {
    this.setState({ anchorEl: null })
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
				onConfirm={() => this.finishProductDelete(product)} />
		)
		this.setState({ deleteDialog: deleteDialog})
	}

	finishProductDelete(product) {
		this.setState({ deleteDialog: null })
		this.props.onDelete(product)
	}

	handleProductSelected(product) {
		this.props.onSelect(product)
	}

	handleProductAnalytics(product) {
		this.props.onAnalytics(product)
	}
  
	render() {
		const { products } = this.props
		const { dense, deleteDialog, shareDialog, anchorEl } = this.state
	  return (
			<div>
				{deleteDialog}
				{shareDialog}
				<List dense={dense}>
					{products && products.map(product => (
						<ListItem
							key={product.id}
							className='ProductCard'
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
								className='ProductInfo'
								primary={product.name}
								secondary={
									product.description
										.replace('<p>', '')
										.replace('</p>', '')
								}
							/>
							<ListItemSecondaryAction>
								<IconButton
									aria-label="More"
									aria-owns={anchorEl ? 'long-menu' : null}
									aria-haspopup="true"
									onClick={this.handleClick}
								>
									<MoreVertIcon />
								</IconButton>
								<Menu
									id="long-menu"
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={this.handleClose}
									PaperProps={{
										style: {
											width: 200,
										},
									}}
								>
									<MenuItem
										onClick={() => this.handleProductAnalytics(product)}>
										<ListItemIcon>
											<ShowChartIcon />
										</ListItemIcon>
										<ListItemText>
											Análisis
										</ListItemText>
									</MenuItem>
									<MenuItem
										onClick={() => this.handleProductShare(product)}>
										<ListItemIcon>
											<ShareIcon />
										</ListItemIcon>
										<ListItemText>
											Compartir
										</ListItemText>
									</MenuItem>
									<MenuItem
										onClick={() => this.handleProductDelete(product)}>
										<ListItemIcon>
											<DeleteIcon />
										</ListItemIcon>
										<ListItemText>
											Eliminar
										</ListItemText>
									</MenuItem>
								</Menu>
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
	  )
	}
}

export default Dashboard