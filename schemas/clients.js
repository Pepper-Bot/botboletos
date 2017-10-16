var mongoose = require('mongoose');

var BuyerData = mongoose.Schema({
	fbId: String, 
	fullName: String, 
	client_id: {type: Number, default: 0},
	email_id: {type: Number, default: 0},
	phone_id: {type: Number, default: 0},
	address_id: [],
	billing_address_id:[],
	creditcard_id: []
	
});

module.exports = mongoose.model('Client', BuyerData);

