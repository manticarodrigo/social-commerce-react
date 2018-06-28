import axios from 'axios'

const url = 'http://localhost:8080'

export function facebookLogin(accessToken) {
	return axios.get(url + '/?json=user.fb_connect&access_token=' + accessToken + '&insecure=cool')
}

export function createCategory(profile) {
	var data = {
		name: profile.businessName,
		image: {
			src: profile.businessLogo
		}
	}
	const auth = {
		username: 'ck_f684a0eb45fa52beb1f04769592af6d8d536b306',
		password: 'cs_5497e0d935de4b2fb31de3d0f13ca420a24ced7e'
	}
	return axios.post(url + '/wp-json/wp/v2/products/categories/', data, {auth})
}

export function updateUser(auth, profile) {
	console.log(profile)
	const data = {
		name: profile.name,
    email: profile.email,
		meta: {
			businessName: profile.businessName,
			businessLogo: profile.businessLogo,
			name: profile.name,
			email: profile.email,
			phone: profile.phone,
			dni: profile.dni,
			ruc: profile.ruc,
			bankAcct: profile.bankAcct,
			logisticProvider: profile.logisticProvider,
		}
	}
	return axios.post(url + '/wp-json/wp/v2/users/' + auth.wp_user_id + '?insecure=cool', data)
}