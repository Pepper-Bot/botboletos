var mongoose = require('mongoose');

var userfb = mongoose.Schema({

	fbId: String,
	firstName: String,
	LastName: String,
	profilePic: String,
	locale: String,
	timeZone: String,
	gender: String
	 

});

module.exports = mongoose.model('userfb', userfb);