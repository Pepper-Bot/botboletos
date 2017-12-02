var mongoose = require('mongoose');

var OrderData = mongoose.Schema({
	order_id: [],
	order_tevo: {}
	
});

module.exports = mongoose.model('Orders', OrderData);

