import axios from 'axios';

const url = process.env.REACT_APP_BACKEND_URL;

export function uploadMedia(sitePath, file) {
	const stamp = Date.now();
	var formData = new FormData();
	formData.append('file', file);
	formData.append('title', stamp);
	formData.append('caption', `Uploaded at ${sitePath}`);

	return axios.post(`${url + sitePath}wp-json/wp/v2/media`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
};