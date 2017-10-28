var userInfo = function () {

	var request = require('request');
	return {

		getInfo: function (userId, callback) {


			request({
				url: 'https://graph.facebook.com/v2.6/' + userId,
				qs: {
					access_token: process.env.PAGE_ACCESS_TOKEN
				},
				method: "GET",
			}, function (error, response, body) {
				if (error) {
					callback(true, null);
				} else {

					callback(null, body);
				}
			});
		}
	};
}();



var  saveUserSelection = (senderId, selection) => {
	return new Promise((resolve, reject) => {
		var UserData2 = require('../schemas/userinfo')
		UserData2.findOne({
			fbId: senderId
		}, {}, {
			sort: {
				'sessionStart': -1
			}
		}, function (err, result) {

			if (!err) {
				if (null != result) {
					result.optionsSelected.push(selection);
					result.save(function (err) {
						if (!err) {

							console.log('Guardamos la seleccion de ' + selection);
						} else {
							console.log('Error guardando selección')
						}
					});
				}
			}

		});
	});
}

module.exports = {
	userInfo
}