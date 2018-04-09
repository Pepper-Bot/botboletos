var request = require("request");
var artistSpotifyQueries = require("../../db/queries/artist.spotify.queries");
var removeDuplicates = require("../../util/fun_varias").removeDuplicates;
var artistsGetRequests = require("./artists.get");

var getRecentlyPlayedTracks = acces_token => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: "https://api.spotify.com/v1/me/player/recently-played",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + acces_token
        },
        qs: {
          type: "track"
        },
        json: true,
        //body: userSpotify,
        method: "GET"
      },
      function(error, response, body) {
        if (!error) {
          let tracks = response.body.items;

          console.log(`tracks ${JSON.stringify(tracks)}`);

          let artistsArray = [];
          if (tracks)
            for (let i = 0; i < tracks.length; i++) {
              for (let j = 0; j < tracks[i].track.album.artists.length; j++) {
                let artist = {
                  id: tracks[i].track.album.artists[j].id,
                  name: tracks[i].track.album.artists[j].name
                };
                artistsArray.push(artist);
              }
            }

          artistsArray = removeDuplicates(artistsArray, "id");
          let ids = ``;
          for (let i = 0; i < artistsArray.length; i++) {
            console.log(
              `Spotify Artist Id  ${artistsArray[i].id}   name ${
                artistsArray[i].name
              }`
            );
            if (i == 0) {
              ids = `${artistsArray[i].id},`;
            } else if (i > 0 && i < artistsArray.length - 2) {
              ids += `${artistsArray[i].id},`;
            } else if (i == artistsArray.length - 1) {
              ids += `${artistsArray[i].id}`;

              console.log(ids);
              artistsGetRequests
                .getSpotifyArtists(acces_token, ids)
                .then(artistasSpotifyResponse => {
                  console.log(
                    `getSpotifyArtists Response  ${
                      artistasSpotifyResponse.statusCode
                    }`
                  );

                  artists = artistasSpotifyResponse.body.artists;

                  for (let i = 0; i < artists.length; i++) {
                    let spotify_play = artists[i].external_urls.spotify;
                    let href = artists[i].href;
                    let name = artists[i].name;
                    let id = artists[i].id;
                    let popularity = artists[i].popularity;
                    let images = artists[i].images;
                    let genres = artists[i].genres;

                    artistSpotifyQueries.createUpdateArtistSpotify(
                      spotify_play,
                      href,
                      name,
                      id,
                      popularity,
                      images,
                      genres
                    );
                  }

                  resolve(artists);
                });
            }

            //
          }
        } else {
          console.log("error en getRecentlyPlayedTracks !!" + error);
          reject(error);
        }
      }
    );
  });
};

var getMeFollowing = acces_token => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: "https://api.spotify.com/v1/me/following",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + acces_token
        },
        qs: {
          type: "artist"
        },
        json: true,
        //body: userSpotify,
        method: "GET"
      },
      function(error, response, body) {
        if (!error) {
          console.log(
            "Status de getMeFollowing  " +
              JSON.stringify(response.body.artists.items)
          );

          artists = response.body.artists.items;

          for (let i = 0; i < artists.length; i++) {
            let spotify_play = artists[i].external_urls.spotify;
            let href = artists[i].href;
            let name = artists[i].name;
            let id = artists[i].id;
            let popularity = artists[i].popularity;
            let images = artists[i].images;
            let genres = artists[i].genres;

            artistSpotifyQueries.createUpdateArtistSpotify(
              spotify_play,
              href,
              name,
              id,
              popularity,
              images,
              genres
            );
          }

          resolve(artists);
        } else {
          console.log("error en getRecentlyPlayedTracks !!" + error);
          reject(error);
        }
      }
    );
  });
};

module.exports = {
  getRecentlyPlayedTracks,
  getMeFollowing
};
