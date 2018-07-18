import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { updateTitle } from '../../actions/navActions';
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
			deleteCategoryOpen: false,
			deleteDialogOpen: false,
			shareDialogOpen: false,
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
    this.setState({ moreProduct: null });
	}
	
	handleShare = () => {
		this.setState({ shareDialogOpen: true });
	}

	handleProductShare = (product) => {
		this.setState({ shareDialogOpen: true });
	}

	handleProductDelete = (product) => {
		this.setState({ deleteDialogOpen: true});
	}

	finishProductDelete = (product) => {
		const { deleteProduct, fetchProducts, category } = this.props;
			deleteProduct(product.id)
				.then(() => {
					fetchProducts(category.id)
				})
	}

	handleProductSelected = (product) => {
		this.props.onSelect(product);
	}

	handleProductAnalytics = (product) => {
		this.props.onAnalytics(product);
	}

	finishCategoryDelete = (category) => {
    const { deleteCategory, changePage } = this.props;
    deleteCategory(category.id)
      .then(() => {
        this.setState({
          deleteCategoryOpen: false
        })
        changePage('/perfil');
      });
  }
  
	render() {
		const { category, updateTitle, products } = this.props;
		updateTitle(category ? category.name : 'Tu Tienda'); // move from render
		const { deleteCategoryOpen, deleteDialogOpen, shareDialogOpen, moreProduct } = this.state;
	  return (
			<div>
				{category && (
          <DeleteDialog
            open={deleteCategoryOpen}
            onClose={() => this.setState({ deleteCategoryOpen: false })}
            onConfirm={() => this.finishCategoryDelete(category)} />
        )}
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
				<ShareDialog
					open={shareDialogOpen}
					category={moreProduct ? null : category}
					product={moreProduct ? moreProduct.product : null}
					onClose={() => this.setState({ shareDialogOpen: false })}
					onConfirm={() => this.setState({ shareDialogOpen: false })} />
				<DeleteDialog
					open={deleteDialogOpen}
					product={moreProduct ? moreProduct.product : null}
					onClose={() => this.setState({ deleteDialogOpen: false })}
					onConfirm={() => this.finishProductDelete(moreProduct ? moreProduct.product : null)} />
			</div>
	  )
	}
}

const mapStateToProps = state => ({
	user: state.auth.user,
  auth: state.auth.auth,
  category: state.categories.category,
  products: state.products.products,
  currentProduct: state.products.currentProduct,
  nextProduct: state.products.nextProduct,
  pathname: state.nav.pathname
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changePage: (route) => push(route),
  updateTitle
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);