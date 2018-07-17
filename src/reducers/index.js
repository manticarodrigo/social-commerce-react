import { combineReducers } from 'redux';
import titleReducer from './titleReducer';
import productReducer from './productReducer';

export default combineReducers({
  title: titleReducer,
  products: productReducer
});