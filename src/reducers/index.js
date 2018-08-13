import { combineReducers } from 'redux';
import authReducer from './authReducer';
import navReducer from './navReducer';
import siteReducer from './siteReducer';
import orderReducer from './orderReducer';
import categoryReducer from './categoryReducer';
import productReducer from './productReducer';

export default combineReducers({
  auth: authReducer,
  nav: navReducer,
  site: siteReducer,
  orders: orderReducer,
  categories: categoryReducer,
  products: productReducer
});