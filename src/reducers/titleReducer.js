import { UPDATE_TITLE } from '../actions/types';

const initialState = {
  title: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TITLE:
      return {
        ...state,
        title: action.payload
      };
    default:
      return state;
  }
}