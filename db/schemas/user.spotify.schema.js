
var mongoose = require("mongoose");

var UserSpotify = mongoose.Schema({
  spotifyId: String,
  username: String,
  displayName: String,
  profileUrl: String,
  photos: [],
  country: String,
  followers: {
    type: Number,
    default: 0
  },
  emails: [],

  images: [],
  external_urls_spotify: String,
  fbId: String,
  artistsRecentlyPlayed: [],
  artistsFollowed: []
});

module.exports = mongoose.model("UserSpotify", UserSpotify);
