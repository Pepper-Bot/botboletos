var ArtistSpotify = require("../schemas/artist.spotify.schema");

var createUpdateArtistSpotify = (
  spotify_play = "",
  href = "",
  name = "",
  id = "",
  popularity = 0,
  images = [],
  genres = []
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

  return new Promise((resolve, reject) => {
    ArtistSpotify.findOne(
      {
        id: id
      },
      {},
      {
        sort: {
          id: -1
        }
      },
      function(err, artistSpotify) {
        if (null != artistSpotify) {
          artistSpotify.spotify_play = spotify_play;
          artistSpotify.href = href;
          artistSpotify.name = name;
          artistSpotify.id = id;

          artistSpotify.popularity = popularity;
          artistSpotify.images = images;
          artistSpotify.genres = genres;
          


          artistSpotify.save(function(err, artistSpotifyUpdated) {
            if (!err) {
              console.log(
                "artistSpotifyUpdated !!! " + JSON.stringify(artistSpotifyUpdated.id)
              );

              resolve(artistSpotifyUpdated);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        } else {
          let artistSpotify = new ArtistSpotify();
          artistSpotify.spotify_play = spotify_play;
          artistSpotify.href = href;
          artistSpotify.name = name;
          artistSpotify.id = id;

          artistSpotify.popularity = popularity;
          artistSpotify.images = images;
          artistSpotify.genres = genres;
          


          artistSpotify.save(function(err, artistSpotifySaved) {
            if (!err) {
              console.log(
                "artistSpotifySaved !!! " + JSON.stringify(artistSpotifySaved.id)
              );

              resolve(artistSpotifySaved);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        }
      }
    );
  });
};












module.exports = {
    createUpdateArtistSpotify
};
