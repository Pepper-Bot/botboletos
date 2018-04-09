var mongoose = require("mongoose");

var ArtistSpotify = mongoose.Schema({
  spotify_play: {
    type: String
  },
  href: String,
  name: String,
  id: String,

  popularity: {
    type: Number,
    default: 0
  },
  images: [
    {
      height: Number,
      url: String,
      width: Number
    }
  ],
  genres: []
});

module.exports = mongoose.model("ArtistSpotify", ArtistSpotify);
