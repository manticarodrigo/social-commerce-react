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
import './Orders.css';

import OrderMenu from '../../components/OrderMenu/OrderMenu';
import DeleteDialog from '../../components/DeleteDialog/DeleteDialog';

import {
	updateTitle
} from '../../actions/navActions';
import {
	updateOrder,
  deleteOrder
} from '../../actions/orderActions';

const statusMap = {
	'pending': 'Pendiente...',
	'processing': 'Procesando...',
	'on-hold': 'En Espera...',
	'completed': 'Completado...',
	'cancelled': 'Cancelado...',
	'refunded': 'Reembolzado...',
	'failed': 'Fallado...'
}

class Orders extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteDialogOpen: false,
			moreOrder: null
		};
	}

	componentDidMount() {
		const { updateTitle } = this.props;
		updateTitle('Pedidos');
	}

	handleMore = (event, order) => {
		const anchorEl = event.currentTarget;
		this.setState({
			moreOrder: {
				anchorEl: anchorEl,
				order: order
			}
		});
	}

	handleMoreClose = () => {
    this.setState({ moreOrder: null });
	}

	handleOrderComplete = (order) => {
		const { site, updateOrder } = this.props;
		updateOrder(site.path, { id: order.id, status: 'completed' })
			.then(() => {
				this.setState({ moreOrder: null });
			});
	}

	handleOrderCancel = (order) => {
		const { site, updateOrder } = this.props;
		updateOrder(site.path, { id: order.id, status: 'cancelled' })
			.then(() => {
				this.setState({ moreOrder: null });
			});
	}

	handleOrderDelete = (order) => {
		// this.setState({ deleteDialogOpen: true});
		alert('Función aún no se ha implementado.')
	}

	finishOrderDelete = (order) => {
		const { site, deleteOrder } = this.props;
		deleteOrder(site.path, order.id);
		this.setState({
			deleteDialogOpen: false,
			moreOrder: null
		});
	}
  
	render() {
		const { site, orders } = this.props;
		const { deleteDialogOpen, moreOrder } = this.state;
	  return (
			<div>
				<OrderMenu
					open={Boolean(moreOrder)}
					anchorEl={moreOrder ? moreOrder.anchorEl : null}
					order={moreOrder ? moreOrder.order : null}
					onComplete={this.handleOrderComplete}
					onCancel={this.handleOrderCancel}
					onDelete={this.handleOrderDelete}
					onClose={this.handleMoreClose}
				/>
				<List dense={false}>
					{orders && orders.map(order => (
						<ListItem
							key={order.id}
							className='OrderCard'
							// onClick={() => this.handleOrderSelected(order)}
						>
							<ListItemAvatar>
								<Avatar className='OrderAvatar'>
									<div>
										#{order.number}
									</div>
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								className='OrderInfo'
								primary={`${order.billing.first_name} ${order.billing.last_name}`}
								secondary={statusMap[order.status]}
							/>
							<ListItemSecondaryAction>
								<IconButton
									aria-label='More'
									aria-owns={moreOrder ? 'long-menu' : null}
									aria-haspopup='true'
									onClick={(event) => this.handleMore(event, order)}
								>
									<MoreVertIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</div>
	  )
	}
}

const mapStateToProps = state => ({
	user: state.auth.user,
  auth: state.auth.auth,
  site: state.site.site,
  orders: state.orders.orders
});

const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	updateOrder,
	deleteOrder
}, dispatch);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Orders)
);