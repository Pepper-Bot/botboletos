const facebookRoutes = require("express").Router();
var facebookMenu = require("../../requests/facebook_requests/menu");
var facebookComponet = require("../../requests/facebook_requests/me.send.fb.components");
var facebookUserArtists = require("../../requests/facebook_requests/me.send.fb.user.artists");
var  Messages = require("../../requests/facebook_requests/messages")
var userQueries = require("../../db/queries/user.queries")
var userNotificationMinutes = require("../../db/queries/user.notifications.minutes.queries")
/**
 * @argument ruta: http://localhost:8888/fb/create-shark-menu
 */
facebookRoutes.route("/create-shark-menu").get(function(req, res) {
  let PAGE_ACCES_TOKEN_SHARK =
    "EAASJN3kpCzkBAA7KGHeSOpjEGtgmac84jMjLFU1PKYCgaC1oVUptbwKg1JOyytZAerOpBgNiTcnBxBzTVDeX2Py4Kdb7DJz67ZCiKPeHUZA9hCp6jtVnQi319i404nUxOn41Stm21SZAl6lZAl6IZB7VJDRPDCGQW3VqWxmhzbJQZDZD";

  facebookMenu.addWhitelistedDomains(PAGE_ACCES_TOKEN_SHARK).then(response => {
    facebookMenu
      .deleteAndCreatePersistentMenu(PAGE_ACCES_TOKEN_SHARK)
      .then(response => {
        facebookMenu
          .createPersistentMenu(PAGE_ACCES_TOKEN_SHARK)
          .then(response => {
            res.status(200).send(response);
          });
      });
  });
});



/**
 * @argument ruta: http://localhost:8888/fb/create-pepper-menu
 */
facebookRoutes.route("/create-pepper-menu").get(function(req, res) {
  let PAGE_ACCES_TOKEN_SHARK =
    "EAAWdEPleTaMBAGXt4gC3YnRmlAq52L2U4urrPci7HZArDubxIy8PNQiA2u3E3m4cLlMYZCZCmidKCS3uVqh41RQBotUlmkLcUs7xlsAr3s9zmCZCvjTyxeo1CZBcfppidZBzwSb95YSd3Ew5aEPxz1yP2IZBiJrUzZAmbe1A2tgOjQZDZD";

  facebookMenu.addWhitelistedDomains(PAGE_ACCES_TOKEN_SHARK).then(response => {
    facebookMenu
      .deleteAndCreatePersistentMenu(PAGE_ACCES_TOKEN_SHARK)
      .then(response => {
        facebookMenu
          .createPersistentMenu2(PAGE_ACCES_TOKEN_SHARK)
          .then(response => {
            res.status(200).send(response);
          });
      });
  });
});




facebookRoutes.route("/send_message").post(function(req, res) {
  var body = req.body;
  let senderId = body.senderId;
  let text = body.text;
  facebookComponet
    .sendMessage(senderId, text)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});


/**
 * https://botboletos-test.herokuapp.com/fb/send_generic_template/1705877032758862
 */
facebookRoutes.route("/send_generic_template/:senderId").get(function(req, res) {
    let senderId = req.params.senderId;
    facebookUserArtists
      .buildUserArtistGenericTemplate(senderId)
      .then(elementsC => {
        res.status(200).send(elementsC);
      });

  });



  /**
 * http://localhost:8888/fb/send_location/1705877032758862
 */
facebookRoutes.route("/send_location/:senderId").get(function(req, res) {
  let senderId = req.params.senderId;
  userQueries.createUpdateUserDatas(senderId, "notification1").then((userDataModified)=>{
     
    Messages.getLocation(senderId, "Great, now we know each other better. Would you like to catch a show?").then((response)=>{
      res.status(200).send(response);
    })
  })
});

 





  

module.exports = facebookRoutes;
