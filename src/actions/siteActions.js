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
				let site = null;
				if (res.data[1]) site = res.data[1];
				dispatch({
					type: FETCH_SITE,
					payload: site
				});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export const createSite = (auth, data) => (dispatch) => {
	const site = {
		user_id: auth.wp_user_id,
		user_dni: data.userDni,
		user_cellphone: data.userPhone,
		title: data.title,
		site_name: data.title.toLowerCase().replace(/\s+/g, ''),
		ruc: data.ruc
	}
	return new Promise((resolve, reject) => {
		axios.post(`${url}/wp-json/multisite/v1/sites/`, site)
			.then(res => {
				console.log(res);
				const site = res.data;
				dispatch({
					type: CREATE_SITE,
					payload: site
				});
				resolve(site);
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
	});
}

export const updateSite = (auth, data) => {
	const site = {
		user_id: auth.wp_user_id,
		user_dni: data.userDni,
		user_cellphone: data.userPhone,
		banner_id: data.bannerId,
		title: data.title,
		site_name: data.title.toLowerCase().replace(/\s+/g, ''),
		ruc: data.ruc,
		bank_account: data.bankAccount,
		public: data.public,
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
				console.log(err);
			});
	}
}

export const deleteSite = (siteId) => {
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