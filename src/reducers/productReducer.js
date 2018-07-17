import {
  FETCH_PRODUCTS,
  UPDATE_PRODUCT_LOCATIONS,
  RESET_PRODUCT_LOCATIONS,
  CREATE_PRODUCT
} from '../actions/types';

const initialState = {
  products: null,
  currentProduct: null,
  nextProduct: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        currentProduct: action.payload[0]
      };
    case UPDATE_PRODUCT_LOCATIONS:
      return {
        ...state,
        currentProduct: action.payload.currentProduct,
        nextProduct: action.payload.nextProduct
      };
    case RESET_PRODUCT_LOCATIONS:
      return {
        ...state,
        currentProduct: null,
        nextProduct: null
      };
    case CREATE_PRODUCT:
      return {
        ...state,
        products: state.products.push(action.payload)
      };
    default:
      return state;
  }
}