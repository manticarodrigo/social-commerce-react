import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './Dashboard.css';

import MoreMenu from '../../components/Menu/MoreMenu';
import DeleteDialog from '../../components/Dialog/DeleteDialog';
import ShareDialog from '../../components/Dialog/ShareDialog';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dense: false,
			deleteDialog: null,
			shareDialog: null,
			moreProduct: null
		};
	}

	handleMore = (event, product) => {
		const anchorEl = event.currentTarget;
		this.setState({
			moreProduct: {
				anchorEl: anchorEl,
				product: product
			}
		});
	}

	handleMoreClose = () => {
    this.setState({
			moreProduct: null
		});
  }

	handleShare = () => {
		const { category } = this.props;
		const shareDialog = (
			<ShareDialog
				category={category}
				onClose={() => this.setState({ shareDialog: null })}
				onConfirm={() => this.setState({ shareDialog: null })} />
		);
		this.setState({ shareDialog: shareDialog});
	}

	handleProductShare = (product) => {
		const shareDialog = (
			<ShareDialog
				product={product}
				onClose={() => this.setState({ shareDialog: null })}
				onConfirm={() => this.setState({ shareDialog: null })} />
		);
		this.setState({ shareDialog: shareDialog});
	}

	handleProductDelete = (product) => {
		const deleteDialog = (
			<DeleteDialog
				product={product}
				onClose={() => this.setState({ deleteDialog: null })}
				onConfirm={() => this.finishProductDelete(product)} />
		);
		this.setState({ deleteDialog: deleteDialog});
	}

	finishProductDelete = (product) => {
		this.setState({ deleteDialog: null });
		this.props.onDelete(product);
	}

	handleProductSelected = (product) => {
		this.props.onSelect(product);
	}

	handleProductAnalytics = (product) => {
		this.props.onAnalytics(product);
	}
  
	render() {
		const { products } = this.props;
		const { dense, deleteDialog, shareDialog, moreProduct } = this.state;
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
								<Avatar className='ProductAvatar'>
									{product.images ? (
										<img className='ProductImage' src={product.images[0].src} alt={product.id} />
									) : (
										<CardGiftcardIcon className='ProductImage' />
									)}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								className='ProductInfo'
								primary={product.name}
								secondary={
									product.description.replace(/<[^>]+>/g, '')
								}
							/>
							<ListItemSecondaryAction>
								<IconButton
									aria-label='More'
									aria-owns={moreProduct ? 'long-menu' : null}
									aria-haspopup='true'
									onClick={(event) => this.handleMore(event, product)}
								>
									<MoreVertIcon />
								</IconButton>
								<MoreMenu
									open={Boolean(moreProduct)}
									anchorEl={moreProduct ? moreProduct.anchorEl : null}
									product={moreProduct ? moreProduct.product : null}
									onShare={this.handleProductShare}
									onAnalytics={this.handleProductAnalytics}
									onDelete={this.handleProductDelete}
									onClose={this.handleMoreClose}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
				<Button
					variant='fab'
					color='secondary'
					aria-label='add'
					className='ShareFab'
					onClick={this.handleShare}>
					<ShareIcon />
				</Button>
				<Button
					variant='fab'
					color='primary'
					aria-label='add'
					className='AddFab'
					onClick={this.props.onAdd}>
					<AddIcon />
				</Button>
			</div>
	  )
	}
}

export default Dashboard;