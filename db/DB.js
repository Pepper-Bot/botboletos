var Database = (function() {
  var dbObject;

  function openConnection() {
    var mongoose = require("mongoose");
    mongoose.Promise = global.Promise;
    //var connectionString = process.env.MONGODB_URI;
    var connectionString = "mongodb://ds053130.mlab.com:53130/spbot";
    mongoose
      .connect(connectionString, {
        auth: {
          user: "leo.jaimes",
          password: "Casanoba/777"
        }
      })
      .then(() => console.log("Db is conencted"))
      .catch(err => console.error(err));
    var object = mongoose.connection;
    return object;
  }

  return {
    getConnection: function() {
      if (!dbObject) {
        dbObject = openConnection();
      }
      return dbObject;
    }
  };
})();

 

module.exports = Database;
