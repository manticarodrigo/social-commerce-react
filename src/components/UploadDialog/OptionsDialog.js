import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const OptionsDialog = ({ onClose, open, options }) => {

  const handleClose = () => {
    onClose();
  }

  const handleListItemClick = (value) => {
    onClose(value);
  }
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="options-dialog-title">
      <DialogTitle id="options-dialog-title">Suba Imagen</DialogTitle>
      <div>
        <List>
          {options.map(option => (
            <ListItem button onClick={() => handleListItemClick(option)} key={option}>
              <ListItemText primary={option} />
            </ListItem>
          ))}
        </List>
      </div>
    </Dialog>
  )
}

OptionsDialog.propTypes = {
  onClose: PropTypes.func
}

export default OptionsDialog