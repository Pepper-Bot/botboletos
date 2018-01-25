var mongoose = require('mongoose');
var Schema = mongoose.Schema

var CategoriesSchema = new Schema({
    name: { type: String },
    id: { type: String },
    slug: { type: String },
    value: { type: String },
    synonyms: [],
     
});

module.exports = mongoose.model("Categories", CategoriesSchema);