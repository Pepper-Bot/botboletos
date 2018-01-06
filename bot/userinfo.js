var userInfo = function() 
{

	var request = require('request');
	return {

		getInfo: function(userId, callback){


		request({
				url: 'https://graph.facebook.com/v2.6/'+ userId,
				qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
				method: "GET",
			}, function(error, response, body){
				if(error)
				{
					callback(true, null);
				}
				else
				{
					console.log("User Info >>> " + JSON.stringify(body));
					callback(null, body);
				}
			});
		}
	};	
}();

module.exports = userInfo;