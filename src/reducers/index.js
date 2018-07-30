import { combineReducers } from 'redux';
import authReducer from './authReducer';
import navReducer from './navReducer';
import categoryReducer from './categoryReducer';
import productReducer from './productReducer';
import siteReducer from './siteReducer';

export default combineReducers({
  auth: authReducer,
  nav: navReducer,
  categories: categoryReducer,
  products: productReducer,
  site: siteReducer
});