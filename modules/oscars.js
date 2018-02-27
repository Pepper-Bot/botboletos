/* This is a copy of sharkboletos.js

The file merely lines up a number of manually made cards and it redirects to another site
In this case we will be sending users to the woobox campaign to vote on the platform

This will save us time and will be able to track users.

*/

var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN; //for external url

module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    
            Message.sendMessage(senderId, " Welcome to the Oscars 2018, Vote and Join the Oscars!");
            Message.typingOff(senderId);

            // tipeado off

            // Guarda el url cada vez que el usuario hace click en la tarjeta
            var URLAplication = APLICATION_URL_DOMAIN + "redirect/?u="
            //configuramos los boletos


            var boletos = [{
                    "titulo": "1. Best Picture!",
                    "imagen": APLICATION_URL_DOMAIN + "images/oscars/best_picture.png",
                    "subtitulo": "Vote your favorite nominee. Win a new chatbot friend assistant.",
                    "url": URLAplication + "http://woobox.com/2f8mz8 " + '&id=' + senderId


                },

                {
                    "titulo": "2. Best Actor in a Leading Role!",
                    "imagen": APLICATION_URL_DOMAIN + "images/oscar/actor.png",
                    "subtitulo": "Vote your favorite nominee. Win a new chatbot friend assistant.",
                    "url": URLAplication + " http://woobox.com/s8t8ec " + '&id=' + senderId

                },
                {
                    "titulo": "3. Best Actress in a Leading Role!",
                    "imagen": APLICATION_URL_DOMAIN + "images/oscar/actress.png",
                    "subtitulo": "Vote your favorite nominee. Win a new chatbot friend assistant.",
                    "url": URLAplication + "http://woobox.com/hqytee " + '&id=' + senderId

                },

                {
                    "titulo": "4. Directing!",
                    "imagen": APLICATION_URL_DOMAIN + "images/oscars/directing.png",
                    "subtitulo": "Vote your favorite nominee. Win a new chatbot friend assistant.",
                    "url": URLAplication + "http://woobox.com/xdukrr " + '&id=' + senderId

                },

                {
                    "titulo": "5. Best Animated Featured Film!",
                    "imagen": APLICATION_URL_DOMAIN + "images/oscars/animated.png",
                    "subtitulo": "Vote your favorite nominee. Win a new chatbot friend assistant.",
                    "url": URLAplication + "http://woobox.com/uc7mh2 " + '&id=' + senderId

                }



            ];

            // creamos las tarjetas
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
                            "title": "Book"
                            //"payload": "TIBURON" + (i + 1)
                        },
                        {
                            "type": "element_share"
                        }
                    ]
                });



                console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].url);
            }





            console.log('events Results >>>>>>>>>>>>>>>' + eventResults);
            // se las enviamos al cliente

            //enviarMensajeTemplate(senderId);
            //Message.genericButton(senderId, eventResults);


            var GenericButton = require('../bot/generic_buttton');
            GenericButton.genericButtonQuickReplay(senderId, eventResults, "Find something else? ", function () {})


            // dejamos de tipear
            Message.typingOff(senderId);





        }

    };

}();

function elementTemplate() {
    return {
        title: "Leonardo Jaimes Estévez",
        subtitle: "Ingeniero de Telecomuncaciones apasionado de la programación",
        item_url: "http://informaticomanchay.com",
        image_url: "http://arcdn02.mundotkm.com/2015/08/dia-del-leon-261x400.jpg",

        buttons: [
            buttonTemplate('Contactame', 'https://www.facebook.com/profile.php?id=100006489615076'),
            buttonTemplate('Portafolio', 'http://informaticomanchay.com/')
        ]
    }
}

function buttonTemplate(title, url) {
    return {
        type: 'web_url',
        url: url,
        title: title
    }
}

function enviarMensajeTemplate(senderID) {
    var messageData = {
        recipient: {
            id: senderID
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: 'generic',
                    elements: [elementTemplate(), elementTemplate(), elementTemplate(), elementTemplate()]
                }
            }
        }
    }

    callSendAPI(messageData)
}

function callSendAPI(messageData) {
    var request = require('request');
    //api de facebook
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: 'EAASJN3kpCzkBAA7KGHeSOpjEGtgmac84jMjLFU1PKYCgaC1oVUptbwKg1JOyytZAerOpBgNiTcnBxBzTVDeX2Py4Kdb7DJz67ZCiKPeHUZA9hCp6jtVnQi319i404nUxOn41Stm21SZAl6lZAl6IZB7VJDRPDCGQW3VqWxmhzbJQZDZD'
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