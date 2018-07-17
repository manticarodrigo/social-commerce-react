import { combineReducers } from 'redux';
import authReducer from './authReducer';
import navReducer from './navReducer';
import categoryReducer from './categoryReducer';
import productReducer from './productReducer';

export default combineReducers({
  auth: authReducer,
  nav: navReducer,
  categories: categoryReducer,
  products: productReducer
});