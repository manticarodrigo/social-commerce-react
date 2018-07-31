import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import WhatsappIcon from 'mdi-material-ui/Whatsapp.js';
import FacebookIcon from 'mdi-material-ui/Facebook';
import TwitterIcon from 'mdi-material-ui/Twitter';
import GooglePlusIcon from 'mdi-material-ui/GooglePlus';
import EmailIcon from 'mdi-material-ui/Email';

const style = {
  socialButtonList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'center'
  },
  socialButton: {
    display: 'inline-block',
    padding: '1em 0.5em 0 0',
  },
  socialButtonItem: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    borderRadius: '50%', 
    display: 'block',
    color: 'white'
  },
  svgItem: {
    padding: 8
  },
  whatsapp: {
    backgroundColor: '#07b556'
  },
  facebook: {
    backgroundColor: '#3f5fa3'
  },
  twitter: {
    backgroundColor: '#63b3ef'
  },
  google: {
    backgroundColor: '#ed3035'
  }
}

const ShareDialog = ({ open, product, site, onClose}) => {

  let obj = {
    'kind': '',
    'name': '',
    'subject': '',
    'url': '',
    'body': ''
  };
  if (product) {
    obj = {
      'kind': 'Producto',
      'name': product.name,
      'subject': `Compra ${product.name} en heyshopper.co`,
      'url': product.permalink,
      'body': `Compra el producto ${product.name} aquí: ${product.permalink}`
    }
  } else if (site) {
    obj = {
      'kind': 'Tienda',
      'name': site.title,
      'subject': `Visita mi Tienda ${site.title} | heyshopper.co`,
      'url': site.siteurl,
      'body': `Mira el catálogo de mi tienda ${site.title} aquí: ${site.siteurl}`
    }
  }

  const facebook_app_id = process.env.REACT_APP_FACEBOOK_APP_ID;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='share-dialog-title'
      aria-describedby='share-dialog-description'
    >
      <DialogTitle id='share-dialog-title'>Comparte {obj.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id='share-dialog-description'>
          Selecciona una red en donde compartír {obj.name}.
        </DialogContentText>
        <ul style={style.socialButtonList}>
          <li style={style.socialButton}>
              <a href={encodeURI(`whatsapp://send?text=${obj.body}`)}
                 style={{...style.socialButtonItem, ...style.whatsapp}} target='_blank' title='Compartir en WhatsApp'>
                  <WhatsappIcon style={style.svgItem} />
              </a>
          </li>
          <li style={style.socialButton}>
              <a href={encodeURI(`https://www.facebook.com/dialog/share?app_id=${facebook_app_id}&display=popup&href=${obj.url}&redirect_uri=${obj.url}`)}
                 style={{...style.socialButtonItem, ...style.facebook}} target='_blank' title='Compartir en Facebook'>
                  <FacebookIcon style={style.svgItem} />
              </a>
          </li>
          <li style={style.socialButton}>
              <a href={encodeURI(`https://twitter.com/share?text=${obj.subject}&url=${obj.url}&via=heyshopper`)}
                 style={{...style.socialButtonItem, ...style.twitter}} target='_blank' title='Compartir en Twitter'>
                  <TwitterIcon style={style.svgItem} />
              </a>
          </li>
          <li style={style.socialButton}>
              <a href={encodeURI(`https://plus.google.com/share?url=${obj.url}`)}
                 style={{...style.socialButtonItem, ...style.google}} target='_blank' title='Compartir en Google+'>
                  <GooglePlusIcon style={style.svgItem} />
              </a>
          </li>
          <li style={style.socialButton}>
              <a href={encodeURI(`mailto:?subject=${obj.subject}&body=${obj.body}`)}
                 style={style.socialButtonItem} title='Compartir en Google+'>
                  <EmailIcon style={style.svgItem} />
              </a>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareDialog