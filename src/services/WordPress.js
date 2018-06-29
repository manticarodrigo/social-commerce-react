import axios from 'axios'

const url = 'http://localhost:8080'

export function facebookLogin(accessToken) {
	return axios.get(url + '/?json=user.fb_connect&access_token=' + accessToken + '&insecure=cool')
}

export function createCategory(profile) {
	const data = {
		name: profile.businessName,
		image: {
			src: profile.businessLogo
		}
	}
	const options = {
		auth: {
			username: 'ck_f684a0eb45fa52beb1f04769592af6d8d536b306',
			password: 'cs_5497e0d935de4b2fb31de3d0f13ca420a24ced7e'
		}
	}
	return axios.post(url + '/wp-json/wc/v2/products/categories/', data, options)
}

export function updateUser(auth, profile) {
	console.log(profile)
	const data = {
		name: profile.name,
		email: profile.email,
		meta: {
			phone: profile.phone,
			dni: profile.dni,
			ruc: profile.ruc,
			bankAccount: profile.bankAccount,
			logisticProvider: profile.logisticProvider
		}
	}
	return axios.post(url + '/wp-json/wp/v2/users/' + auth.wp_user_id, data)
}

export function updateUserMeta(auth, profile) {
	const endpoint = ('/?json=user.update_user_meta_vars/?cookie='+ auth.cookie
										+ '&phone=' + profile.phone
										+ '&dni=' + profile.dni
										+ '&ruc=' + profile.ruc
										+ '&bankAccount=' + profile.bankAccount
										+ '&logisticProvider=' + profile.logisticProvider
									)
	return axios.get(url + endpoint+ '?insecure=cool')
}

export function createProduct(profile) {
	const data = {
		name: profile.title,
		regular_price: profile.cost,
		description: profile.description,
		short_description: profile.description,
		categories: [{id: 15}],
		images: [{src: profile.imageUrl, position: 0}],
		manage_stock: true,
		stock_quantity: profile.inventoryCount,
		in_stock: true,
	}
	console.log(data)
	const options = {
		auth: {
			username: 'ck_f684a0eb45fa52beb1f04769592af6d8d536b306',
			password: 'cs_5497e0d935de4b2fb31de3d0f13ca420a24ced7e'
		}
	}
	return axios.post(url + '/wp-json/wc/v2/products/', data, options)
}

export function uploadMedia(file) {
	const stamp = Date.now()
	var formData = new FormData()
	formData.append( 'file', file )
	formData.append( 'title', stamp )

	return axios({
    method: 'post',
    url: url + '/wp-json/wp/v2/media',
    data: formData,
    config: { headers: {'Content-Type': 'multipart/form-data' }}
	})
}