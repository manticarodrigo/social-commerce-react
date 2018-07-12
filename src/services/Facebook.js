import axios from 'axios'

export function getPages(accessToken) {
	return new Promise((resolve, reject) => {
		axios.get('https://graph.facebook.com/me/accounts?access_token=' + accessToken)
		.then(res => {
			resolve(res.data.data)
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
	})
}

export function getAlbums(id, accessToken) {
	return new Promise((resolve, reject) => {
		axios.get(`https://graph.facebook.com/${id}?fields=albums.fields(id,name,photos.fields(name,picture,source))&access_token=${accessToken}`)
		.then(res => {
			resolve(res.data.albums.data)
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
	})
}