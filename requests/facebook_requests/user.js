const PAGE_ACCESS_TOKEN   = 'EAASJN3kpCzkBAA7KGHeSOpjEGtgmac84jMjLFU1PKYCgaC1oVUptbwKg1JOyytZAerOpBgNiTcnBxBzTVDeX2Py4Kdb7DJz67ZCiKPeHUZA9hCp6jtVnQi319i404nUxOn41Stm21SZAl6lZAl6IZB7VJDRPDCGQW3VqWxmhzbJQZDZD'

var request = require('request');

var getInfo = (userId, callback) => {

	request({
		url: 'https://graph.facebook.com/v2.6/' + userId,
		qs: {
			access_token: PAGE_ACCESS_TOKEN
		},
		method: "GET",
	}, function (error, response, body) {
		if (error) {
            console.log('getInfo Error: ' + error)
			callback(true, null);
		} else {
            console.log('getInfo Ok! ' )
			callback(null, body);
		}
	});
}

var getUserLikes = (userId) => {
	return new Promise((resolve, reject) => {
		 
		request({
			url: 'https://graph.facebook.com/v2.12/' + userId + '/likes',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
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