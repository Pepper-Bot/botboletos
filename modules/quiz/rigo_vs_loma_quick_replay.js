var request = require("request");
var Message = require("../../bot/messages");

module.exports = (function() {
  return {
    send: function(
      senderId,
      title = "Now!.  Do you Want to go to the battle?"
    ) {
      Message.typingOn(senderId);
      Message.markSeen(senderId);
      Message.typingOn(senderId);

      var Message2 = require("../../bot/generic_buttton");

      var eventResults = [];

      var boletos = [
        {
          titulo: "Rigondeaux",
          imagen:
            "https://botboletos-test.herokuapp.com/images/box/rigo-larga.png",
          subtitulo: "4.700",
          url: ""
        },

        {
          titulo: "Lomachenko",
          imagen:
            "https://botboletos-test.herokuapp.com/images/box/loma-larga.png",
          subtitulo: "1.225",
          url: ""
        }
      ];

      for (var i = 0, c = boletos.length; i < c; i++) {
        eventResults.push({
          title: boletos[i].titulo,
          image_url: boletos[i].imagen,
          subtitle: boletos[i].subtitulo,
          //"item_url": boletos[i].url,
          buttons: [
            {
              title: boletos[i].subtitulo,
              type: "web_url",
              url:
                "https://www.messenger.com/t/pepperSharks?ref=Rigondeaux%20vs%20Lomachenko"
            }
          ]
        });

        console.log("events Results >>>>>>>>>>>>>>>" + eventResults[i].url);
      }

      var event_name = "Rigondeaux vs Lomachenko";
      sendResults(senderId, "Results Odds: ", eventResults, event_name);
    }
  };
})();

function sendResults(senderId, message, gButtons, event_name) {
  Message.sendMessage(senderId, message).then(() => {
    listar(senderId, gButtons, event_name);
  });
}

function listar(senderId, gButtons, event_name) {
  Message.genericButton(senderId, gButtons).then(() => {
    startTevo(event_name, senderId, (mlink = 0));
  });
}

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
          TevoModule.start(senderId, event_name, position);

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
                TevoModule.start(senderId, referral, position);
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
