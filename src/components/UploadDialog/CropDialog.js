import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CropIcon from '@material-ui/icons/Crop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropDialog.css';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
    fontSize: '1.2em'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 0,
  },
};

class CropDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      crop: null,
      loading: false
    };
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleImageLoaded = (image) => {
    const { aspect } = this.props;
    var crop = null;
    var pixelCrop = null;
    if (aspect === '16/9') {
      crop = {
        x: 25,
        y: 50,
        aspect: 16 / 9,
        width: 50,
      };
      pixelCrop = {
        x: 0.25 * image.naturalWidth,
        y: 0.5 * image.naturalHeight,
        width: 0.5 * image.naturalWidth,
        height: 0.28125 * image.naturalHeight
      };
    } else {
      crop = {
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1,
      };
      pixelCrop = {
        x: 0.25 * image.naturalWidth,
        y: 0.25 * image.naturalHeight,
        width: 0.5 * image.naturalWidth,
        height: 0.5 * image.naturalHeight
      };
    }
    this.setState({
      image,
      crop: makeAspectCrop(crop, image.naturalWidth / image.naturalHeight),
      pixelCrop: pixelCrop
    });
  }

  handleCropComplete = (crop, pixelCrop) => {
    this.setState({ crop: crop, pixelCrop: pixelCrop });
  }

  handleCropChange = (crop) => {
    this.setState({ crop });
  }

  handleConfirm = () => {
    this.setState({ loading: true });
    const { image, pixelCrop } = this.state;
    this.getCroppedImg(image, pixelCrop, Date.now())
      .then(res => {
        this.setState({ open: false, loading: false })
        this.props.onClose(res)
      })
      .catch(err => {
        console.log(err)
        this.setState({ open: false, loading: false })
        this.props.onClose()
      });
  }

  getCroppedImg = (image, pixelCrop, fileName) => {
    return new Promise((resolve, reject) => {
      // Paint in canvas for resize
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      // Apply any resizes here
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      // Convert to blob
      canvas.toBlob(blob => {
        const properties = { type: 'image/jpeg', lastModified: Date.now() }
        const file = new File([blob], fileName + '.jpeg', properties)
        resolve(file)
      }, 'image/jpeg');
    });
  }

  render() {
    const { classes, open, src } = this.props;
    const { crop, loading } = this.state;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={this.handleClose}
        aria-labelledby='crop-dialog-title'
        aria-describedby='crop-dialog-description'
      >
        <AppBar position='fixed'>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color='inherit'
              aria-label='Close'
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='title' color='inherit' className={classes.flex}>
              Recortar Imagen
            </Typography>
            <IconButton
              className={classes.menuButton}
              color='inherit'
              aria-label='Crop'
              onClick={this.handleConfirm}
            >
              <CropIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent style={{ paddingTop: '5em' }}>
          <DialogContentText id='delete-dialog-description'>
            Arrastra el selector para recortar tu imagen a tu gusto.
          </DialogContentText>
          <br />
          {src && (
            <ReactCrop
              crossorigin={'anonymous'}
              src={src}
              crop={crop}
              onImageLoaded={this.handleImageLoaded}
              onComplete={this.handleCropComplete}
              onChange={this.handleCropChange}/>
          )}
          {loading && (
            <div className='CropLoading'>
              <CircularProgress size={50} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary'>
            Cancelar
          </Button>
          <Button onClick={this.handleConfirm} color='primary' autoFocus>
            Recortar
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(CropDialog);