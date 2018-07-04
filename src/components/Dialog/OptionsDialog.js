import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

class OptionsDialog extends Component {
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
    const { options } = this.state
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="options-dialog-title" {...other}>
        <DialogTitle id="options-dialog-title">Upload Image</DialogTitle>
        <div>
          <List>
            {options.map(option => (
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

OptionsDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
}

export default OptionsDialog