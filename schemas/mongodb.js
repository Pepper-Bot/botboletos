/*var Database = (function () {
  var dbObject;

  function openConnection() {
    var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;
    //var connectionString = process.env.MONGODB_URI;
    var connectionString = "mongodb://ds053130.mlab.com:53130/spbot"; //"mongodb://ds131432.mlab.com:31432/heroku_chw1bx35"; //
    mongoose
      .connect(connectionString, {
        auth: {
          user: "leo.jaimes", //"heroku_chw1bx35", //
          password: "Casanoba/777", // "3nuk565216cj2a592c274v75or",
        }
      })
      .then(() => console.log("Db is conencted"))
      .catch(err => console.error(err));
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
  };
})();



module.exports = Database;*/



var Database = (function () {
	var dbObject;

	function openConnection() {
		var mongoose = require("mongoose");
		mongoose.Promise = global.Promise;
		//var connectionString = process.env.MONGODB_URI;
		var connectionString = "mongodb://ds053130.mlab.com:53130/spbot"; //"mongodb://ds131432.mlab.com:31432/heroku_chw1bx35"; //
		mongoose
			.connect(connectionString, {
				auth: {
					user: "leo.jaimes", //"heroku_chw1bx35", //
					password: "Casanoba/777", // "3nuk565216cj2a592c274v75or",
				}
			})
			.then(() => console.log("Db is conencted"))
			.catch(err => console.error(err));
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
	};
})();



module.exports = Database;