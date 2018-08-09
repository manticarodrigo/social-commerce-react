import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const TermsDialog = ({ open, onClose }) => {

  const handleClose = () => {
    onClose()
  }

  const handleConfirm = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='terms-dialog-title'
      aria-describedby='terms-dialog-description'
    >
      <DialogTitle id='terms-dialog-title'>Terminos y Condiciones</DialogTitle>
      <DialogContent>
        <DialogContentText id='terms-dialog-description'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color='primary' autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsDialog