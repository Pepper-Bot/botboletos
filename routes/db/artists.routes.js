const artistRoutes = require("express").Router();
var artistQueries = require("../../db/queries/artist.queries");
var userSpotifyQueries = require("../../db/queries/user.spotify.queries");
var userFacebookQueries = require("../../db/queries/user.facebook.queries");
var userQueries = require("../../db/queries/user.queries");

var removeDuplicates = require("../../util/fun_varias").removeDuplicates;

artistRoutes.route("artist/:performer_id").get(function(req, res) {});






/**
 * @argument ruta: http://localhost:8888/db/artists2/12/page/1
 */
artistRoutes.route("/artists2/:limite/page/:page").get(function(req, res) {
  let limite = req.params.limite;
  let page = req.params.page;
  page = Number(page);
  console.log(`getArtists spotifyId  ${JSON.stringify(req.session.spotifyId)}`);

  console.log(
    `getArtists facebookId  ${JSON.stringify(req.session.facebookId)}`
  );

  artistQueries.getArtists(limite, page).then(artists => {
    res.status(200).send(artists);
  })
})




/**
 * @argument ruta: http://localhost:8888/db/artists/12/page/1
 */
artistRoutes.route("/artists/:limite/page/:page").get(function(req, res) {
  let limite = req.params.limite;
  let page = req.params.page;
  page = Number(page);
  console.log(`getArtists spotifyId  ${JSON.stringify(req.session.spotifyId)}`);

  console.log(
    `getArtists facebookId  ${JSON.stringify(req.session.facebookId)}`
  );

  artistQueries.getArtists(limite, page).then(artists => {
    //console.log(`Artistas de Tevo ${JSON.stringify(artists)}`);
    if (req.session.senderId) {
      if (req.session.spotifyId) {
        if (req.session.facebookId) {
            senderIdSpotifyAndFacebookDefined(req, res, artists);
        } else {
          senderIdAndSpotifyDefined(req, res, artists);
        }
      } else {
        if (req.session.facebookId) {
          onlyFacebookDefined(req, res, artists);
        } else {
          let newArtists = artists;
          for (let i = 0; i < newArtists.length; i++) {
            newArtists.activado = false;

            if (i === newArtists.length - 1) {
              res.status(200).send(artists);
            }
          }
        }
      }
    } else {
      if (req.session.spotifyId) {
        if (req.session.facebookId) {
          spotifyAndFacebookDefined(req, res, artists);
        } else {
          onlySpotifyDefined(req, res, artists);
        }
      } else {
        if (req.session.facebookId) {
          onlyFacebookDefined(req, res, artists);
        } else {
          let newArtists = artists;
          for (let i = 0; i < newArtists.length; i++) {
            newArtists.activado = false;

            if (i === newArtists.length - 1) {
              res.status(200).send(artists);
            }
          }
        }
      }
    }
  });
});

/**
 * @argument ruta: http://localhost:8888/db/artist/24764
 */
artistRoutes.route("/artist/:performer_id").get(function(req, res) {
  let performer_id = req.params.performer_id;
  artistQueries.getArtist(performer_id).then(artist => {
    res.status(200).send(artist);
  });
});



/**
 * @argument ruta: http://localhost:8888/db/artists/Shakira
 */
artistRoutes.route("/artists/:name").get(function(req, res) {
  let name = req.params.name;
  console.log(` en  artistRoutes  name ${name}`)
  artistQueries.searchArtistsLikeName(name, 24, 1).then(artists => {
      console.log(artists.length)
      res.status(200).send(artists);
  });
});





 


/**
 *
 * @param {*} req  requests
 * @param {*} res  response
 * @param {*} artists  artistas
 * @description Función para agregar los artistas encontrados en spotify
 */
