var Database = (function () {

	var dbObject;

	function openConnection() {
		var mongoose = require('mongoose');
		var connectionString = process.env.MONGODB_URI;

		mongoose.connect(connectionString);
		var object = mongoose.connection;
		return object;
	}

	return {
		getConnection: function () {
			if (!dbObject) {
				dbObject = openConnection();
			}
			return dbObject;
		}
	}
})();



var getFinalFBUserSession = (senderId, User) => {
	return new Promise((resolve, reject) => {
		var UserData2 = require('../schemas/userinfo')
		UserData2.findOne({
			fbId: senderId
		}, {}, {
			sort: {
				'sessionStart': -1
			}
		}, function (err, userConsultado) {
			if (!err) {
				resolve(userConsultado);
			} else {

			}
		});
	});
}



module.exports = {
	Database,
    getFinalFBUserSession


};