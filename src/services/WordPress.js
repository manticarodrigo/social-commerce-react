import axios from 'axios'

const url = process.env.REACT_APP_BACKEND_URL

export function facebookLogin(accessToken) {
	let base_url = url + '/?json=user.fb_connect&access_token=' + accessToken
	if (process.env.REACT_APP_ENV !== 'production') {
		base_url += '&insecure=cool'
	}
	return axios.get(base_url)
}

export function createCategory(auth, data) {
	const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
	const category = {
		name: data.businessName,
		owner_id: auth.wp_user_id,
		image,
		dni: data.dni,
		ruc: data.ruc,
		phone: data.phone,
		bank_account: data.bankAccount,
		logistic_provider: data.logisticProvider
	}
	return axios.post(url + '/wp-json/wc/custom/products/categories/', category)
}

export function updateCategory(auth, data) {
	const image = data.imageId ? { id: data.imageId } : data.image ? { id: data.image.id } : { src: data.businessLogo }
	const category = {
		approved: data.approved,
		name: data.businessName,
		owner_id: auth.wp_user_id,
		image,
		dni: data.dni,
		ruc: data.ruc,
		phone: data.phone,
		bank_account: data.bankAccount,
		logistic_provider: data.logisticProvider
	}
	return axios.put(`${url}/wp-json/wc/custom/products/categories/${data.id}`, category)
}

export function deleteCategory(categoryId) {
	return axios.delete(url + '/wp-json/wc/v2/products/categories/' + categoryId, { data: { force: true } })
}

export function fetchCategories(auth) {
	const ownerId = auth.wp_user_id
	return axios.get(`${url}/wp-json/wc/custom/products/categories/?owner_id=${ownerId}`)
}

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

export function createProduct(data) {
	const id = {id: data.imageId, position: 0}
	const src = {src: data.imageUrl, position: 0}
	const product = {
		name: data.name,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		categories: [{id: data.category.id}],
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
	return axios.post(url + '/wp-json/wc/v2/products/', product, options)
}

export function updateProduct(data) {
	const id = {id: data.imageId, position: 0}
	const src = {src: data.imageUrl, position: 0}
	const product = {
		name: data.name,
		regular_price: data.cost,
		description: data.description,
		short_description: data.description,
		categories: [{id: data.category.id}],
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
	formData.append('caption', 'test')

	return axios.post(url + '/wp-json/wp/v2/media', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}