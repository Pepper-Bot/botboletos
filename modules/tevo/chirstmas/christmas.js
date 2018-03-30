var Message = require("../../../bot/messages");
var APLICATION_URL_DOMAIN = require("../../../config/config_vars")
  .APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require("../../../config/config_vars")
  .PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require("../../../config/config_vars").FBMESSAGESPAGE;
var mlink = require("../../../config/config_vars").mlink.shark;
var Message2 = require("../../../bot/generic_buttton");
var request = require("request");
var UserData = require("../../../bot/userinfo");
var UserData2 = require("../../../schemas/userinfo");
var Message = require("../../../bot/messages");

var startChirstmas = senderId => {
  UserData.getInfo(senderId, function(err, result) {
    console.log("Consultado el usuario de Face !!");
    if (!err) {
      var bodyObj = JSON.parse(result);
      console.log(result);

      var name = bodyObj.first_name;

      let urlImage = APLICATION_URL_DOMAIN + "images/christmas/christmas.png";

      let message =
        "Hi " + name + ",  Christmas is here! Check out this SUPER PROMOS.";
      sendImageMessage(senderId, urlImage, message);
    }
  });
};

var sendImageMessage = (senderId, urlImage, message) => {
  Message.sendImage(senderId, urlImage).then(response1 => {
    sendMessageAndChirsmas(senderId, message);
  });
};

var sendMessageAndChirsmas = (senderId, message) => {
  Message.sendMessage(senderId, message).then(response1 => {
    // llamamos al modulo de mensajes
    var eventResults = [];
    Message.typingOn(senderId);
    // simulamos el tipeado
    // enviamos el mensaje

    // Guarda el url cada vez que el usuario hace click en la tarjeta
    var URLAplication = APLICATION_URL_DOMAIN;
    //configuramos los boletos

    var boletos = [
      {
        titulo: "A Christmas Carol",
        imagen: URLAplication + "images/christmas/promo/a-christmas-carol.jpg",
        subtitulo: "",
        url: mlink + "A Christmas Carol"
      },
      {
        titulo: "Radio City Christmas Spectacular",
        imagen:
          URLAplication + "images/christmas/promo/christmas-spectacular.jpg",
        subtitulo: "",
        url: mlink + "Radio City Christmas Spectacular"
      },
      {
        titulo: "Disney On Ice: Dream Big",
        imagen:
          URLAplication + "images/christmas/promo/disney-on-ice-dream-big.jpg",
        subtitulo: "",
        url: mlink + "Disney On Ice: Dream Big"
      },
      {
        titulo: "Elf - The Musical",
        imagen: URLAplication + "images/christmas/promo/elf-the-musical.jpg",
        subtitulo: "",
        url: mlink + "Elf - The Musical"
      },
      {
        titulo: "Anastasia",
        imagen: URLAplication + "images/christmas/promo/anastasia.png",
        subtitulo: "",
        url: mlink + "Anastasia"
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
            title: "View " + boletos[i].titulo,
            payload: boletos[i].titulo
          },
          {
            type: "element_share"
          }
        ]
      });
    }
    let counter = 0;
    Message.genericButton(senderId, eventResults);

    console.log("events Results >>>>>>>>>>>>>>>" + eventResults);

    Message.typingOff(senderId);
  });
};

module.exports = {
  startChirstmas
};
