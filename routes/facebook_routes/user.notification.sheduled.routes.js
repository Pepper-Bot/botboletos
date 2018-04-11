const userNotificationSheduledRoutes = require("express").Router();
var userQueries = require("../../db/queries/user.queries");
var userSpotifyQueries = require("../../db/queries/user.spotify.queries");
var userFacebookQueries = require("../../db/queries/user.facebook.queries");
var artistQueries = require("../../db/queries/artist.queries");
var userNotificationQueries = require("../../db/queries/user.notification.sheduled.queries")

var fb_me_send_account = require("../../requests/facebook_requests/me.send.account");
var fbComponents = require("../../requests/facebook_requests/me.send.fb.components");

var moment = require("moment");

/**
 *  @argument ruta: http://localhost:8888/fb/send_artists_selector/1461377663955819
 */
userNotificationSheduledRoutes
  .route("/send_artists_selector/:fbId")
  .get(function(req, res) {
    var senderId = req.params.fbId;
    fb_me_send_account
      .sendMyAccount(senderId)
      .then(response => {
        res.status(200).send(response);
      })
      .catch(error => {
        console.log(error);
      });
  });

/**
 *  @argument ruta: http://localhost:8888/fb/send_artists_selector_all
 */
userNotificationSheduledRoutes
  .route("/send_artists_selector_all")
  .get(function(req, res) {
    var usuarios = [
      {
        _id: {
          fbId: "1185145998253428",
          lastName: "Russi",
          firstName: "Arjumand"
        },
        cantidad: 7.0
      },
      {
        _id: {
          fbId: "1705877032758862",
          lastName: "Jaimes Estévez",
          firstName: "Leo"
        },
        cantidad: 1.0
      },
      {
        _id: {
          fbId: "1253295621432887",
          lastName: "Silver",
          firstName: "Mike"
        },
        cantidad: 19.0
      },
      {
        _id: {
          fbId: "1461377663955819",
          lastName: "Hernández Silveira",
          firstName: "Mariel"
        },
        cantidad: 32.0
      },
      {
        _id: {
          fbId: "1364167447042154",
          lastName: "Russi",
          firstName: "Armando"
        },
        cantidad: 32.0
      }
    ];
    
    // userQueries.getUsersGroupByFBId().then(usuarios => {
    let counter = 0;
    for (let i = 0; i < usuarios.length; i++) {
      let usuario = usuarios[i]._id;
      console.log(usuario);
      if (usuario.fbId) {
        fb_me_send_account
          .sendMyAccount(usuario.fbId)
          .then(response => {
            counter++;
            if (counter === usuarios.length - 1) {
              res.status(200).send({ mensaje: "Terminé !!!" });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        counter++;
        if (counter === usuarios.length - 1) {
          res.status(200).send({ mensaje: "Terminé !!!" });
        }
      }
    }

    //});
  });

/**
 *  @argument ruta: https://botboletos-test.herokuapp.com/fb/notifications
 */
userNotificationSheduledRoutes
  .route("/notifications")
  .get(function(req, res) {
    
    userNotificationQueries.sendDailyNotification().then(()=>{
            
      res.status(200).send({ mensaje: "Terminé !!!" });

    }).catch((error)=>{
      res.status(200).send({ error: "error !!!" });

    })




  });

module.exports = userNotificationSheduledRoutes;
