const spotify = require('../../config/config_vars').spotify
var SpotifyWebApi = require('spotify-web-api-node');
const APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: spotify.SPOTIFY_CLIENT_ID,
    clientSecret: spotify.SPOTIFY_CLIENT_SECRET,
    redirectUri: APLICATION_URL_DOMAIN + 'callback'
});

//https://github.com/JMPerez/passport-spotify

