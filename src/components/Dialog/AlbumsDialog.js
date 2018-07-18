import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'

import { getAlbums } from '../../services/Facebook'

class AlbumsDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      currentAlbums: [],
      searchInput: '',
      loading: true,
    }
    this.fetchFacebookAlbums()
  }

  fetchFacebookAlbums = () => {
    const { id, token } = this.props
    getAlbums(id, token)
    .then(res => {
      console.log(res)
      this.setState({ albums: res, currentAlbums: res, loading: false })
    }).catch( err => {
      console.log(err);
      this.setState({
        loading: false,
      });
    })
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleListItemClick = (value) => {
    this.props.onClose(value)
  }

  handleInputChange = (event) => {
	  const target = event.target
	  const value = target.type === 'checkbox' ? target.checked : target.value	
    const name = target.name
    const currentAlbums = this.state.albums
      .filter(album => {
        return album.name.toLowerCase().includes(value)
      })
	  this.setState({
      [name]: value,
      currentAlbums: currentAlbums
    })
	}

  render() {
    const { open } = this.props
    const { currentAlbums, searchInput, loading } = this.state
    
    let message = 'Cargando...'; 
    if (!loading && currentAlbums.length === 0) {
      message = 'Ups.. parece que no encontramos ningún album';
    }

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby='album-dialog-title'>
      <DialogTitle id="album-dialog-title">
        <TextField
          fullWidth
          margin='none'
          label='Busqueda de albums'
          name='searchInput'
          value={searchInput}
          type='search'
          onChange={this.handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }} />
        </DialogTitle>
          <div>
            {loading || currentAlbums.length === 0 ? 
              <div style={{padding: '1em'}}>{message}</div>
            : currentAlbums.map(album => (
              <GridList key={album.id} cellHeight={180}>
                <GridListTile key={album.id} cols={2} style={{height: 'auto'}}>
                  <ListSubheader component='div'>{album.name}</ListSubheader>
                </GridListTile>
                {album.photos && album.photos.data.map(img => (
                  <GridListTile key={img.id}>
                    <img
                      src={img.source}
                      alt={img.name != null ? img.name : img.source}
                      onClick={() => this.handleListItemClick(img.source)} />
                    <GridListTileBar
                      title={img.name != null ? img.name : 'Sin titulo'}
                      subtitle={<span>{album.name}</span>}
                    />
                  </GridListTile>
                ))}
              </GridList>
            ))}
          </div>
      </Dialog>
    )
  }
}
  
AlbumsDialog.propTypes = {
  onClose: PropTypes.func
}

export default AlbumsDialog