import {
  FETCH_SITE,
  CREATE_SITE,
  UPDATE_SITE,
  DELETE_SITE
} from '../actions/types';

const initialState = {
  site: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_SITE:
      return {
        ...state,
        site: action.payload
      }
    case CREATE_SITE:
      return {
        ...state,
        site: action.payload
      }
    case UPDATE_SITE:
      return {
        ...state,
        site: action.payload
      }
    case DELETE_SITE:
      return {
        ...state,
        site: null
      }
    default:
      return state;
  }
}