var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CuisineSchema = new Schema({
    name: { type: String },
    id: { type: String },
    value: { type: String },
    synonyms: [],
     
});

module.exports = mongoose.model("cuisine", CuisineSchema);