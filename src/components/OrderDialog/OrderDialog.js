import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const OrderDialog = ({ onClose, open, order }) => {

  const handleClose = () => {
    onClose();
  }

  if (order) {
    const date = new Date(order.date_created).toLocaleString();
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='order-dialog-title'
        aria-describedby='order-dialog-description'
      >
        <DialogTitle id='order-dialog-title'>Pedido #{order.number}</DialogTitle>
        <DialogContent style={{ fontSize: '0.75em' }}>
          <p>
          <strong>Pedido:</strong>
          <br />
          {order.total} {order.currency}
          <br />
          {order.payment_method_title}
          <br />
          Creado {date}
          </p>
          <p>
          <strong>Cliente:</strong>
          <br />
          {order.billing.first_name} {order.billing.last_name}
          <br />
          {order.billing.email}
          <br />
          {order.billing.address_1}
          <br />
          {order.billing.phone}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary' autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    )
  } else {
    return null
  }
}

export default OrderDialog;