var express = require('express');
var router = express.Router();
var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var graph = require('fbgraph');

var config = require('../../config/config_vars')
var APLICATION_URL_DOMAIN = config.APLICATION_URL_DOMAIN

var conf = {
  client_id: config.FB_APP_PUBLIC_ID,
  client_secret: config.FB_APP_SECRET_ID,
  scope: 'email, user_about_me, user_birthday, user_location, publish_actions, manage_pages, publish_pages  '
    // You have to set http://localhost:3000/ as your website
    // using Settings -> Add platform -> Website
    ,
  redirect_uri: APLICATION_URL_DOMAIN + 'auth'
};



graph.setAccessToken(config.PAGE_ACCESS_TOKEN);


var auth = (req, res) => {
  console.log(APLICATION_URL_DOMAIN + 'auth')
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    console.log("Performing oauth for some user right now.");

    var authUrl = graph.getOauthUrl({
      "client_id": conf.client_id,
      "redirect_uri": conf.redirect_uri,
      "scope": conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else { //req.query.error == 'access_denied'
      res.send('access denied');
    }
  }
  // If this branch executes user is already being redirected back with 
  // code (whatever that is)
  else {
    console.log("Oauth successful, the code (whatever it is) is: ", req.query.code);
    // code is set
    // we'll send that and get the access token
    graph.authorize({
      "client_id": conf.client_id,
      "redirect_uri": conf.redirect_uri,
      "client_secret": conf.client_secret,
      "code": req.query.code
    }, function (err, facebookRes) {
      res.redirect('/UserHasLoggedIn');
    });
  }
}


var UserHasLoggedIn = (req, res) => {

  res.send('Logged In');
  res.end();

}

var zuck = (req, res) => {
  graph.setAccessToken(config.PAGE_ACCESS_TOKEN);

  //buscarPorNombre(req, res, 'silvermike88')
  mis_datos(req, res)


}


var buscarPorNombre = (req, res, nombre) => {
  graph.get(nombre, function (err, response) {
    console.log(response); // { id: '4', name: 'Mark Zuckerberg'... }

    res.send('response ' + response);
    res.end();

  });
}


var publicar_en_mi_muro = (req, res, message) => {
  var wallPost = {
    message: message
  };

  graph.post("/feed", wallPost, function (err, response) {
    // returns the post id
    console.log("Feed >" + JSON.stringify(response)); // { id: xxxxx}

    res.send('response ' + response);
    res.end();

  });

}


var mis_datos = (req, res) => {
 // music.listens
  //graph.get("me/friends?limit=50", function (err, data) {
    graph.get("1305103102885845/likes", function (err, data) {
    console.log(data);
    res.send('response ' + data);
    res.end();
  });

}



//curl -i -X GET \
//"https://graph.facebook.com/v2.12/1253295621432887/music?access_token=EAAWdEPleTaMBAM1tBFqT8NPvjlwT2Wtoi5ZBwuVPuBeZCaxiJZBre3YkDVDuNFI1FZATZBUCzbGRG1Rs8SET5ZCedB3jj8uMZAUSt7UVxJT8hwkPQqqq797sg6O7xb1QzWqlAZAEfvlbAy6Rit71ZAOijNkunkCD8wG2mtcREDN975ADGZBcRDFeNL75xXRYlPPaUZD"
module.exports = {
  auth,
  UserHasLoggedIn,
  zuck
};