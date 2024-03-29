import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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

import ProductMenu from '../../components/ProductMenu/ProductMenu';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';
import ShareDialog from '../../components/ShareDialog/ShareDialog';

import {
	updateTitle
} from '../../actions/navActions';
import {
	updateCurrentProduct,
  deleteProduct
} from '../../actions/productActions';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteDialogOpen: false,
			shareDialogOpen: false,
			moreProduct: null
		};
	}

	componentDidMount() {
		const { updateTitle, site } = this.props;
		updateTitle(site ? site.title : 'Tu Tienda');
	}

	componentDidUpdate(prevProps, prevState) {
		const { updateTitle, site } = this.props;
		updateTitle(site ? site.title : 'Tu Tienda');
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
    this.setState({ moreProduct: null });
	}
	
	handleShare = () => {
		this.setState({ shareDialogOpen: true });
	}

	handleAdd = () => {
		const { history, updateCurrentProduct } = this.props;
		updateCurrentProduct(null);
		history.replace('/producto');
	}

	handleProductShare = (product) => {
		this.setState({ shareDialogOpen: true });
	}

	handleProductDelete = (product) => {
		this.setState({ deleteDialogOpen: true});
	}

	finishProductDelete = (product) => {
		const { site, deleteProduct } = this.props;
		deleteProduct(site.path, product.id);
		this.setState({
			deleteDialogOpen: false,
			moreProduct: null
		});
	}

	handleProductSelected = (product) => {
    const { history, updateCurrentProduct } = this.props;
    updateCurrentProduct(product);
    history.replace('/producto');
  }

  handleProductAnalytics = (product) => {
    const { history, updateCurrentProduct } = this.props;
    updateCurrentProduct(product);
    history.replace('/producto/analisis');
  }
  
	render() {
		const { site, products } = this.props;
		const { deleteDialogOpen, shareDialogOpen, moreProduct } = this.state;
	  return (
			<div>
				<ProductMenu
					open={Boolean(moreProduct)}
					anchorEl={moreProduct ? moreProduct.anchorEl : null}
					product={moreProduct ? moreProduct.product : null}
					onShare={this.handleProductShare}
					onAnalytics={this.handleProductAnalytics}
					onDelete={this.handleProductDelete}
					onClose={this.handleMoreClose}
				/>
				<ShareDialog
					open={shareDialogOpen}
					site={moreProduct ? null : site}
					product={moreProduct ? moreProduct.product : null}
					onClose={() => this.setState({ shareDialogOpen: false })} />
				<DeleteDialog
					open={deleteDialogOpen}
					type={'Producto'}
					title={moreProduct ? moreProduct.product.name : null}
					onClose={() => this.setState({ deleteDialogOpen: false })}
					onConfirm={() => this.finishProductDelete(moreProduct ? moreProduct.product : null)} />
				<List dense={false}>
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
					onClick={this.handleAdd}>
					<AddIcon />
				</Button>
			</div>
	  )
	}
}

const mapStateToProps = state => ({
	user: state.auth.user,
  auth: state.auth.auth,
  site: state.site.site,
  products: state.products.products
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	updateCurrentProduct,
	deleteProduct
}, dispatch);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Dashboard)
);