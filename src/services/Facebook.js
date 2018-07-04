import axios from 'axios'

export function getAlbums(accessToken) {
	return new Promise((resolve, reject) => {
		axios.get('https://graph.facebook.com/me?fields=albums.fields(id,name,photos.fields(name,picture,source))&access_token=' + accessToken)
		.then(res => {
			resolve(res.data.albums.data)
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
	})
}