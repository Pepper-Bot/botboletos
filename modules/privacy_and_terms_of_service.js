var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var Message = require('../bot/messages');





/**
 * 
 * @param {*} senderId 
 * @description inicia terms of service user intent
 * 
 */
var startTermsOfService = (senderId) => {
    var eventResults = [];
    Message.typingOn(senderId);
    Message.sendMessage(senderId, "Terms of service:", "terms-of-service").then(() => {
        Message.typingOff(senderId);
        var URLAplication = APLICATION_URL_DOMAIN + "redirect/?u="
        var boletos = [{
            "titulo": "Terms of service",
            "imagen": APLICATION_URL_DOMAIN + "images/privacy_terms/terms_and_conditions.png",
            "subtitulo": "We follow GDPR.",
            "url": URLAplication + "http://business.joinpepper.com/terms-of-service/ " + '&id=' + senderId


        }, ];
        for (var i = 0, c = boletos.length; i < c; i++) {
            eventResults.push({
                "title": boletos[i].titulo,
                "image_url": boletos[i].imagen,
                "subtitle": boletos[i].subtitulo,
                //"item_url": boletos[i].url,
                "default_action": {
                    "type": "web_url",
                    "url": boletos[i].url //,
                    //"messenger_extensions": true//,
                    // "webview_height_ratio": "tall",
                    // "fallback_url": boletos[i].url
                },
                "buttons": [{
                        "type": "web_url",
                        "url": boletos[i].url,
                        "title": "View"
                        //"payload": "TIBURON" + (i + 1)
                    },
                    {
                        "type": "element_share"
                    }
                ]
            });
        }
        console.log('terms-of-service intent' + eventResults);
        Message.genericButton(senderId, eventResults);
        Message.typingOff(senderId);
    })
}



/**
 * 
 * @param {*} senderId 
 * @description inicia terms of privacy policy
 * 
 */
var startPrivacyPolicy = (senderId) => {
    var eventResults = [];
    Message.typingOn(senderId);
    Message.sendMessage(senderId, "Privacy Policy:", "privacy-policy").then(() => {
        Message.typingOff(senderId);
        var URLAplication = APLICATION_URL_DOMAIN + "redirect/?u="
        var boletos = [{
            "titulo": "Privacy Policy",
            "imagen": APLICATION_URL_DOMAIN + "images/privacy_terms/security.png",
            "subtitulo": "You are protected. We follow GDPR.",
            "url": URLAplication + "http://business.joinpepper.com/privacy-policy/ " + '&id=' + senderId


        }, ];
        for (var i = 0, c = boletos.length; i < c; i++) {
            eventResults.push({
                "title": boletos[i].titulo,
                "image_url": boletos[i].imagen,
                "subtitle": boletos[i].subtitulo,
                //"item_url": boletos[i].url,
                "default_action": {
                    "type": "web_url",
                    "url": boletos[i].url //,
                    //"messenger_extensions": true//,
                    // "webview_height_ratio": "tall",
                    // "fallback_url": boletos[i].url
                },
                "buttons": [{
                        "type": "web_url",
                        "url": boletos[i].url,
                        "title": "View"
                        //"payload": "TIBURON" + (i + 1)
                    },
                    {
                        "type": "element_share"
                    }
                ]
            });
        }
        console.log('terms-of-service intent' + eventResults);
        Message.genericButton(senderId, eventResults);
        Message.typingOff(senderId);
    })
}

module.exports = {
    startTermsOfService,
    startPrivacyPolicy
}