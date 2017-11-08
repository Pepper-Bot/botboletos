module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    
            Message.sendMessage(senderId, "Sharks Tank EnVivo® Episode 53 - with $50k in prizes!");
            Message.typingOff(senderId);

            // tipeado off
            
            // Guarda el url cada vez que el usuario hace click en la tarjeta
            var URLAplication = "https://botboletos-test.herokuapp.com/redirect/?u="
            //configuramos los boletos
            
 
            var boletos =
                [
                    {
                        "titulo": "Discount - Limited Time",
                        "imagen": "https://botboletos-test.herokuapp.com/images/sharks_image_discount.jpg",
                        "subtitulo": "Live the Sharks Tank experience. You can also pitch and Win 50K",
                        "url": URLAplication + "https://www.eventbrite.com/e/sharks-tank-envivo-episode-53-with-50k-in-prizes-tickets-39644885921?discount=Entrepreneur " + '&id=' + senderId
                                               
												
                    },


                    {
                        "titulo": "General Admission - $20",
                        "imagen": "https://botboletos-test.herokuapp.com/images/sharks_tank_16sec_video_attendees.png",
                        "subtitulo": "Bring cards and network w Bay Area investors and entrepreneurs",
                        "url": URLAplication + "https://www.eventbrite.com/e/sharks-tank-envivo-episode-53-with-50k-in-prizes-tickets-39644885921 " + '&id=' + senderId

                    },
                    {
                        "titulo": "Startups - $150",
                        "imagen": "https://botboletos-test.herokuapp.com/images/sharks_Fb_image_participant.png",
                        "subtitulo": "PPitch your idea and Win 50K. Get Funded this Friday.",
                        "url": URLAplication + "https://www.eventbrite.com/e/sharks-tank-envivo-episode-53-with-50k-in-prizes-tickets-39644885921 " + '&id=' + senderId

                    },

                    {
                        "titulo": "Sponsors - from $500",
                        "imagen": "https://botboletos-test.herokuapp.com/images/sharks_Fb_image_sponsor.png",
                        "subtitulo": "Get your logo in front of 50 thousand people. Get a VIP table and join the smashing party.",
                        "url": URLAplication + "https://www.eventbrite.com/e/sharks-tank-envivo-episode-53-with-50k-in-prizes-tickets-39644885921 " + '&id=' + senderId

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
                        "url": boletos[i].url//,
                        //"messenger_extensions": true//,
                        // "webview_height_ratio": "tall",
                        // "fallback_url": boletos[i].url
                    },
                    "buttons": [
                        {
                            "type":"web_url",
                            "url": boletos[i].url,
                            "title": "Reservar"
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
            GenericButton.genericButtonQuickReplay(senderId, eventResults, "Find something else? ", "horizontal")


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
        qs: { access_token: 'EAASJN3kpCzkBAA7KGHeSOpjEGtgmac84jMjLFU1PKYCgaC1oVUptbwKg1JOyytZAerOpBgNiTcnBxBzTVDeX2Py4Kdb7DJz67ZCiKPeHUZA9hCp6jtVnQi319i404nUxOn41Stm21SZAl6lZAl6IZB7VJDRPDCGQW3VqWxmhzbJQZDZD' },
        method: 'POST',
        json: messageData
    }, function (error, response, data) {
        if (error)
            console.log('No es posible enviar el mensaje')
        else
            console.log('Mensaje enviado')
    })
}
