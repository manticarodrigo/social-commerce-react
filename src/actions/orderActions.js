import axios from 'axios'
import {
  FETCH_ORDERS,
  UPDATE_ORDER,
  DELETE_ORDER
} from './types';

const url = process.env.REACT_APP_BACKEND_URL;
const options = {
	auth: {
		username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
		password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
	}
};

export const fetchOrders = (sitePath) => {
	return (dispatch) => {
		return axios.get(`${url + sitePath}wp-json/wc/v2/orders/`, options)
			.then(res => {
				console.log(res);
				const orders = res.data;
				dispatch({
					type: FETCH_ORDERS,
					payload: orders
				});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export const updateOrder = (sitePath, data) => {
	const order = {
		status: data.status
  }
  return (dispatch) => {
    return axios.put(`${url + sitePath}wp-json/wc/v2/orders/${data.id}`, order, options)
      .then(res => {
        console.log(res);
        const order = res.data;
        dispatch({
          type: UPDATE_ORDER,
          payload: order
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export const deleteOrder = (sitePath, orderId) => {
  return (dispatch) => {
    return axios.delete(`${url + sitePath}wp-json/wc/v2/orders/${orderId}`, options)
      .then(res => {
        console.log(res);
        const order = res.data;
        dispatch({
          type: DELETE_ORDER,
          payload: order
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}