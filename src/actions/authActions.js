import axios from 'axios'
import {
	LOGIN_WITH_FACEBOOK
} from './types';

const url = process.env.REACT_APP_BACKEND_URL;

export const facebookLogin = (response) => {
  return (dispatch) => {
    let base_url = `${url}/?json=user.fb_connect&access_token=${response.token.accessToken}`
    if (process.env.REACT_APP_ENV !== 'production') {
      base_url += '&insecure=cool'
    }
    return axios.get(base_url)
      .then(res => {
        console.log(res);
        if (res.data.cookie) {
          const auth = res.data;
          dispatch({
            type: LOGIN_WITH_FACEBOOK,
            payload: {
              user: response,
              auth: auth,
            }
          })
        } else {
          dispatch({
            type: LOGIN_WITH_FACEBOOK,
            payload: null
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
}