import {
  UPDATE_CURRENT_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_ANALYTICS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from '../actions/types';

const initialState = {
  products: [],
  currentProduct: null,
  analytics: null
};

export default function(state = initialState, action) {
  var products = JSON.parse(JSON.stringify(state.products));
  var index;
  switch (action.type) {
    case UPDATE_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload
      };
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