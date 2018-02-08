var express = require('express');
var router = express.Router();
var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
 

var auth = (req, res) => {

    res.status(200);
    res.send('Entre a auth');
    res.end();
   
    // we don't have a code yet
    // so we'll redirect to the oauth dialog
    if (!req.query.code) {
      console.log("Performing oauth for some user right now.");
    
      var authUrl = graph.getOauthUrl({
          "client_id":     conf.client_id
        , "redirect_uri":  conf.redirect_uri
        , "scope":         conf.scope
      });
  
      if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
        res.redirect(authUrl);
      } else {  //req.query.error == 'access_denied'
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
          "client_id":      conf.client_id
        , "redirect_uri":   conf.redirect_uri
        , "client_secret":  conf.client_secret
        , "code":           req.query.code
      }, function (err, facebookRes) {
        res.redirect('/UserHasLoggedIn');
      });
    }
}


 var UserHasLoggedIn = (req, res) => {
    res.render("index", {
      title: "Logged In"
    });
  }
  
 
  



module.exports = {
    auth,
    UserHasLoggedIn
};