var onlySpotifyDefined = (req, res, artists) => {
  userSpotifyQueries
    .searchUserSpotifyById(req.session.spotifyId)
    .then(userSpotify => {
      let newArtists = [];

      newArtists = userSpotify.artistsFollowed.concat(
        userSpotify.artistsRecentlyPlayed
      );

      newArtists = removeDuplicates(newArtists, "name");
      console.log(`newArtists Concat 1 ${newArtists.length}`);

      for (let k = 0; k < newArtists.length; k++) {
        newArtists[k].activado = true;
      }

      let artistsSinAnteriores = [];
      artistsSinAnteriores = artists;

      for (let k = 0; k < newArtists.length; k++) {
        for (let i = 0; i < artistsSinAnteriores.length; i++) {
          if (artistsSinAnteriores[i].name === newArtists[k].name) {
            artistsSinAnteriores.splice(i, 1);
            break;
          }
        }
      }

      newArtists = newArtists.concat(artistsSinAnteriores);

      res.status(200).send(newArtists);
    });
};

/**
 *
 * @param {*} req  requests
 * @param {*} res  response
 * @param {*} artists  artistas
 * @description Función para agregar los artistas encontrados en spotify
 */
var senderIdAndSpotifyDefined = (req, res, artists) => {
  userQueries.getUserByFbId(req.session.senderId).then(userMessenger => {
    userSpotifyQueries
      .searchUserSpotifyById(req.session.spotifyId)
      .then(userSpotify => {
        let newArtists = [];

        newArtists = userSpotify.artistsFollowed.concat(
          userSpotify.artistsRecentlyPlayed,
          userMessenger.artistsSelected
        );

        newArtists = removeDuplicates(newArtists, "name");
        console.log(`newArtists Concat 1 ${newArtists.length}`);

        for (let k = 0; k < newArtists.length; k++) {
          newArtists[k].activado = true;
        }

        let artistsSinAnteriores = [];
        artistsSinAnteriores = artists;

        for (let k = 0; k < newArtists.length; k++) {
          for (let i = 0; i < artistsSinAnteriores.length; i++) {
            if (artistsSinAnteriores[i].name === newArtists[k].name) {
              artistsSinAnteriores.splice(i, 1);
              break;
            }
          }
        }

        newArtists = newArtists.concat(artistsSinAnteriores);

        res.status(200).send(newArtists);
      });
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} artists
 * @description Función para agregar los artistas encontrados en spotify y facebook
 */
var spotifyAndFacebookDefined = (req, res, artists) => {
  userSpotifyQueries
    .searchUserSpotifyById(req.session.spotifyId)
    .then(userSpotify => {
      userFacebookQueries
        .searchUserFacebookByFacebookId(req.session.facebookId)
        .then(userFaceBook => {
          let newArtists = [];

          newArtists = userSpotify.artistsFollowed.concat(
            userSpotify.artistsRecentlyPlayed,
            userFaceBook.music
          );

          newArtists = removeDuplicates(newArtists, "name");
          console.log(`newArtists Concat 1 ${newArtists.length}`);

          let names = [];
          for (let i = 0; i < newArtists.length; i++) {
            console.log(`artistsRecentlyPlayed.name ${newArtists[i].name}`);
            names.push(newArtists[i].name);
          }

          artistQueries
            .getArtistsByPerformersName(names)
            .then(artistsResult => {
              console.log(
                `getArtistsByPerformersName  ${JSON.stringify(artistsResult)}`
              );

              artistsResult.forEach(function(obj) {
                obj.activado = true;
              });

              let artistsSinAnteriores = [];
              artistsSinAnteriores = artists;

              for (let k = 0; k < artistsResult.length; k++) {
                for (let i = 0; i < artistsSinAnteriores.length; i++) {
                  if (artistsSinAnteriores[i].name === artistsResult[k].name) {
                    artistsSinAnteriores.splice(i, 1);
                    break;
                  }
                }
              }

              artistsResult = artistsResult.concat(artistsSinAnteriores);

              res.status(200).send(artistsResult);
            });
        });
    });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} artists
 * @description Función para agregar los artistas encontrados en spotify y facebook
 */
var senderIdSpotifyAndFacebookDefined = (req, res, artists) => {
  userQueries.getUserByFbId(req.session.senderId).then(userMessenger => {
    userSpotifyQueries
      .searchUserSpotifyById(req.session.spotifyId)
      .then(userSpotify => {
        userFacebookQueries
          .searchUserFacebookByFacebookId(req.session.facebookId)
          .then(userFaceBook => {
            let newArtists = [];

            newArtists = userSpotify.artistsFollowed.concat(
              userSpotify.artistsRecentlyPlayed,
              userFaceBook.music, userMessenger.artistsSelected
            );

            newArtists = removeDuplicates(newArtists, "name");
            console.log(`newArtists Concat 1 ${newArtists.length}`);

            let names = [];
            for (let i = 0; i < newArtists.length; i++) {
              console.log(`artistsRecentlyPlayed.name ${newArtists[i].name}`);
              names.push(newArtists[i].name);
            }

            artistQueries
              .getArtistsByPerformersName(names)
              .then(artistsResult => {
                console.log(
                  `getArtistsByPerformersName  ${JSON.stringify(artistsResult)}`
                );

                artistsResult.forEach(function(obj) {
                  obj.activado = true;
                });

                let artistsSinAnteriores = [];
                artistsSinAnteriores = artists;

                for (let k = 0; k < artistsResult.length; k++) {
                  for (let i = 0; i < artistsSinAnteriores.length; i++) {
                    if (
                      artistsSinAnteriores[i].name === artistsResult[k].name
                    ) {
                      artistsSinAnteriores.splice(i, 1);
                      break;
                    }
                  }
                }

                artistsResult = artistsResult.concat(artistsSinAnteriores);

                res.status(200).send(artistsResult);
              });
          });
      });
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} artists
 * @description Función para agregar los artistas encontrados en facebook del usuario logueado
 */
var onlyFacebookDefined = (req, res, artists) => {
  userFacebookQueries
    .searchUserFacebookByFacebookId(req.session.facebookId)
    .then(userFaceBook => {
      let newArtists = [];

      newArtists = userFaceBook.music;

      newArtists = removeDuplicates(newArtists, "name");
      console.log(`newArtists Concat 1 ${newArtists.length}`);

      let names = [];
      for (let i = 0; i < newArtists.length; i++) {
        console.log(`artistsRecentlyPlayed.name ${newArtists[i].name}`);
        names.push(newArtists[i].name);
      }

      artistQueries.getArtistsByPerformersName(names).then(artistsResult => {
        console.log(
          `getArtistsByPerformersName  ${JSON.stringify(artistsResult)}`
        );

        artistsResult.forEach(function(obj) {
          obj.activado = true;
        });

        let artistsSinAnteriores = [];
        artistsSinAnteriores = artists;

        for (let k = 0; k < artistsResult.length; k++) {
          for (let i = 0; i < artistsResult.length; i++) {
            if (artistsSinAnteriores[i].name === artistsResult[k].name) {
              artistsSinAnteriores.splice(i, 1);
              break;
            }
          }
        }

        artistsResult = artistsResult.concat(artistsSinAnteriores);

        res.status(200).send(artistsResult);
      });
    });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} artists
 * @description Función para agregar los artistas encontrados en facebook del usuario logueado
 */
var senderIdAndFacebookDefined = (req, res, artists) => {


  userQueries.getUserByFbId(req.session.senderId).then(userMessenger => {
  userFacebookQueries
    .searchUserFacebookByFacebookId(req.session.facebookId)
    .then(userFaceBook => {
      let newArtists = [];

      newArtists = userFaceBook.music.concat(userMessenger.artistsSelected  );

      newArtists = removeDuplicates(newArtists, "name");
      console.log(`newArtists Concat 1 ${newArtists.length}`);

      let names = [];
      for (let i = 0; i < newArtists.length; i++) {
        console.log(`artistsRecentlyPlayed.name ${newArtists[i].name}`);
        names.push(newArtists[i].name);
      }

      artistQueries.getArtistsByPerformersName(names).then(artistsResult => {
        console.log(
          `getArtistsByPerformersName  ${JSON.stringify(artistsResult)}`
        );

        artistsResult.forEach(function(obj) {
          obj.activado = true;
        });

        let artistsSinAnteriores = [];
        artistsSinAnteriores = artists;

        for (let k = 0; k < artistsResult.length; k++) {
          for (let i = 0; i < artistsResult.length; i++) {
            if (artistsSinAnteriores[i].name === artistsResult[k].name) {
              artistsSinAnteriores.splice(i, 1);
              break;
            }
          }
        }

        artistsResult = artistsResult.concat(artistsSinAnteriores);

        res.status(200).send(artistsResult);
      });
    });
  });
};



module.exports = artistRoutes;
