import axios from 'axios'
import {
	UPDATE_TITLE,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_ANALYTICS,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from './types';

export const updateTitle = title => dispatch => {
  dispatch({
    type: UPDATE_TITLE,
    payload: title
  });
};

export const fetchProducts = categoryId => dispatch => {
	console.log(categoryId)
	return dispatch => {
		const options = {
			auth: {
				username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
				password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
			}
		};
		axios.get(process.env.REACT_APP_BACKEND_URL + '/wp-json/wc/v2/products/?category=' + categoryId, options)
			.then(res => {
				console.log(res);
				const products = res.data;
				dispatch({
					type: FETCH_PRODUCTS,
					payload: products
				});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

// export const fetchProductsAnalytics = (productId, period) => dispatch => {
// 	// return axios.get(url + '/wp-json/ga/v1/product/' + productId + '?period=' + period);
// }

// export const createProduct = data => dispatch => {
// 	const id = {id: data.imageId, position: 0}
// 	const src = {src: data.imageUrl, position: 0}
// 	const product = {
// 		name: data.name,
// 		regular_price: data.cost,
// 		description: data.description,
// 		short_description: data.description,
// 		categories: [{id: data.category.id}],
// 		images: [data.imageId ? id : src],
// 		manage_stock: data.inventoryCount ? true : false,
// 		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
// 		in_stock: true,
// 	}
// 	const options = {
// 		auth: {
// 			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
// 			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
// 		}
// 	}
//   axios.post(url + '/wp-json/wc/v2/products/', product, options)
//     .then(res => {
//       console.log(res)
//       const products = res.data
//       dispatch({
//         type: CREATE_PRODUCT,
//         payload: products
//       })
//     })
//     .catch(err => {
//       console.log(err)
//     })
// };

// export function updateProduct(data) {
// 	const id = {id: data.imageId, position: 0}
// 	const src = {src: data.imageUrl, position: 0}
	
// 	const product = {
// 		name: data.name,
// 		regular_price: data.cost,
// 		description: data.description,
// 		short_description: data.description,
// 		categories: [{id: data.category.id}],
// 		images: [data.imageId ? id : src],
// 		manage_stock:  data.inventoryCount ? true : false,
// 		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
// 		in_stock: true,
// 	}
// 	const options = {
// 		auth: {
// 			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
// 			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
// 		}
// 	}
// 	return axios.put(url + '/wp-json/wc/v2/products/' + data.id, product, options)
// }

// export function deleteProduct(productId) {
// 	const options = {
// 		auth: {
// 			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
// 			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
// 		}
// 	}
// 	return axios.delete(url + '/wp-json/wc/v2/products/' + productId, options)
// }