import { UPDATE_TITLE } from './types';

export const updateTitle = title => dispatch => {
  dispatch({
    type: UPDATE_TITLE,
    payload: title
  });
};