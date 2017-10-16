var mongoose = require('mongoose');

var OrderData = mongoose.Schema({
	order_id: []
	
});

module.exports = mongoose.model('Orders', OrderData);

