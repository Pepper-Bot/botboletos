const Messages = require("../../bot/generic_buttton");
var APLICATION_URL_DOMAIN = require("../../config/config_vars")
  .APLICATION_URL_DOMAIN;

  var APPLICATION_URL_EXTENSION = require("../../config/config_vars")
  .APPLICATION_URL_EXTENSION;



var startAccount = senderId => {
  var URLAplication = APLICATION_URL_DOMAIN + "redirect/?u=";
 var urlExtension = `${APPLICATION_URL_EXTENSION}profile?senderId=${senderId}` 

  var boletos = [
    {
      titulo: "My Account",
      imagen: `${APLICATION_URL_DOMAIN}images/account/sharks_image_discount_20.jpg`,
      subtitulo: "My Account",
      url: `${URLAplication}${urlExtension} &id=${senderId}`
    }
  ];


  for (var i = 0, c = boletos.length; i < c; i++) {
    eventResults.push({
        "title": boletos[i].titulo,
        "image_url": boletos[i].imagen,
        "subtitle": boletos[i].subtitulo,
        //"item_url": boletos[i].url,
        "default_action": {
            "type": "web_url",
            "url": boletos[i].url ,
             "messenger_extensions": true,
             "webview_height_ratio": "tall"
            // "fallback_url": boletos[i].url
        },
        "buttons": [{
                "type": "web_url",
                "url": boletos[i].url,
                "title": "Select your favorite artists"
                //"payload": "TIBURON" + (i + 1)
            }
        ]
    });



    console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].url);
}




  Messages.genericTemplate(senderId, eventResults, "horizontal");
};

module.exports = {
  startAccount
};
