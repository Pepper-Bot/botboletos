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

var startChirstmasSongs = senderId => {
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
          title: "Mariah y Justin", //
          payload: "find_my_event_mariah"
        },
        {
          content_type: "text",
          title: "Ariana Grande",
          payload: "find_my_event_ariana"
        },
        {
          content_type: "text",
          title: "Katy Perry",
          payload: "find_my_event_katy"
        }
      ];
      var urlAudio =
        APLICATION_URL_DOMAIN + "audio/christmas/christmas_songs.mp3";
      Message.quickReply(senderId, urlAudio, messageText, replies);
      //quickReply(senderId, messageText, replies)
    }
  });
};

var sendMessageAndChoiceImage = (senderId, payload) => {
  console.log("escogiendo url de la imagen de Christmas Songs: " + payload);
  var message = "You chose Katy Perry with her song Every Day Is A Holiday";
  switch (payload) {
    case "find_my_event_mariah":
      {
        message = 'Great! Mariah & Justin´s "All I Want For Christmas Is You"';
      }
      break;

    case "find_my_event_ariana":
      {
        message = 'Great! Ariana Grande´s "Santa Tell Me"';
      }
      break;

    case "find_my_event_katy":
      {
        message = 'Great! Katy Perry´s "Every Day Is A Holiday"';
      }
      break;
  }

  Message.sendMessage(senderId, message).then(response1 => {
    selectSendImageAndTemplates(senderId, payload);
  });
};

var selectSendImageAndTemplates = (senderId, payload) => {
  console.log("escogiendo url de la imagen  " + payload);
  //var messasge = '🎄 😃Thanks for participate. Pepper Bot wishes you a merry Chrismas and brings the best Christmas events for you.'
  var messasge = "🎄 😃 🎁 Go to a Christmas event near you 😃🎁🎅🎄 ";
  var urlImage = "";
  switch (payload) {
    case "find_my_event_mariah":
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/christmas/songs/mariah_justin.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
    case "find_my_event_ariana":
      {
        urlImage = APLICATION_URL_DOMAIN + "images/christmas/songs/ariana.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
    case "find_my_event_katy":
      {
        urlImage = APLICATION_URL_DOMAIN + "images/christmas/songs/katy.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;

    default:
      {
        urlImage =
          APLICATION_URL_DOMAIN + "images/christmas/songs/mariah_justin.jpg";
        sendImageMessage(senderId, urlImage, messasge);
      }
      break;
  }
};

var sendImageMessage = (senderId, urlImage, message) => {
  Message.sendImage(senderId, urlImage).then(() => {
    sendMessageAndChirsmas(senderId, message);
  });
};

var sendAudioQuickReplay = (senderId, urlAudio, messageText, replies) => {
  request(
    {
      url: FBMESSAGESPAGE,
      qs: {
        access_token: PAGE_ACCESS_TOKEN
      },
      method: "POST",
      json: {
        recipient: {
          id: senderId
        },
        message: {
          attachment: {
            type: "audio",
            payload: {
              url: urlAudio
            }
          }
        }
      }
    },
    function(error, response, body) {
      console.log(response);
      if (error) {
        console.log("MAL");
      } else {
        console.log(" sendAudio  BIEN");
        Message.quickReply(senderId, messageText, replies);
      }
    }
  );
};

var sendMessageAndChirsmas = (senderId, message) => {
  Message.sendMessage(senderId, message).then(response1 => {
    Message.typingOn(senderId);

    var eventResults = [];
    Message.typingOn(senderId);
    // simulamos el tipeado
    // enviamos el mensaje

    // Guarda el url cada vez que el usuario hace click en la tarjeta
    var URLAplication = APLICATION_URL_DOMAIN;
    //configuramos los boletos

    var boletos = [
      {
        titulo: "Shakira",
        imagen:
          URLAplication + "images/black-friday/promo/shakira-el-dorado.png",
        subtitulo: "",
        url: mlink + "Shakira"
      },
      {
        titulo: "Katy Perry",
        imagen: URLAplication + "images/black-friday/promo/katy-perry.png",
        subtitulo: "",
        url: mlink + "Katy Perry"
      },
      {
        titulo: "Taylor Swift",
        imagen: URLAplication + "images/christmas/songs/taylorswift.jpg",
        subtitulo: "",
        url: mlink + "Taylor Swift"
      },
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
  startChirstmasSongs,
  sendMessageAndChoiceImage
};
