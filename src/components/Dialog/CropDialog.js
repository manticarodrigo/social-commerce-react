import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './CropDialog.css'

class CropDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null,
      crop: null,
      loading: false
    }
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleImageLoaded = (image) => {
    const { aspect } = this.props
    var crop = null
    var pixelCrop = null
    if (aspect === '16/9') {
      crop = {
        x: 25,
        y: 50,
        aspect: 16 / 9,
        width: 50,
      }
      pixelCrop = {
        x: 0.25 * image.naturalWidth,
        y: 0.5 * image.naturalHeight,
        width: 0.5 * image.naturalWidth,
        height: 0.28125 * image.naturalHeight
      }
    } else {
      crop = {
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1,
      }
      pixelCrop = {
        x: 0.25 * image.naturalWidth,
        y: 0.25 * image.naturalHeight,
        width: 0.5 * image.naturalWidth,
        height: 0.5 * image.naturalHeight
      }
    }
    this.setState({
      image,
      crop: makeAspectCrop(crop, image.naturalWidth / image.naturalHeight),
      pixelCrop: pixelCrop
    })
  }

  handleCropComplete = (crop, pixelCrop) => {
    this.setState({ crop: crop, pixelCrop: pixelCrop })
  }

  handleCropChange = (crop) => {
    this.setState({ crop })
  }

  handleConfirm = () => {
    this.setState({ loading: true })
    const { image, crop, pixelCrop } = this.state
    console.log(crop)
    this.getCroppedImg(image, pixelCrop, Date.now())
      .then(res => {
        console.log(res)
        this.setState({ open: false, loading: false })
        this.props.onClose(res)
      })
      .catch(err => {
        console.log(err)
        this.setState({ open: false, loading: false })
        this.props.onClose()
      })
  }

  getCroppedImg = (image, pixelCrop, fileName) => {
    return new Promise((resolve, reject) => {
      // Create new image object
      var img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        // Paint in canvas for resize
        const canvas = document.createElement('canvas')
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        )

        // Convert to blob
        canvas.toBlob(blob => {
          const properties = { type: 'image/jpeg', lastModified: Date.now() }
          const file = new File([blob], fileName + '.jpeg', properties)
          resolve(file)
        }, 'image/jpeg')
        
      }
      // Set local image src from loaded image
      img.src = image.src
    })
  }

  render() {
    const { src } = this.props
    const { crop, loading } = this.state
    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
        aria-labelledby='crop-dialog-title'
        aria-describedby='crop-dialog-description'
      >
        <DialogTitle id='crop-dialog-title'>Recortar Imagen</DialogTitle>
        <DialogContent>
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.handleImageLoaded}
            onComplete={this.handleCropComplete}
            onChange={this.handleCropChange}/>
          {loading && (
            <div className='Loading'>
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

export default CropDialog