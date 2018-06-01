var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var Message = require('../bot/messages');
var APPLICATION_URL_EXTENSION = require("../config/config_vars")
    .APPLICATION_URL_EXTENSION;


/**
 * 
 * @param {*} senderId 
 * @description startFavesNotificationsOnOff
 */
var startFavesNotificationsOnOff = senderId => {
    Message.sendMessage(senderId, "You can switch notifications on/off in my favorites:", "notifications-on-of").then(() => {
        console.log("Entré a startFavesNotificationsOnOff");
        let URLAplication = APLICATION_URL_DOMAIN + "redirect/?u=";
        let urlExtension = `${APPLICATION_URL_EXTENSION}profile/faves/?senderId=${senderId}`;
        let eventResults = [];
        let boletos = [{
            titulo: "My Favorites",
            imagen: `${APLICATION_URL_DOMAIN}images/account/faves_image.jpg`,
            subtitulo: "Set your prefered music, concerts and events",
            //url: `${URLAplication}${urlExtension} &id=${senderId}`,
            url: `${urlExtension}`
        }];

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
                    //fallback_url: boletos[i].url
                },
                buttons: [{
                    type: "web_url",
                    url: boletos[i].url,
                    messenger_extensions: true,
                    webview_height_ratio: "tall",
                    title: "My Favorites"
                    //"payload": "TIBURON" + (i + 1)
                }]
            });


        }

        Message.genericButton(senderId, eventResults);
    })
};

module.exports = {
    startFavesNotificationsOnOff
}