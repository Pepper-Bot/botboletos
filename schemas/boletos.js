var mongoose = require('mongoose');

var FBSessions = mongoose.Schema({

	fbId: String, 
	
});

module.exports = mongoose.model('FBSessions', FBSessions);

