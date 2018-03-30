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

var startSuperBowl = (senderId, referral) => {
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
              start(senderId);
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

var start = senderId => {
  UserData.getInfo(senderId, function(err, result) {
    console.log("Consultado el usuario de Face !!");
    if (!err) {
      var bodyObj = JSON.parse(result);
      console.log(result);

      var name = bodyObj.first_name;

      let urlImage = APLICATION_URL_DOMAIN + "images/christmas/christmas.png";

      //let messageText = "Hi " + name + ", Which is your favorite Christmas song interpreter?";
      let messageText = "Choose your favorite:";
      var replies = [
        {
          content_type: "text",
          title: "Patriots", //
          payload: "find_my_event_Patriots"
        },
        {
          content_type: "text",
          title: "Broncos",
          payload: "find_my_event_Broncos"
        },
        {
          content_type: "text",
          title: "Seahawks",
          payload: "find_my_event_Seahawks"
        },
        {
          content_type: "text",
          title: "Cowboys",
          payload: "find_my_event_Cowboys"
        },
        {
          content_type: "text",
          title: "Packers",
          payload: "find_my_event_Packers"
        },
        {
          content_type: "text",
          title: "Steelers",
          payload: "find_my_event_Steelers"
        },
        {
          content_type: "text",
          title: "Falcons",
          payload: "find_my_event_Falcons"
        },
        {
          content_type: "text",
          title: "Eagles",
          payload: "find_my_event_Eagles"
        }
      ];
      Message.quickReply(senderId, messageText, replies);
    }
  });
};

var sendMessageAndChoiceImage = (senderId, payload) => {
  console.log("escogiendo url de la imagen de Superbowl " + payload);
  var message = "";
  switch (payload) {
    case "find_my_event_Patriots":
      {
        message = "Great! Patriots";
      }
      break;

    case "find_my_event_Broncos":
      {
        message = "Great! Broncos";
      }
      break;

    case "find_my_event_Seahawks":
      {
        message = "Great! Seahawks";
      }
      break;
    case "find_my_event_Cowboys":
      {
        message = "Great! Cowboys";
      }
      break;

    case "find_my_event_Packers":
      {
        message = "Great! Packers";
      }
      break;

    case "find_my_event_Steelers":
      {
        message = "Great! Steelers";
      }
      break;
    case "find_my_event_Falcons":
      {
        message = "Great! Falcons";
      }
      break;
    case "find_my_event_Eagles":
      {
        message = "Great! Eagles";
      }
      break;
  }

  Message.sendMessage(senderId, message).then(() => {
    selectSendImageAndTemplates(senderId, payload);
  });
};

var selectSendImageAndTemplates = (senderId, payload) => {
  console.log("escogiendo url de la imagen  " + payload);
  //var messasge = ' Thanks for participate. Pepper Bot wishes you a merry Chrismas and brings the best Christmas events for you.'
  var messasge = "Go to the Super Bowl 2018";
  var urlImage = "";
  switch (payload) {
    case "find_my_event_Patriots":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/patriots.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;

    case "find_my_event_Broncos":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/broncos.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;

    case "find_my_event_Seahawks":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/seahawks.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
    case "find_my_event_Cowboys":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/cowboys.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;

    case "find_my_event_Packers":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/packers.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;

    case "find_my_event_Steelers":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/steelers.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
    case "find_my_event_Falcons":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/super_bowl/teams/falcons.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
    case "find_my_event_Eagles":
      {
        urlImage = APLICATION_URL_DOMAIN + "images/super_bowl/teams/eagles.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
  }
};

var sendImageMessage = (senderId, urlImage, message) => {
  Message.sendImage(senderId, urlImage).then(() => {
    var tevoModule = require("../../tevo/tevo");
    tevoModule.startTevoByName(
      "Super Bowl",
      senderId,
      0,
      "🏈 Go to the Super Bowl 2018  🏈"
    );
  });
};

module.exports = {
  startSuperBowl,
  sendMessageAndChoiceImage
};
