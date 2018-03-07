var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  value: { type: String },
  synonyms: [],
  images: [
    {
      kind: String,
      url: String
    }
  ]
});

module.exports = mongoose.model("Events", EventSchema);
