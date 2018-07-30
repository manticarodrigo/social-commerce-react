import axios from 'axios'
import {
  FETCH_SITE,
  CREATE_SITE,
  UPDATE_SITE,
  DELETE_SITE
} from './types';

const url = process.env.REACT_APP_BACKEND_URL;

export const fetchSite = (auth) => {
	const user_id = auth.wp_user_id;
	return (dispatch) => {
		return axios.get(`${url}/wp-json/multisite/v1/sites/?user_id=${user_id}`)
			.then(res => {
				console.log(res);
				var site = null;
				if (res.data[1]) site = res.data[1];
				dispatch({
					type: FETCH_SITE,
					payload: site
				});
			})
			.catch(err => {
				throw(err);
			});
	};
}

export const createSite = (auth, data) => {
	// const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
	const site = {
		user_id: auth.wp_user_id,
		title: data.businessName,
		site_name: data.businessName.toLowerCase(),
		ruc: data.ruc,
		user_dni: data.dni,
		user_cellphone: data.phone
	}
	return (dispatch) => {
		return axios.post(`${url}/wp-json/multisite/v1/sites/`, site)
			.then(res => {
				console.log(res);
				const site = res.data;
				dispatch({
					type: CREATE_SITE,
					payload: site
				});
			})
			.catch(err => {
				throw(err);
			});
	}
}

export const updateSite = (auth, data) => {
	// const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
	const site = {
		id: data.id,
		user_id: auth.wp_user_id,
		approved: data.approved,
		title: data.businessName,
		ruc: data.ruc,
		user_dni: data.dni,
		user_cellphone: data.phone,
		bank_account: data.bankAccount,
		logistic_provider: data.logisticProvider
	}
	return (dispatch) => {
		return axios.put(`${url}/wp-json/multisite/v1/sites/${data.id}`, site)
			.then(res => {
				console.log(res);
				const site = res.data;
				dispatch({
					type: UPDATE_SITE,
					payload: site
				});
			})
			.catch(err => {
				throw(err);
			});
	}
}

// export const deleteCategory = (categoryId) => {
// 	return (dispatch) => {
// 		return axios.delete(url + '/wp-json/wc/v2/products/categories/' + categoryId, { data: { force: true } })
// 			.then(res => {
// 				console.log(res);
// 				const category = res.data;
// 				dispatch({
// 					type: DELETE_CATEGORY,
// 					payload: category
// 				});
// 			})
// 			.catch(err => {
// 				console.log(err);
// 			});
// 	}
// }