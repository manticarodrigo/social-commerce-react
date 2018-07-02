import axios from 'axios'

const url = 'http://localhost:8080'

export function facebookLogin(accessToken) {
	return axios.get(url + '/?json=user.fb_connect&access_token=' + accessToken + '&insecure=cool')
}

export function createCategory(auth, profile) {
	const data = {
		ownerId: auth.wp_user_id,
		businessName: profile.businessName,
		businessLogo: profile.businessLogo,
		dni: profile.dni,
		ruc: profile.ruc,
		phone: profile.phone,
		bankAccount: profile.bankAccount,
		logisticProvider: profile.logisticProvider
	}
	return axios.post(url + '/wp-json/socialcommerce/v1/profiles/create/', data)
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

export function createProduct(product) {
	const data = {
		name: product.title,
		regular_price: product.cost,
		description: product.description,
		short_description: product.description,
		categories: [{id: product.wpTermId}],
		images: [{src: product.imageUrl, position: 0}],
		manage_stock: true,
		stock_quantity: product.inventoryCount,
		in_stock: true,
	}
	return axios.post(url + '/wp-json/wc/v2/products/', data)
}

export function createProducts(products) {
	var data = {create:[]}
	for (var product in products) {
		data.create.push({
			name: product.title,
			regular_price: product.cost,
			description: product.description,
			short_description: product.description,
			categories: [{id: product.wpTermId}],
			images: [{src: product.imageUrl, position: 0}],
			manage_stock: true,
			stock_quantity: product.inventoryCount,
			in_stock: true,
		})
	}
	return axios.post(url + '/wp-json/wc/v2/products/batch', data)
}

export function uploadMedia(file) {
	console.log(file)
	const stamp = Date.now()
	var formData = new FormData()
	formData.append('file', file)
	formData.append('title', stamp)
	formData.append('caption', 'test');

	return axios.post(url + '/wp-json/wp/v2/media', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
}