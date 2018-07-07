/* This program:

- Stores the user who lands on pepper via M link
- Shows a video: sendVideoMessage
- Shows buttons RussiaListButtons

*/ 

var Message = require("../../../bot/messages");
var APLICATION_URL_DOMAIN = require("../../../config/config_vars")
  .APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require("../../../config/config_vars")
  .PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require("../../../config/config_vars").FBMESSAGESPAGE;
var mlink = require("../../../config/config_vars").mlink.MLINK_BASE + "?ref=";
var Message2 = require("../../../bot/generic_buttton");
var request = require("request");
var UserData = require("../../../bot/userinfo");
var UserData2 = require("../../../schemas/userinfo");
var Message = require("../../../bot/messages");

var startWatchFifaTheme = (senderId, referral, con = true) => {
  UserData2.findOne(
    {
      fbId: senderId
    },
    {},
    {
      sort: {
        sessionStart: -1
      }
    },
    function(err, foundUser) {
      if (!err) {
        if (foundUser) {
          foundUser.mlinkSelected = referral;
          foundUser.save((err, foundUserBefore) => {
            if (err) {
              console.log("Error al guardar el usuario");
            } else {
              console.log("usuario actualizado:" + foundUser.mlinkSelected);
              start(senderId, con);
            }
          });
        } else {
          UserData.getInfo(senderId, function(err, result) {
            console.log("Dentro de UserData");
            if (!err) {
              var bodyObj = JSON.parse(result);
              console.log(result);
              var User = new UserData2();
              {
                User.fbId = senderId;
                User.firstName = bodyObj.first_name;
                User.LastName = bodyObj.last_name;
                User.profilePic = bodyObj.profile_pic;
                User.locale = bodyObj.locale;
                User.timeZone = bodyObj.timezone;
                User.gender = bodyObj.gender;
                User.messageNumber = 1;
                User.mlinkSelected = referral;

                User.save();
                start(senderId, con);

                User.save((err, foundUserBefore) => {
                  if (err) {
                    console.log("Error al guardar el usuario ");
                  } else {
                    console.log(
                      "usuario guardado:" + foundUserBefore.mlinkSelected
                    );
                    start(senderId, con);
                  }
                });
              }
            }
          });
        }
      }
    }
  );
};

var start = (senderId, con = true) => {
  UserData.getInfo(senderId, function(err, result) {
    console.log("Consultado el usuario de Face !!");
    if (!err) {
      var bodyObj = JSON.parse(result);
      console.log(result);

      var name = bodyObj.first_name;
      
      //  ** Video display starts here **

      //let urlImage = APLICATION_URL_DOMAIN + "images/christmas/christmas.png";

      if (con == true) {
        var urlVideo =
          APLICATION_URL_DOMAIN +
          "videos/russia_worldcup/official_music_fifa_world_cup_russia_6.mp4";
        //var message = 'Seasson´s Greetings! And best wishes for the New Year '
        var message = "Ok, Follow the next steps 😄. Step 1.Click the button below which goes to http://pirlotv.es/ Step 2. Open the link of the match you want to watch in another tab, wait and enjoy!! ";

        sendVideoMessage(senderId, message, urlVideo);
      } else {
        sendTemplate(senderId, (message = ""));
      }
      //
    }
  });
};

/**
 * 
 * @param {*} senderId 
 * @param {*} message 
 * @param {*} urlVideo 
 */
var sendVideoMessage = (senderId, message, urlVideo) => {
  Message.sendMessage(senderId, message).then(() => {
    Message.sendVideoMessage(senderId, urlVideo).then(() => {
      Message.sendMessage(senderId, "The video will start itself when ready? Meanwhile.. ").then(
        () => {
          //sendTemplate(senderId);
          RussiaListButtons(senderId);

        }
      );
    });
  });
};

var RussiaListButtons = senderId => {
  var replies = [
    {
      content_type: "text",
      title: "Get Tickets",
      payload: "RUSSIA"
    }/*,
    {
      content_type: "text",
      title: "Arabia",
      payload: "ARABIA"
    }*/
  ];
  Message.quickReply(
    senderId,
    "Before tickets run out. Get your tickets to the Cup",
    replies
  );
};

/*
/**
 * 
 * @param {*} senderId 
 * @param {*} message 
 */
/*
var sendTemplate = (senderId, message = "") => {
  var Message = require("../../../bot/messages");
  // llamamos al modulo de mensajes
  var eventResults = [];
  Message.typingOn(senderId);
  // simulamos el tipeado
  // enviamos el mensaje

  // Guarda el url cada vez que el usuario hace click en la tarjeta
  var URLAplication = APLICATION_URL_DOMAIN;
  //configuramos los boletos
  */
  
 
 

module.exports = {
  startWatchFifaTheme,
  sendVideoMessage,
  start
};
