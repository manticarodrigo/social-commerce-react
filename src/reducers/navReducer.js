import {
  UPDATE_TITLE,
  UPDATE_PATHNAME
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
    default:
      return state;
  }
}