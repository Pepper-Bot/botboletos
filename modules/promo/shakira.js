var Message = require("../../bot/messages");
var APLICATION_URL_DOMAIN = require("../../config/config_vars")
  .APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require("../../config/config_vars").PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require("../../config/config_vars").FBMESSAGESPAGE;
var Message2 = require("../../bot/generic_buttton");
var request = require("request");
var UserData = require("../../bot/userinfo");
var startShakira = senderId => {
  UserData.getUserLikes(senderId);

  var replies = [
    {
      content_type: "text",
      title: "La bicicleta",
      payload: "la_bicicleta"
    },
    {
      content_type: "text",
      title: "Chantaje",
      payload: "chantaje"
    }
  ];
  Message.quickReply(senderId, "Which is your favorite? ", replies);
};

var sendMessageAndChoiceImage = (senderId, payload) => {
  console.log("escogiendo url de la imagen de Shakira  payload: " + payload);
  var message = "You choose";

  Message.sendMessage(senderId, message).then(() => {
    selectSendImageAndTemplates(senderId, payload);
  });
};

var selectSendImageAndTemplates = (senderId, payload) => {
  console.log("escogiendo url de la imagen de Shakira  payload: " + payload);
  var urlImage = "";
  switch (payload) {
    case "la_bicicleta":
      {
        urlImage = APLICATION_URL_DOMAIN + "images/shakira_songs/bicicleta.png";
        sendImageAndTevoSearch(senderId, urlImage);
      }
      break;
    case "chantaje":
      {
        urlImage = APLICATION_URL_DOMAIN + "images/shakira_songs/chantaje.png";
        sendImageAndTevoSearch(senderId, urlImage);
      }
      break;
    default: {
      urlImage = APLICATION_URL_DOMAIN + "images/shakira_songs/bicicleta.png";
      sendImageAndTevoSearch(senderId, urlImage);
    }
  }
};

var sendImageAndTevoSearch = (senderId, urlImage) => {
  Message.sendImage(senderId, urlImage),
    then(() => {
      startTevo("Shakira", senderId, (mlink = 0));
    });
};

function startTevo(event_name, senderId, mlink = 0) {
  console.log("event_name " + event_name);
  var UserData = require("../../bot/userinfo");
  var UserData2 = require("../../schemas/userinfo");

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
        if (null != foundUser) {
          var position = 0;
          if (mlink == 0) {
            if (foundUser.eventSearchSelected) {
              if (foundUser.eventSearchSelected.length >= 2) {
                let anterior = foundUser.eventSearchSelected.length - 2;
                let actual = foundUser.eventSearchSelected.length - 1;

                let anteriorS = foundUser.eventSearchSelected[anterior];
                let actualS = foundUser.eventSearchSelected[actual];

                if (actualS == anteriorS) {
                  foundUser.showMemore.index1 = foundUser.showMemore.index1 + 1;
                  position = foundUser.showMemore.index1;
                }
              }
            }
          } else {
            foundUser.showMemore.index1 = 0;
          }

          if (event_name == "") {
            let actual = foundUser.eventSearchSelected.length - 1;
            event_name = foundUser.eventSearchSelected[actual];
          }

          var TevoModule = require("../../modules/tevo_request");
          TevoModule.start(senderId, event_name, position, 2);

          foundUser.save(function(err, userSaved) {
            if (!err) {
              console.log(
                "se actualiza el index 1 userSaved.showMemore.index1 " +
                  userSaved.showMemore.index1
              );
            } else {
              console.log("error al actualizar el index 1 ");
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

                User.save();
                console.log(
                  "Guardé el senderId result.fbId>>>> " + result.fbId
                );

                let TevoModule = require("../../modules/tevo_request");
                let position = 0;
                TevoModule.start(senderId, referral, position, 2);
              }

              var name = bodyObj.first_name;
              var greeting = "Hi " + name;
              var messagetxt = greeting + ", what would you like to do?";
              //Message.sendMessage(senderId, message);
              /* INSERT TO MONGO DB DATA FROM SESSION*/
            }
          });
        }
      }
    }
  );
}
module.exports = {
  startShakira,
  sendMessageAndChoiceImage
};
