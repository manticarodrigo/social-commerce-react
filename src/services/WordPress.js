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
}

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
		manage_stock: data.inventoryCount ? true : false,
		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
		in_stock: true,
	}
	const options = {
		auth: {
			username: process.env.REACT_APP_WOOCOMMERCE_USERNAME,
			password: process.env.REACT_APP_WOOCOMMERCE_PASSWORD
		}
	}
  return axios.post(url + '/wp-json/wc/v2/products/', product, options)
};

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
		manage_stock:  data.inventoryCount ? true : false,
		stock_quantity: data.inventoryCount ? data.inventoryCount : 0,
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

export function fetchProductsAnalytics(productId, period) {
	return axios.get(url + '/wp-json/ga/v1/product/' + productId + '?period=' + period);
}