import {
  FETCH_CATEGORIES
} from '../actions/types';

const initialState = {
  categories: [],
  category: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        category: action.payload.length > 0 ? action.payload[0] : null
      }
    default:
      return state;
  }
}