import axios from 'axios'

const url = process.env.REACT_APP_BACKEND_URL

export function facebookLogin(accessToken) {
	return axios.get(url + '/?json=user.fb_connect&access_token=' + accessToken + '&insecure=cool')
}

export function createCategory(auth, data) {
	const category = {
		ownerId: auth.wp_user_id,
		businessName: data.businessName,
		businessLogo: data.businessLogo,
		dni: data.dni,
		ruc: data.ruc,
		phone: data.phone,
		bankAccount: data.bankAccount,
		logisticProvider: data.logisticProvider
	}
	return axios.post(url + '/wp-json/socialcommerce/v1/categories/create/', category)
}

export function fetchCategories(auth) {
	// const ownerId = auth.wp_user_id
	return axios.get(url + '/wp-json/socialcommerce/v1/categories/')
}

export function updateUser(auth, data) {
	const user = {
		name: data.name,
		email: data.email,
		meta: {
			phone: data.phone,
			dni: data.dni,
			ruc: data.ruc,
			bankAccount: data.bankAccount,
			logisticProvider: data.logisticProvider
		}
	}
	return axios.post(url + '/wp-json/wp/v2/users/' + auth.wp_user_id, user)
}

export function updateUserMeta(auth, data) {
	const endpoint = ('/?json=user.update_user_meta_vars/?cookie='+ auth.cookie
										+ '&phone=' + data.phone
										+ '&dni=' + data.dni
										+ '&ruc=' + data.ruc
										+ '&bankAccount=' + data.bankAccount
										+ '&logisticProvider=' + data.logisticProvider
									)
	return axios.get(url + endpoint+ '?insecure=cool')
}

export function createProduct(data) {
	const product = {
		name: data.title,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		categories: [{id: data.category.term_id}],
		images: [{src: data.imageUrl, position: 0}],
		manage_stock: true,
		stock_quantity: data.inventoryCount,
		in_stock: true,
	}
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
	return axios.post(url + '/wp-json/wc/v2/products/', product, options)
}

export function createProducts(data) {
	var products = {create:[]}
	for (var product in data) {
		products.create.push({
			name: product.title,
			regular_price: product.cost,
			description: product.description,
			short_description: product.description,
			categories: [{id: product.category.term_id}],
			images: [{src: product.imageUrl, position: 0}],
			manage_stock: true,
			stock_quantity: product.inventoryCount,
			in_stock: true,
		})
	}
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
	return axios.post(url + '/wp-json/wc/v2/products/batch', products, options)
}

export function updateProduct(data) {
	const id = {id: data.imageId, position: 0}
	const src = {src: data.imageUrl, position: 0}
	const product = {
		name: data.title,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		categories: [{id: data.category.term_id}],
		images: [data.imageId ? id : src],
		manage_stock: true,
		stock_quantity: data.inventoryCount,
		in_stock: true,
	}
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
	return axios.put(url + '/wp-json/wc/v2/products/' + data.id, product, options)
}

export function deleteProduct(productId) {
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
	return axios.delete(url + '/wp-json/wc/v2/products/' + productId, options)
}

export function fetchProducts(categoryId) {
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
	return axios.get(url + '/wp-json/wc/v2/products/?category=' + categoryId, options)
}

export function uploadMedia(file) {
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