import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';

const OrderMenu = (props) => {
	const {
		open,
		anchorEl,
		order,
		onClose,
		onComplete,
		onCancel,
		onDelete
  } = props;
  return (
    <Menu
      id='order-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}>
      <MenuItem
        onClick={() => onComplete(order)}>
        <ListItemIcon>
          <CheckCircleIcon />
        </ListItemIcon>
        <ListItemText>
          Completar
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => onCancel(order)}>
        <ListItemIcon>
          <CancelIcon />
        </ListItemIcon>
        <ListItemText>
          Cancelar
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => onDelete(order)}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText>
          Eliminar
        </ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default OrderMenu;