import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import ShowChartIcon from '@material-ui/icons/ShowChart';

const MoreMenu = (props) => {
	const {
		open,
		anchorEl,
		product,
		onClose,
		onShare,
		onAnalytics,
		onDelete
	} = props
  return (
    <Menu
      id='long-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}>
      <MenuItem
        onClick={() => onShare(product)}>
        <ListItemIcon>
          <ShareIcon />
        </ListItemIcon>
        <ListItemText>
          Compartír
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => onAnalytics(product)}>
        <ListItemIcon>
          <ShowChartIcon />
        </ListItemIcon>
        <ListItemText>
          Análisis
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => onDelete(product)}>
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

export default MoreMenu;