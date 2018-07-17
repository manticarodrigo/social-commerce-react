import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ED7C35',
      contrastText: '#FFF'
    }
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById('root')
)
registerServiceWorker()
