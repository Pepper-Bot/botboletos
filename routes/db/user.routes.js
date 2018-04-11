const userRoutes = require("express").Router();
var userQueries = require("../../db/queries/user.queries");
var userSpotifyQueries = require("../../db/queries/user.spotify.queries");
var userFacebookQueries = require("../../db/queries/user.facebook.queries");
var artistQueries = require("../../db/queries/artist.queries");


/**
 *  @argument ruta: http://localhost:8888/db/user_datas/:fbId
 */
userRoutes.route("/user_datas/:fbId").put(function(req, res) {
  var senderId = req.params.fbId;
  var artists = req.body;

  userQueries
    .createUpdateUseSelectArtist(senderId, artists)
    .then(userdatasSaved => {
      res.status(200).send({
        actualizado: true,
        userdatasSaved
      });
    })
    .catch(err => {
      res.status(500).send({
        error: err
      });
    });
});

/**
 *  @argument ruta: http://localhost:8888/db/user_messenger/1705877032758862
 */

userRoutes.route("/user_messenger/:fbId").get(function(req, res) {
  var senderId = req.params.fbId;

  userQueries.getUserByFbId(senderId).then(userMessenger => {
    let newArtists = userMessenger.artistsSelected
    let names = [];
    for (let i = 0; i < newArtists.length; i++) {
      console.log(`artistsSelected.name ${newArtists[i].name}`);
      names.push(newArtists[i].name);
    }

    artistQueries.getArtistsByPerformersName(names).then(artistsResult => {
      console.log(
        `getArtistsByPerformersName  ${JSON.stringify(artistsResult)}`
      );
      let userResults = {
        senderId: userMessenger.fbId,
        name:  `${userMessenger.firstName} ${userMessenger.LastName}`,
        profilePic :userMessenger.profilePic,
        artistsSelected:  artistsResult
      }
      res.status(200).send(userResults);
    });
  });
});


/**
 * @argument ruta:http://localhost:8888/db/user_datas_logged
 */
userRoutes.route("/user_datas_logged/").get(function(req, res) {
  let userIds = {
    senderId: req.session.senderId,
    facebookId: req.session.facebookId,
    spotifyId: req.session.spotifyId
  };
  if (userIds.spotifyId) {
    if (userIds.facebookId) {
      userSpotifyQueries
        .searchUserSpotifyById(userIds.spotifyId)
        .then(userSpotify => {
          userFacebookQueries
            .searchUserFacebookByFacebookId(userIds.facebookId)
            .then(userFaceBook => {
              userIds.SpotifyName = userSpotify.username;
              userIds.FacebookName = userFaceBook.name;
              res.status(200).send(userIds);
            });
        });
    } else {
      userSpotifyQueries
        .searchUserSpotifyById(userIds.spotifyId)
        .then(userSpotify => {
          userIds.SpotifyName = userSpotify.username;
          res.status(200).send(userIds);
        });
    }
  } else if (userIds.facebookId) {
    userFacebookQueries
      .searchUserFacebookByFacebookId(userIds.facebookId)
      .then(userFaceBook => {
        userIds.FacebookName = userFaceBook.name;
        res.status(200).send(userIds);
      });
  }
});

/**
 * @argument ruta:
 */
userRoutes.route("/user_datas_all/:fbId").get(function(req, res) {});

module.exports = userRoutes;
