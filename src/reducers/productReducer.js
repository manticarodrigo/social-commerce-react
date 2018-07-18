import {
  FETCH_PRODUCTS,
  FETCH_PRODUCT_ANALYTICS,
  UPDATE_PRODUCT_LOCATIONS,
  RESET_PRODUCT_LOCATIONS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from '../actions/types';

const initialState = {
  products: null,
  currentProduct: null,
  nextProduct: null,
  analytics: null
};

export default function(state = initialState, action) {
  var products = state.products;
  var index;
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        currentProduct: action.payload[0]
      };
    case FETCH_PRODUCT_ANALYTICS:
      return {
        ...state,
        analytics: action.payload
      }
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
      products.push(action.payload)
      return {
        ...state,
        products: products
      };
    case UPDATE_PRODUCT:
      index = (
        products
          .map(e => { return e.id })
          .indexOf(action.payload.id)
      );
      products[index] = action.payload;
      return {
        ...state,
        products: products
      };
      case DELETE_PRODUCT:
        index = (
          products
            .map(e => { return e.id })
            .indexOf(action.payload.id)
        );
        if (index > -1) {
          products.splice(index, 1);
        }
        return {
          ...state,
          products: products
        };
    default:
      return state;
  }
}