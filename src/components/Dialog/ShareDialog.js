import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import {
	FacebookShareButton,
	FacebookIcon,
	TwitterShareButton,
	TwitterIcon,
	WhatsappShareButton,
	WhatsappIcon,
	EmailShareButton,
	EmailIcon
} from 'react-share'

const style = {
  socialButton: {
    display: 'inline-block',
    padding: '0.5em'
  },
  socialButtonDiv: {
    display: 'inline',
    textAlign: 'center',
  }
}

class ShareDialog extends React.Component {
  state = {
    open: true,
  }

  handleClose = () => {
    this.setState({ open: false })
    this.props.onClose()
  }

  handleConfirm = () => {
    this.setState({ open: false })
  }

  render() {
    const { category } = this.props
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby='share-dialog-title'
        aria-describedby='share-dialog-description'
      >
        <DialogTitle id='share-dialog-title'>Comparte Tu Tienda</DialogTitle>
        <DialogContent>
          <DialogContentText id='share-dialog-description'>
            Selecciona una red en donde compartír tu tienda.
          </DialogContentText>
          <div style={style.socialButtonDiv}>
            <WhatsappShareButton
              style={style.socialButton}
              url={category.term_link}
              title={'Tienda ' + category.name}
              children={<WhatsappIcon size={32} round={true} />} />
            <FacebookShareButton
              style={style.socialButton}
              url={category.term_link}
              quote={'Tienda ' + category.name}
              hashtag={category.term_name}
              children={<FacebookIcon size={32} round={true} />} />
            <TwitterShareButton
              style={style.socialButton}
              url={category.term_link}
              title={'Tienda ' + category.name}
              hashtags={[category.term_name]}
              children={<TwitterIcon size={32} round={true} />} />
            <EmailShareButton
              style={style.socialButton}
              url={category.term_link}
              subject={'Tienda ' + category.name}
              body={'Conoce la tienda ' + category.name + ' visitando la pagina ' + + category.term_link}
              children={<EmailIcon size={32} round={true} />} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleConfirm} color='primary' autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ShareDialog