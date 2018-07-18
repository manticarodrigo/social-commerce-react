import axios from 'axios'

const url = process.env.REACT_APP_BACKEND_URL


// export function updateUser(auth, data) {
// 	const user = {
// 		name: data.name,
// 		email: data.email,
// 		meta: {
// 			phone: data.phone,
// 			dni: data.dni,
// 			ruc: data.ruc,
// 			bankAccount: data.bankAccount,
// 			logisticProvider: data.logisticProvider
// 		}
// 	}
// 	return axios.post(url + '/wp-json/wp/v2/users/' + auth.wp_user_id, user)
// }

export function uploadMedia(file) {
	const stamp = Date.now()
	var formData = new FormData()
	formData.append('file', file)
	formData.append('title', stamp)
	formData.append('caption', 'test')

	return axios.post(url + '/wp-json/wp/v2/media', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
};