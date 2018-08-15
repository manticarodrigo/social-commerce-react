// React
import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Raven
import Raven from "raven-js";
// Material UI Core
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
// Material UI Icons
import LaunchIcon from '@material-ui/icons/Launch';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreIcon from '@material-ui/icons/Store';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DeleteIcon from '@material-ui/icons/Delete';
import PowerOffIcon from '@material-ui/icons/Power';
// Components
import DeleteDialog from '../DeleteDialog/DeleteDialog';
// Actions
import {
  deleteSite
} from '../../actions/siteActions';
import {
  fetchOrders
} from '../../actions/orderActions';
import {
  updateCurrentProduct,
  updateProducts
} from '../../actions/productActions';

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDialogOpen: false,
    };
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleEditSite = () => {
    this.handleClose();
    this.props.history.replace('/perfil');
  }

  handleManageOrders = () => {
    const { site, fetchOrders } = this.props;
    fetchOrders(site.path);
    this.handleClose();
    this.props.history.replace('/pedidos');
  }

  handleEditPayments = () => {
    this.handleClose();
    this.props.history.replace('/pagos');
  }

  handleEditShipping = () => {
    this.handleClose();
    this.props.history.replace('/envios');
  }

  handleDeleteSite = () => {
    this.setState({ deleteDialogOpen: true });
  }

  finishSiteDelete = (site) => {
    const { history, deleteSite, updateProducts } = this.props;
    deleteSite(site.blog_id)
      .then(() => {
        updateCurrentProduct(null);
        updateProducts([]);
        this.setState({ deleteDialogOpen: false });
        history.replace('/perfil');
      })
      .catch(err => {
        console.log(err.response.data.message);
        Raven.captureException(JSON.stringify(err));
        alert(err.response.data.message);
      });
  }

  handleLogout = () => {
    this.handleClose();
    localStorage.clear();
    this.props.history.replace('/ingresar');
  }

  render() {
    const { open, onClose, site } = this.props;
    const { deleteDialogOpen  } = this.state;
    return (
      <div>
        <DeleteDialog
          open={deleteDialogOpen}
          type='Sitio'
					title={site ? site.title : null}
					onClose={() => this.setState({ deleteDialogOpen: false })}
					onConfirm={() => this.finishSiteDelete(site)} />
        <Drawer
          anchor='right'
          open={open}
          onClose={onClose}>
          <div>
            {(site && site.public) && (
              <List>
                <ListItem
                  button
                  component='a'
                  href={site && site.siteurl}
                  target='_blank'
                >
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Ver Tienda'} />
                </ListItem>
                <ListItem button onClick={this.handleManageOrders}>
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Manejar Pedidos'} />
                </ListItem>
                <ListItem button onClick={this.handleEditSite}>
                  <ListItemIcon>
                    <StoreIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Tienda'} />
                </ListItem>
                <ListItem button onClick={this.handleEditPayments}>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Pagos'} />
                </ListItem>
                <ListItem button onClick={this.handleEditShipping}>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Editar Envios'} />
                </ListItem>
                <ListItem button onClick={this.handleDeleteSite}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Eliminár Tienda'} />
                </ListItem>
              </List>
            )}
            <Divider />
            <List>
              <ListItem onClick={this.handleLogout}>
                  <ListItemIcon>
                    <PowerOffIcon />
                  </ListItemIcon>
                <ListItemText primary={'Cerrar sesión'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  site: state.site.site,
  products: state.products.products,
  currentProduct: state.products.currentProduct
});

const mapDispatchToProps = dispatch => bindActionCreators({
  deleteSite,
  fetchOrders,
  updateCurrentProduct,
  updateProducts
}, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DrawerMenu)
);