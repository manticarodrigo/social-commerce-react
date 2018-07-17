import axios from 'axios'
import {
  FETCH_CATEGORIES,
  // CREATE_CATEGORY,
  // UPDATE_CATEGORY,
  // DELETE_CATEGORY
} from './types';

export const fetchCategories = (auth) => {
	const url = process.env.REACT_APP_BACKEND_URL;
	const ownerId = auth.wp_user_id;
	return (dispatch) => {
		return axios.get(`${url}/wp-json/wc/custom/products/categories/?owner_id=${ownerId}`)
			.then(res => {
				console.log(res);
				const categories= res.data;
				dispatch({
					type: FETCH_CATEGORIES,
					payload: categories
				});
			})
			.catch(err => {
				throw(err);
			});
	};
}

// export function createCategory(auth, data) {
// 	const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
// 	const category = {
// 		name: data.businessName,
// 		owner_id: auth.wp_user_id,
// 		image,
// 		dni: data.dni,
// 		ruc: data.ruc,
// 		phone: data.phone,
// 		bank_account: data.bankAccount,
// 		logistic_provider: data.logisticProvider
// 	}
// 	return axios.post(url + '/wp-json/wc/custom/products/categories/', category)
// }

// export function updateCategory(auth, data) {
// 	const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
// 	console.log(data)
// 	const category = {
// 		approved: data.approved,
// 		name: data.businessName,
// 		owner_id: auth.wp_user_id,
// 		image,
// 		dni: data.dni,
// 		ruc: data.ruc,
// 		phone: data.phone,
// 		bank_account: data.bankAccount ? data.bankAccount : '',
// 		logistic_provider: data.logisticProvider
// 	}
// 	return axios.put(`${url}/wp-json/wc/custom/products/categories/${data.id}`, category)
// }

// export function deleteCategory(categoryId) {
// 	return axios.delete(url + '/wp-json/wc/v2/products/categories/' + categoryId, { data: { force: true } })
// }