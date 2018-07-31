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
		user_dni: data.userDni,
		user_cellphone: data.userPhone,
		title: data.title,
		site_name: data.title.toLowerCase(),
		ruc: data.ruc
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
		user_dni: data.userDni,
		user_cellphone: data.userPhone,
		approved: data.approved,
		title: data.title,
		ruc: data.ruc,
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

export const deleteCategory = (siteId) => {
	return (dispatch) => {
		return axios.delete(`${url}/wp-json/multisite/v1/sites/${siteId}`, { data: { force: true } })
			.then(res => {
				console.log(res);
				const site = res.data;
				dispatch({
					type: DELETE_SITE,
					payload: site
				});
			})
			.catch(err => {
				console.log(err);
			});
	}
}