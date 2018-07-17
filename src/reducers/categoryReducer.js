import {
  FETCH_CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY
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
        category: action.payload[0] ? action.payload[0] : null
      }
    case CREATE_CATEGORY:
      return {
        ...state,
        category: action.payload
      }
    case UPDATE_CATEGORY:
      return {
        ...state,
        category: action.payload
      }
    case DELETE_CATEGORY:
      return {
        ...state,
        category: null
      }
    default:
      return state;
  }
}