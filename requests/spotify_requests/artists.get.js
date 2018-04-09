var request = require("request");

var getSpotifyArtists = (acces_token, ids) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url: "https://api.spotify.com/v1/artists",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + acces_token
        },
        qs: {
          ids: ids
        },
        json: true,
        method: "GET"
      },
      function(error, response, body) {
        if (!error) {
          resolve(response);
        } else {
          console.log("error en getRecentlyPlayedTracks !!" + error);
          reject(error);
        }
      }
    );
  });
};

module.exports = {
  getSpotifyArtists
};
