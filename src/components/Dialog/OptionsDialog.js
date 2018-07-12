import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

class OptionsDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: props.options
    }
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleListItemClick = (value) => {
    this.setState({ open: false })
    this.props.onClose(value)
  }

  render() {
    const { options } = this.state
    return (
      <Dialog
        open={true}
        onClose={this.handleClose}
        aria-labelledby="options-dialog-title">
        <DialogTitle id="options-dialog-title">Suba Imagen</DialogTitle>
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
  onClose: PropTypes.func
}

export default OptionsDialog