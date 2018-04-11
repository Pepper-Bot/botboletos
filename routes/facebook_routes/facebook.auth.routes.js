var express = require("express");
const facebookAuthRoutes = require("express").Router();
var graph = require("fbgraph");
const userFaceBookQueries = require("../../db/queries/user.facebook.queries");
const tevoRequestsPerformers = require("../../requests/tevo_requests/performers");

var config = require("../../config/config_vars");
var APLICATION_URL_DOMAIN = config.APLICATION_URL_DOMAIN;

var conf = {
  client_id: config.FB_APP_PUBLIC_ID,
  client_secret: config.FB_APP_SECRET_ID,
  //scope: "email, user_likes, user_education_history,  user_about_me, user_birthday,   user_actions.music ",
  scope: "email, user_likes, user_birthday,  ",
  redirect_uri: APLICATION_URL_DOMAIN + "auth/facebook/callback"
};

console.log(APLICATION_URL_DOMAIN);

//graph.setAccessToken(config.PAGE_ACCESS_TOKEN);

facebookAuthRoutes.route("/callback").get(function(req, res) {
  console.log(APLICATION_URL_DOMAIN + "auth/facebook/callback");
  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    console.log("Performing oauth for some user right now.");

    var authUrl = graph.getOauthUrl({
      client_id: conf.client_id,
      redirect_uri: conf.redirect_uri,
      scope: conf.scope
    });

    if (!req.query.error) {
      //checks whether a user denied the app facebook login/permissions

      res.redirect(authUrl);
    } else {
      //req.query.error == 'access_denied'
      res.send("access denied");
    }
  } else {
    // If this branch executes user is already being redirected back with
    // code (whatever that is)
    console.log(
      "Oauth successful, the code (whatever it is) is: ",
      req.query.code
    );
    // code is set
    // we'll send that and get the access token
    graph.authorize(
      {
        client_id: conf.client_id,
        redirect_uri: conf.redirect_uri,
        client_secret: conf.client_secret,
        code: req.query.code
      },
      function(err, facebookRes) {
        console.log(`facebookRes ${JSON.stringify(facebookRes)}`);

        res.redirect("/auth/facebook/process");
      }
    );
  }
});

facebookAuthRoutes.route("/process").get(function(req, res) {
  console.log(`req.query  ${JSON.stringify(req.query)}`);
  graph.get(
    "me/?fields=id, name, birthday, email, address,  music, favorite_teams, about",
    function(err, data) {
      console.log("data >" + JSON.stringify(data));

      let music = [];
      for (let i = 0; i < data.music.data.length; i++) {
        music.push(data.music.data[i].name);
      }


      console.log(`fb music data length ${data.music.data.length}`);
      
      tevoRequestsPerformers.searchPerformersByNames(music).then(performers => {
        console.log(`performers  ${JSON.stringify(performers)}`);

        userFaceBookQueries
          .createUpdateUserFacebook(
            data.id,
            data.name,
            data.birthday,
            data.email,
            performers
          )
          .then(() => {
            if (req.session.senderId) {
              userFaceBookQueries.updateUserFacebookSenderId(
                data.id,
                req.session.senderId
              );
            }
          });
      });

      req.session.facebookId = data.id;
      res.redirect("/profile/#fb=true");
    }
  );
});

facebookAuthRoutes.route("/zuck").get((req, res) => {
  mis_datos(req, res);
});

var buscarPorNombre = (req, res, nombre) => {
  graph.get(nombre, function(err, response) {
    console.log(response); // { id: '4', name: 'Mark Zuckerberg'... }

    res.send("response " + response);
    res.end();
  });
};

var publicar_en_mi_muro = (req, res, message) => {
  var wallPost = {
    message: message
  };

  graph.post("/feed", wallPost, function(err, response) {
    // returns the post id
    console.log("Feed >" + JSON.stringify(response)); // { id: xxxxx}

    res.send("response " + JSON.stringify(response));
    res.end();
  });
};

var mis_datos = (req, res) => {
  // music.listens
  //graph.get("me/friends?limit=50", function (err, data) {
  graph.get("me?fields=music", function(err, data) {
    console.log(data);
    res.send("response " + data);
    res.end();
  });
};

module.exports = facebookAuthRoutes;
