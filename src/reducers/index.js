import { combineReducers } from 'redux';
import navReducer from './navReducer';
import categoryReducer from './categoryReducer';
import productReducer from './productReducer';

export default combineReducers({
  nav: navReducer,
  categories: categoryReducer,
  products: productReducer
});