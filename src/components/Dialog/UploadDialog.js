import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class UploadDialog extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    options: this.props.options
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = value => {
    this.props.onClose(value)
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="upload-dialog-title" {...other}>
        <DialogTitle id="upload-dialog-title">Upload Image</DialogTitle>
        <div>
          <List>
            {this.state.options.map(option => (
              <ListItem button onClick={() => this.handleListItemClick(option)} key={option}>
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}

UploadDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
}

export default UploadDialog