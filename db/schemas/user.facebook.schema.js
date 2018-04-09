
var mongoose = require("mongoose");

var UserFacebook = mongoose.Schema({
  facebookId: String,
  name: String,
  birthday: String,
  email: String,
  music: [],
  fbId: String
});

module.exports = mongoose.model("UserFacebook", UserFacebook);
