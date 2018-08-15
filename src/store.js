import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// Raven for Sentry error tracking
import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  createRavenMiddleware(Raven, {})
];

if (process.env.REACT_APP_ENV === 'local') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

export default store;