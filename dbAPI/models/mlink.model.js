var mongoose = require('mongoose');
var MLink = mongoose.Schema({
    mlink: String, 
    id_evento: String
});

module.exports = mongoose.model('MLink', MLink);

