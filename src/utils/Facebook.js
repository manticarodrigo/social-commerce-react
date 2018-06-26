import axios from 'axios'

export function getAlbums(accessToken) {
	return new Promise((resolve, reject) => {
		axios.get('https://graph.facebook.com/me/albums?access_token=' + accessToken)
		.then(res => {
			// console.log('fb api returned album data:', res)
			var albums = res.data.data
			if (albums.length > 0) {
				var albumArr = []
				var albumCount = 0
				var insta = {}
				for (var key in albums) {
					let currentAlbum = albums[key]
					fetchImagesIn(currentAlbum.id, accessToken)
					.then(urls => {
						var album = {}
						album['name'] = currentAlbum.name
						album['urls'] = urls
						if (urls.length > 0) {
							if (currentAlbum.name == 'Profile Pictures') {
								albumArr.splice(0, 0, album)
							} else if (currentAlbum.name == 'Instagram Photos') {
								insta = album
							} else {
								albumArr.push(album)
							}
						}
						albumCount++
						if (albumCount == albums.length) {
							if (insta) {
								albumArr.splice(1, 0, insta)
							}
							resolve(albumArr)
						}
					}).catch(error => {
						console.log(error)
						reject(error)
					})
				}
			} else {
				resolve(null)
			}
		})
	})
}

function fetchImagesIn(albumId, accessToken) {
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
		}).catch(error => {
			console.log(error)
			reject(error)
		});
	});
}