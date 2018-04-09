var mongoose = require("mongoose");

var Artist = mongoose.Schema({
  performer_id: {
    type: Number
  },
  name: String,
  popularity_score: {
    type: Number,
    default: 0
  },
  images: [
   
  ],
  category_id: Number,
  category_name: String,
  show_artist: {
    type: Boolean,
    default: true
  },
  activado: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("Artist", Artist);
