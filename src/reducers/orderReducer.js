import {
  FETCH_ORDERS,
  UPDATE_ORDER,
  DELETE_ORDER
} from '../actions/types';

const initialState = {
  orders: []
};

export default function(state = initialState, action) {
  var orders = JSON.parse(JSON.stringify(state.orders));
  var index;
  switch (action.type) {
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    case UPDATE_ORDER:
      index = (
        orders
          .map(e => { return e.id })
          .indexOf(action.payload.id)
      );
      orders[index] = action.payload;
      return {
        ...state,
        orders: orders
      };
      case DELETE_ORDER:
        index = (
          orders
            .map(e => { return e.id })
            .indexOf(action.payload.id)
        );
        if (index > -1) {
          orders.splice(index, 1);
        }
        return {
          ...state,
          orders: orders
        };
    default:
      return state;
  }
}