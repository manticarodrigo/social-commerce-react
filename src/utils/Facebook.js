import axios from 'axios'

export function getAlbums(accessToken) {
	return new Promise((resolve, reject) => {
		axios.get('https://graph.facebook.com/me/albums?access_token=' + accessToken)
		.then(res => {
			// console.log('fb api returned album data:', res)
			var albums = res.data.data
			resolve(albums)
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
	})
}

export function fetchImagesIn(albumId, accessToken) {
	return new Promise((resolve, reject) => {
		axios.get('https://graph.facebook.com/' + albumId + '/photos?fields=images&access_token=' + accessToken)
		.then(res => {
			// console.log('fb api returned album image data:', res.data)
			var imgArr = res.data.data
			var urlArr = []
			for (var key in imgArr) {
				var url = imgArr[key].images[0].source
				urlArr.push(url)
			}
			resolve(urlArr);
		}).catch(err => {
			console.log(err)
			reject(err)
		});
	});
}