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
    const { category, product } = this.props
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby='share-dialog-title'
        aria-describedby='share-dialog-description'
      >
        <DialogTitle id='share-dialog-title'>Comparte Tu {category ? 'Tienda' : product ? 'Producto' : null}</DialogTitle>
        <DialogContent>
          <DialogContentText id='share-dialog-description'>
            Selecciona una red en donde compartír {category ? category.name : product ? product.name : null}.
          </DialogContentText>
          <div style={style.socialButtonDiv}>
            <WhatsappShareButton
              style={style.socialButton}
              url={category ? category.term_link : product ? product.permalink : null}
              title={category ? 'Tienda ' + category.name : product ? 'Producto ' + product.name : null}
              children={<WhatsappIcon size={32} round={true} />} />
            <FacebookShareButton
              style={style.socialButton}
              url={category ? category.term_link : product ? product.permalink : null}
              quote={category ? 'Tienda ' + category.name : product ? 'Producto ' + product.name : null}
              hashtag={category ? category.term_name : product ? product.name : null}
              children={<FacebookIcon size={32} round={true} />} />
            <TwitterShareButton
              style={style.socialButton}
              url={category ? category.term_link : product ? product.permalink : null}
              title={category ? 'Tienda ' + category.name : product ? 'Producto ' + product.name : null}
              hashtags={[category ? category.term_name : product ? product.name : null]}
              children={<TwitterIcon size={32} round={true} />} />
            <EmailShareButton
              style={style.socialButton}
              url={category ? category.term_link : product ? product.permalink : null}
              subject={category ? 'Tienda ' + category.name : product? 'Producto ' + product.name : null}
              body={category ? 'Conoce la tienda ' + category.name + ' visitando la pagina ' + category.term_link : product ? 'Conoce el producto ' + product.name + ' visitando la pagina ' + product.permalink : null}
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