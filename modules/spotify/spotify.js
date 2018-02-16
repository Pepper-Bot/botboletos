const spotify = require('../../config/config_vars').spotify
var SpotifyWebApi = require('spotify-web-api-node');
const APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;



const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(new SpotifyStrategy({
        clientID: spotify.SPOTIFY_CLIENT_ID,
        clientSecret: spotify.SPOTIFY_CLIENT_SECRET,
        callbackURL: APLICATION_URL_DOMAIN + '/auth/spotify/callback'
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
        User.findOrCreate({
            spotifyId: profile.id
        }, function (err, user) {
            return done(err, user);
        });
    }
));



app.get('/auth/spotify',
    passport.authenticate('spotify'),
    function (req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
    });

 


app.get('/auth/spotify/callback',
    passport.authenticate('spotify', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });





// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: spotify.SPOTIFY_CLIENT_ID,
    clientSecret: spotify.SPOTIFY_CLIENT_SECRET,
    redirectUri: APLICATION_URL_DOMAIN + 'callback'
});

//https://github.com/JMPerez/passport-spotify







module.exports = {
    authSpotify

}