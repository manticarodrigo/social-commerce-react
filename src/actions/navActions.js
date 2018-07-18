import { UPDATE_TITLE, UPDATE_PATHNAME } from './types';

export const updateTitle = title => dispatch => {
  dispatch({
    type: UPDATE_TITLE,
    payload: title
  });
};

export const updatePathname = pathname => dispatch => {
  dispatch({
    type: UPDATE_PATHNAME,
    payload: pathname
  })
}