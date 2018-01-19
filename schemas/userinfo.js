var mongoose = require('mongoose');

var UserData = mongoose.Schema({

	fbId: String,
	firstName: String,
	LastName: String,
	profilePic: String,
	locale: String,
	timeZone: String,
	gender: String,
	sessionStart: {
		type: Date,
		default: Date.now
	},
	sessionEnd: {
		type: Date,
		default: Date.now
	},
	optionsSelected: [],
	modules: [],
	urlsVisited: [],
	location: {
		type: {
			type: String
		},
		coordinates: [Number]
	},
	locationURL: String,
	messageNumber: {
		type: Number,
		default: 0
	},
	eventSearchSelected: [],
	showMemore: {
		index1: {
			type: Number,
			default: 0
		},
		index2: {
			type: Number,
			default: 0
		},
		index3: {
			type: Number,
			default: 0
		}
	},
	context: String,
	mlinkSelected: String,
	categorySearchSelected: [],
	querysTevo:[],
	

});

module.exports = mongoose.model('UserData', UserData);