var request = require('request');

var getInfo = (userId, callback) => {

	request({
		url: 'https://graph.facebook.com/v3.1/' + userId,
		qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN
		},
		method: "GET",
	}, function (error, response, body) {
		if (error) {
			callback(true, null);
		} else {
			console.log('getInfo Ok!')
			callback(null, body);
		}
	});
}

var getUserLikes = (userId) => {
	return new Promise((resolve, reject) => {

		request({
			url: 'https://graph.facebook.com/v3.1/' + userId + '/likes',
			qs: {
				access_token: process.env.PAGE_ACCESS_TOKEN
			},
			method: "POST",
		}, function (error, response, body) {
			if (error) {
				console.log('error en getUserLikes ' + error)
				reject(error);

			} else {
				console.log('Likes del usuario ' + userId + ' ' + JSON.stringify(body))
				resolve(body)
			}
		});
	})
}



module.exports = {
	getInfo,
	getUserLikes,
}