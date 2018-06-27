import axios from 'axios'

export function facebookLogin(accessToken) {
	return axios.get('http://localhost:8080/?json=user.fb_connect&access_token=' + accessToken + '&insecure=cool')
}

export function updateUser(auth, profile) {
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
	return axios.post('http://localhost:8080/wp-json/wp/v2/users/' + auth.wp_user_id + '?insecure=cool', data)
}