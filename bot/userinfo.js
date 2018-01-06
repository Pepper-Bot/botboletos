var userInfo = function () {

	var request = require('request');
	return {

		getInfo: function (userId, callback) {

			const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
			request({
				url: 'https://graph.facebook.com/v2.8/' + userId,
				qs: {
					access_token: process.env.PAGE_ACCESS_TOKEN,
					fields: userFieldSet
				},
				method: "GET",
			}, function (error, response, body) {
				if (error) {
					callback(true, null);
				} else {
					console.log("User Info >>> " + JSON.stringify(body));
					callback(null, body);
				}
			});
		}
	};
}();

module.exports = userInfo;