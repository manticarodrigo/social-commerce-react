import {
  UPDATE_TITLE,
  UPDATE_PATHNAME,
  UPDATE_PRODUCT_LOCATIONS
} from '../actions/types';

const initialState = {
  title: '',
  pathname: '/'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.payload
      };
    case UPDATE_PATHNAME:
      return {
        ...state,
        pathname: action.payload
      };
    case UPDATE_PRODUCT_LOCATIONS:
      return {
        ...state,
        currentProduct: action.payload.currentProduct,
        nextProduct: action.payload.nextProduct
      };
    default:
      return state;
  }
}