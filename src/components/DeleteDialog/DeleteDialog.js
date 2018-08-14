import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DeleteDialog = ({ onClose, onConfirm, open, type, title }) => {

  const handleClose = () => {
    onClose();
  }

  const handleConfirm = () => {
    onConfirm(true);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='delete-dialog-title'
      aria-describedby='delete-dialog-description'
    >
      <DialogTitle id='delete-dialog-title'>Elimina {type}</DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-dialog-description'>
          ¿Desea eliminar {title}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          No
        </Button>
        <Button onClick={handleConfirm} color='primary' autoFocus>
          Si
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog;