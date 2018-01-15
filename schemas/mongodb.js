
var Database = (function(){
	
		var dbObject;
	
		function openConnection(){
			var mongoose = require('mongoose');
			//var connectionString = process.env.MONGODB_URI;
			var connectionString = process.env.MONGODB_URI;
			mongoose.connect(connectionString);
			var object = mongoose.connection;
			return object;
		}
	
		return {
			getConnection: function(){
				if(!dbObject) {
						dbObject = openConnection();
				}
				return dbObject;
			}
		}
	})();
	
	module.exports = Database;
	