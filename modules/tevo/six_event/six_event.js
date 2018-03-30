var request = require("request");
var Message = require("../../../bot/messages");

module.exports = (function() {
  return {
    start: function(senderId) {
      var UserData = require("../../../bot/userinfo");
      var UserData2 = require("../../../schemas/userinfo");

      let urlImage =
        "https://botboletos-test.herokuapp.com/images/black-friday/black-friday.jpg";

      UserData.getInfo(senderId, function(err, result) {
        console.log("Consultado el usuario de Face !!");
        if (!err) {
          var bodyObj = JSON.parse(result);
          console.log(result);

          var name = bodyObj.first_name;

          let message =
            "Hi " + name + " Black Friday is here! Check out this SUPER PROMOS";
          sendImageMessage(senderId, urlImage, message);
        }
      });
    }
  };
})();

var googleImage = search => {
  return new Promise((resolve, reject) => {
    var gis = require("g-i-s");
    gis(search, logResults);

    function logResults(error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    }
  });
};

function sendMessageAndBlackFridayPromo(senderId, message) {
  Message.sendMessage(senderId, message).then(() => {
    // llamamos al modulo de mensajes
    var eventResults = [];
    Message.typingOn(senderId);
    // simulamos el tipeado
    // enviamos el mensaje

    // tipeado off

    // Guarda el url cada vez que el usuario hace click en la tarjeta
    var URLAplication = "https://botboletos-test.herokuapp.com/redirect/?u=";
    //configuramos los boletos
    var mlink = "https://www.messenger.com/t/pepperSharks?ref=";

    var boletos = [
      {
        titulo: "Shakira",
        imagen: "",
        subtitulo: "",
        url: mlink + "Shakira"
      },
      {
        titulo: "Katy Perry",
        imagen: "",
        subtitulo: "",
        url: mlink + "Katy Perry"
      },
      {
        titulo: "Bruno Mars",
        imagen: "",
        subtitulo: "",
        url: mlink + "Bruno Mars"
      },
      {
        titulo: "Wicked",
        imagen: "",
        subtitulo: "",
        url: mlink + "Wicked"
      },
      {
        titulo: "Disney On Ice",
        imagen: "",
        subtitulo: "",
        url: mlink + "Disney On Ice"
      },
      {
        titulo: "The Phantom of the Opera",
        imagen: "",
        subtitulo: "",
        url: mlink + "Disney On Ice"
      }
    ];

    // creamos las tarjetas
    for (let i = 0, c = boletos.length; i < c; i++) {
      eventResults.push({
        title: boletos[i].titulo,
        image_url: boletos[i].imagen,
        subtitle: boletos[i].subtitulo,
        default_action: {
          type: "web_url",
          url: boletos[i].url //,
        },
        buttons: [
          {
            type: "postback",
            title: boletos[i].titulo,
            payload: boletos[i].titulo
          },
          {
            type: "element_share"
          }
        ]
      });
    }
    let counter = 0;
    for (let i = 0; i < eventResults.length; i++) {
      let search = eventResults[i].title;
      googleImage(search).then(images => {
        eventResults[i].image_url = images[0].url;
        if (eventResults[i].image_url == "") {
          eventResults[i].image_url = images[1].url;
        }
        counter++;
        if (counter == eventResults.length - 1) {
          Message.genericButton(senderId, eventResults);
        }
      });
    }

    console.log("events Results >>>>>>>>>>>>>>>" + eventResults);

    Message.typingOff(senderId);
  });
}

var sendImageMessage = (senderId, urlImage, message) => {
  Message.sendImageMessage(senderId, urlImage).then(() => {
    sendMessageAndBlackFridayPromo(senderId, message);
  });
};
