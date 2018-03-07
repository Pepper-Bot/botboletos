var Message = require('../../../bot/messages');
var APLICATION_URL_DOMAIN = require('../../../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../../../config/config_vars').PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require('../../../config/config_vars').FBMESSAGESPAGE
var Message2 = require('../../../bot/generic_buttton');
var request = require('request');
var UserData = require('../../../bot/userinfo');





var startChampionsLeagueFrame = (senderId) => {
    var replies = [{
            "content_type": "text",
            "title": "Real Madrid",
            "payload": "REAL_MADRID"

        },
        {
            "content_type": "text",
            "title": "París Saint-Germain",
            "payload": "PARIS_SAINT_GERMAN"
        }
    ];
    sendQuickReplay(senderId, "Which is your favorite? ", replies);
}


var startBarcaVsChelsea = (senderId) => {
    var replies = [{
            "content_type": "text",
            "title": "Barcelona",
            "payload": "BARCELONA"

        },
        {
            "content_type": "text",
            "title": "Chelsea",
            "payload": "CHELSEA"
        }
    ];
    sendQuickReplay(senderId, "Which is your favorite? ", replies);
}


var sendQuickReplay = (senderId, messageText, replies) => {
    var messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": messageText,
            "quick_replies": replies
        }
    }
    callSendAPI(messageData)

}

function callSendAPI(messageData) {
    //api de facebook
    request({
        uri: FBMESSAGESPAGE,
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData
    }, function (error, response, data) {
        if (error)
            console.log('No es posible enviar el mensaje')
        else
            console.log('Mensaje enviado')
    })
}



module.exports = {
    startChampionsLeagueFrame, startBarcaVsChelsea

}