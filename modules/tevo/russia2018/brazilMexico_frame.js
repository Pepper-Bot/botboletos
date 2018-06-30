/*
 BRAZIL MEXICO FRAME COPIED FROM SWEDEN MEXICO - JUN 30, 2018
*/

var Message = require("../../../bot/messages");
var Message_2 = require("../../../bot/generic_buttton"); // Define new card layout
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
var user_queries = require("../../../schemas/queries/user_queries");
// Request the users ID from DB API
var startBrazilMexicoFrame = (senderId, referral) => {
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
      // Check if user exists in DB
      if (!err) {
        if (foundUser) {
          foundUser.mlinkSelected = referral; // Update Me Link selected
          foundUser.save((err, foundUserBefore) => {
            if (err) {
              console.log("Error al guardar el usuario");
            } else {
              console.log("usuario actualizado:" + foundUser.mlinkSelected);
              start(senderId);
            }
          });
        } else {
          // If the user is not already in the DB then store it
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

                User.save(); // This is the actual save
                start(senderId);

                User.save((err, foundUserBefore) => {
                  if (err) {
                    console.log("Error al guardar el usuario ");
                  } else {
                    console.log(
                      "usuario guardado:" + foundUserBefore.mlinkSelected
                    );
                    start(senderId);
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

// Here i make this standard me link for frameS ANALOGOUS to someFrame.js

var start = senderId => {
  UserData.getInfo(senderId, function(err, result) {
    console.log("Consultado el usuario de Face !!");
    if (!err) {
      var bodyObj = JSON.parse(result);
      console.log(result);

      var name = bodyObj.first_name;

      //Old shmack - Valentine etc
      //let eventResults = [];
      //let urlLink = 'www.facebook.com/fbcameraeffects/tryit/1148639865272750/'
      // Draw the FB UI Cards and elements

      let buttons = [
        {
          type: "web_url",
          url:
            "www.facebook.com/fbcameraeffects/tryit/200185917257210/",
          title: "Try Mexico Mask"
        },
        {
          type: "web_url",
          url:
            "www.facebook.com/fbcameraeffects/tryit/279727899231592/",
          title: "Try Brazil Mask"
        }
      ];
      let title = "Wear your country colors!";
      Message.listButtons(senderId, title, buttons).then(() => {
        //  Message.getLocation(senderId, 'Check out these games for your team');

        getTicketButtons(senderId);
      });
    }
  });
};

var getTicketButtons = senderId => {
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
    "Don't miss the opening game or your country's debut game:",
    replies
  );
};


module.exports = {
  startBrazilMexicoFrame

};
