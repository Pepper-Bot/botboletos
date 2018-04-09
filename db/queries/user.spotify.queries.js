var UserSpotify = require("../schemas/user.spotify.schema");
const tevoRequestsPerformers = require("../../requests/tevo_requests/performers");

/**
 *
 * @param {*} spotifyId spotify Id
 * @param {*} username
 * @param {*} displayName
 * @param {*} profileUrl
 * @param {*} photos
 * @param {*} country
 * @param {*} followers
 * @param {*} emails
 * @param {*} images
 * @param {*} external_urls_spotify
 * @description Función para guardar o actualizar un registro en la tabla UserSpotify
 */
var createUpdateUserSpotify = (
  spotifyId,
  username,
  displayName,
  profileUrl,
  photos,
  country,
  followers,
  emails,
  images,
  external_urls_spotify
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserSpotify.findOne(
      {
        spotifyId: spotifyId
      },
      {},
      {
        sort: {
          spotifyId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.spotifyId = spotifyId;
          foundUser.username = username;
          foundUser.displayName = displayName;
          foundUser.profileUrl = profileUrl;

          foundUser.photos = photos;

          foundUser.country = country;
          foundUser.followers = followers;

          foundUser.emails = emails;

          foundUser.images = images;

          foundUser.external_urls_spotify = external_urls_spotify;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserSpotify Saved!!! " + JSON.stringify(userSaved.spotifyId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        } else {
          let User = new UserSpotify();
          User.spotifyId = spotifyId;
          User.username = username;
          User.displayName = displayName;
          User.profileUrl = profileUrl;

          if (photos != "") {
            User.photos = photos;
          }

          User.country = country;
          User.followers = followers;

          User.emails = emails;

          User.images = images;

          User.external_urls_spotify = external_urls_spotify;

          User.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserSpotify Saved!!! " + JSON.stringify(userSaved.spotifyId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param {*} spotifyId spotify Id
 * @param {*} artistsRecentlyPlayed
 *
 * @description Función para actualizar un registro en la tabla UserSpotify
 */
var updateUserSpotifyArtistsRecentlyPlayed = (
  spotifyId,
  artistsRecentlyPlayed = []
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserSpotify.findOne(
      {
        spotifyId: spotifyId
      },
      {},
      {
        sort: {
          spotifyId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.spotifyId = spotifyId;

          foundUser.artistsRecentlyPlayed = artistsRecentlyPlayed;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserSpotify Saved!!! " + JSON.stringify(userSaved.spotifyId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userspotifie " + err);
            }
          });
        }
      }
    );
  });
};



/**
 *
 * @param {*} spotifyId spotify Id
 * @param {*} artistsFollowed
 *
 * @description Función para actualizar un registro en la tabla UserSpotify
 */
var updateUserSpotifyArtistsFollowing = (spotifyId, artistsFollowed = []) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserSpotify.findOne(
      {
        spotifyId: spotifyId
      },
      {},
      {
        sort: {
          spotifyId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.spotifyId = spotifyId;
          foundUser.artistsFollowed = artistsFollowed;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserSpotify Saved!!! " + JSON.stringify(userSaved.spotifyId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userspotifie " + err);
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param {*} spotifyId spotify Id
 * @param {*} fbId Facebook Sender Id
 *
 * @description Función para actualizar un registro en la tabla UserSpotify
 */
var updateUserSpotifyFacebookId = (spotifyId, fbId) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    UserSpotify.findOne(
      {
        spotifyId: spotifyId
      },
      {},
      {
        sort: {
          spotifyId: -1
        }
      },
      function(err, foundUser) {
        if (null != foundUser) {
          foundUser.spotifyId = spotifyId;
          foundUser.fbId = fbId;

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "UserSpotify Saved!!! " + JSON.stringify(userSaved.spotifyId)
              );

              resolve(userSaved);
            } else {
              console.log("Error guardando en userspotifie " + err);
            }
          });
        }
      }
    );
  });
};

/**
 *
 * @param {*} spotifyId spotify Id
 * @param {*} artistsRecentlyPlayed
 *
 * @description Función para actualizar un registro en la tabla UserSpotify
 */
var searchUserSpotifyById = (spotifyId, artistsRecentlyPlayed = []) => {
  var dbObj = require("../DB");
  dbObj.getConnection();
  return new Promise((resolve, reject) => {
    UserSpotify.findOne(
      {
        spotifyId: spotifyId
      },
      {},
      {
        sort: {
          spotifyId: -1
        }
      },
      function(err, foundUser) {
        if (!err) {
          if (foundUser != null) {
            resolve(foundUser);
          } else {
            resolve(null);
          }
        } else {
          console.log(`Error en searchUserSpotifyById ${err}`);
          resolve(null);
        }
      }
    );
  });
};






 

module.exports = {
  createUpdateUserSpotify,
  updateUserSpotifyArtistsRecentlyPlayed,
  updateUserSpotifyArtistsFollowing,
  updateUserSpotifyFacebookId,
  searchUserSpotifyById,
   
};
