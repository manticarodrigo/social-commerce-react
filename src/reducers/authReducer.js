import {
  LOGIN_WITH_FACEBOOK
} from '../actions/types';

const initialState = {
  user: null,
  auth: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_WITH_FACEBOOK:
      return {
        ...state,
        user: action.payload.user,
        auth: action.payload.auth
      };
    default:
      return state;
  }
}