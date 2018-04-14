const Messages = require("../../bot/generic_buttton");
var APLICATION_URL_DOMAIN = require("../../config/config_vars")
  .APLICATION_URL_DOMAIN;

var APPLICATION_URL_EXTENSION = require("../../config/config_vars")
  .APPLICATION_URL_EXTENSION;

  
var startAccount = senderId => {
  console.log("Entré a startAccount");
  let URLAplication = APLICATION_URL_DOMAIN + "redirect/?u=";
  let urlExtension = `${APPLICATION_URL_EXTENSION}profile?senderId=${senderId}`;

  let eventResults = [];
  let boletos = [
    {
      titulo: "Track your favorite artist",
      imagen: `${APLICATION_URL_DOMAIN}images/account/select_artist_v1.jpg`,
      subtitulo: "Track artist",
      //url: `${URLAplication}${urlExtension} &id=${senderId}`,
      url: `${urlExtension}`
    }
  ];

  for (let i = 0, c = boletos.length; i < c; i++) {
    console.log("i " + i);
    eventResults.push({
      title: boletos[i].titulo,
      image_url: boletos[i].imagen,
      subtitle: boletos[i].subtitulo,
      //"item_url": boletos[i].url,
      default_action: {
        type: "web_url",
        url: boletos[i].url,
        messenger_extensions: true,
        webview_height_ratio: "tall",
        "fallback_url": boletos[i].url
      },
      buttons: [
        {
          type: "web_url",
          url: boletos[i].url,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          title: "Track artists"
          //"payload": "TIBURON" + (i + 1)
        }
      ]
    });

    console.log("events Results >>>>>>>>>>>>>>>" + eventResults[i].url);
  }

  Messages.genericTemplate(senderId, eventResults, "horizontal");
};




var startFaves = senderId => {
  console.log("Entré a startAccount");
  let URLAplication = APLICATION_URL_DOMAIN + "redirect/?u=";
  let urlExtension = `${APPLICATION_URL_EXTENSION}profile/faves/?senderId=${senderId}`;

  let eventResults = [];
  let boletos = [
    {
      titulo: "My Favorites",
      imagen: `${APLICATION_URL_DOMAIN}images/account/select_artist_v1.jpg`,
      subtitulo: "My Favorites",
      //url: `${URLAplication}${urlExtension} &id=${senderId}`,
      url: `${urlExtension}`
    }
  ];

  for (let i = 0, c = boletos.length; i < c; i++) {
    console.log("i " + i);
    eventResults.push({
      title: boletos[i].titulo,
      image_url: boletos[i].imagen,
      subtitle: boletos[i].subtitulo,
      //"item_url": boletos[i].url,
      default_action: {
        type: "web_url",
        url: boletos[i].url,
        messenger_extensions: true,
        webview_height_ratio: "tall",
        "fallback_url": boletos[i].url
      },
      buttons: [
        {
          type: "web_url",
          url: boletos[i].url,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          title: "My Favorites"
          //"payload": "TIBURON" + (i + 1)
        }
      ]
    });

    console.log("events Results >>>>>>>>>>>>>>>" + eventResults[i].url);
  }

  Messages.genericTemplate(senderId, eventResults, "horizontal");
};



module.exports = {
  startAccount,
  startFaves
};
