import graph from 'fb-react-sdk'

export function getAlbums(access_token) {
	graph.setAccessToken(access_token)
	var options = {
		timeout:  3000
	  , pool:     { maxSockets:  Infinity }
	  , headers:  { connection:  "keep-alive" }
	}
	return new Promise((resolve, reject) => {
		graph
		.setOptions(options)
		.get("/me/albums", function(err, res) {
			console.log('fb api returned album data:', res);
			var albums = res.data;
			if (albums.length > 0) {
				var albumArr = []
				var albumCount = 0
				var insta = {}
				for (var key in albums) {
					let currentAlbum = albums[key]
					console.log(currentAlbum)
					// this.fetchImagesIn(currentAlbum.id).then(urls => {
					// 	var album = {};
					// 	album['name'] = currentAlbum.name;
					// 	album['urls'] = urls;
					// 	if (urls.length > 0) {
					// 		if (currentAlbum.name == 'Profile Pictures') {
					// 			albumArr.splice(0, 0, album);
					// 		} else if (currentAlbum.name == 'Instagram Photos') {
					// 			insta = album;
					// 		} else {
					// 			albumArr.push(album);
					// 		}
					// 	}
					// 	albumCount++;
					// 	if (albumCount == albums.length) {
					// 		if (insta) {
					// 			albumArr.splice(1, 0, insta);
					// 		}
					// 		resolve(albumArr);
					// 	}
					// }).catch(error => {
					// 	console.log(error);
					// 	reject(error);
					// })
				}
			} else {
				resolve(null)
			}
		})
	})
}

export function fetchImagesIn(albumId) {
	return new Promise((resolve, reject) => {
		console.log("fetching album images...");
			this.fb.api(albumId + '/photos?fields=images').then((imageData) => {
				console.log('fb api returned album image data:', imageData);
				var imgArr = imageData.data;
				var urlArr = [];
				for (var key in imgArr) {
					var url = imgArr[key].images[0].source;
					urlArr.push(url);
				}
				resolve(urlArr);
			}).catch(error => {
				if (error.code == 2500) {
					this.facebookLogin();
				}
				console.log(error);
				reject(error);
			});
	});
}