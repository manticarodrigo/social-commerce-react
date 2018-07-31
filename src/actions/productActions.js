import axios from 'axios'
import {
  UPDATE_CURRENT_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_ANALYTICS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from './types';

const url = process.env.REACT_APP_BACKEND_URL;
const options = {
	auth: {
		username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
		password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
	}
};

export const updateCurrentProduct = (currentProduct) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CURRENT_PRODUCT,
      payload: currentProduct
    });
  }
}

export const fetchProducts = (sitePath) => {
	return (dispatch) => {
		return axios.get(`${url + sitePath}wp-json/wc/v2/products/`, options)
			.then(res => {
				console.log(res);
				const products = res.data;
				dispatch({
					type: FETCH_PRODUCTS,
					payload: products
				});
			})
			.catch(err => {
				throw(err);
			});
	};
}

export const fetchProductAnalytics = (productId, period) => {
  return (dispatch) => {
		return axios.get(url + '/wp-json/ga/v1/product/' + productId + '?period=' + period)
			.then(res => {
				console.log(res);
				const analytics = res.data;
				dispatch({
					type: FETCH_PRODUCT_ANALYTICS,
					payload: analytics
				});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export const createProduct = (sitePath, data) => {
	const id = { id: data.imageId, position: 0 };
	const src = { src: data.imageUrl, position: 0 };
	const product = {
		name: data.name,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		// categories: [{id: data.category.id}],
		images: [data.imageId ? id : src],
		manage_stock: data.inventoryCount ? true : false,
		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
		in_stock: true,
  };
  return (dispatch) => {
		return axios.post(`${url + sitePath}wp-json/wc/v2/products/`, product, options)
      .then(res => {
        console.log(res);
        const product = res.data;
        dispatch({
          type: CREATE_PRODUCT,
          payload: product
        });
      })
      .catch(err => {
        console.log(err);
      });
	};
};

export const updateProduct = (sitePath, data) => {
	const id = {id: data.imageId, position: 0}
	const src = {src: data.imageUrl, position: 0}
	const product = {
		name: data.name,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		// categories: [{id: data.category.id}],
		images: [data.imageId ? id : src],
		manage_stock:  data.inventoryCount ? true : false,
		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
		in_stock: true,
  }
  return (dispatch) => {
    return axios.put(`${url + sitePath}wp-json/wc/v2/products/${data.id}`, product, options)
      .then(res => {
        console.log(res);
        const product = res.data;
        dispatch({
          type: UPDATE_PRODUCT,
          payload: product
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export const deleteProduct = (sitePath, productId) => {
  return (dispatch) => {
    return axios.delete(`${url + sitePath}wp-json/wc/v2/products/${productId}`, options)
      .then(res => {
        console.log(res);
        const product = res.data;
        dispatch({
          type: DELETE_PRODUCT,
          payload: product
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}