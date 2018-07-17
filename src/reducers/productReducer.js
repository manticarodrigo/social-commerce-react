import {
  UPDATE_TITLE,
  CREATE_PRODUCT,
  FETCH_PRODUCTS
} from '../actions/types';

const initialState = {
  title: '',
  products: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.payload
      };
    case FETCH_PRODUCTS:
      return {
        ...state,
        title: action.payload
      }
    case CREATE_PRODUCT:
      return {
        ...state,
        products: action.payload
      }
    default:
      return state;
  }
}