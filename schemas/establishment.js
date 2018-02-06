var mongoose = require('mongoose');
var Schema = mongoose.Schema

var EstablishmentSchema = new Schema({
    name: { type: String },
    id: { type: String },
    value: { type: String },
    synonyms: [],
     
});

module.exports = mongoose.model("establishment", EstablishmentSchema);