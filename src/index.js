import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ED7C35',
      contrastText: '#FFF'
    }
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
