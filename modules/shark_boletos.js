module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    
            Message.sendMessage(senderId, "Sharks Tank EnVivo® Episode 51 - with $50k in prizes!");
            Message.typingOff(senderId);

            // tipeado off


            //configuramos los boletos
            var boletos =
                [
                    {
                        "titulo": "Startups Showcase Early Supporter:",
                        "imagen": "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F34398973%2F221981936048%2F1%2Foriginal.jpg?w=800&rect=0%2C0%2C1680%2C840&s=9fff7c3a5c78f70de08659dd5999e766",
                        "subtitulo": "Timely Supporter. \"you are fantastic \"  we welcome you to the monthle Live Sharks  Tank demon + pitch expo & VIP party, its a smashing success and amazing event! you will enjoy the networking, pitching, and then more networking at the VIP -after party! be sure to bring lots of bussines cards! ",
                        "url": "https://www.eventbrite.com/register?orderid=8a613b028e8711e7b25a12a0e100dc36&client_token=3a9b3506b08345e08ec3bcd25e2abde3&eid=37138315702"

                    },


                    {
                        "titulo": "Same day including at the door Sales",
                        "imagen": "http://cdn.images.express.co.uk/img/dynamic/78/590x/Great-White-shark-Evans-Head-595103.jpg",
                        "subtitulo": "Pase General + Campamento (900MX)",
                        "url": "https://www.marinahuerta.com/magicon"

                    },
                    {
                        "titulo": "Startups on the Stage \"Bring your A-Game!\"",
                        "imagen": "http://cdn.images.express.co.uk/img/dynamic/78/590x/Great-White-shark-Evans-Head-595103.jpg",
                        "subtitulo": "Pase General + Campamento (900MX)",
                        "url": "https://www.marinahuerta.com/magicon"

                    },

                    {
                        "titulo": "Startups Showcase Sponsor Bronze I",
                        "imagen": "http://cdn.images.express.co.uk/img/dynamic/78/590x/Great-White-shark-Evans-Head-595103.jpg",
                        "subtitulo": "Pase General + Campamento (900MX)",
                        "url": "https://www.marinahuerta.com/magicon"

                    },
                    {
                        "titulo": "Startups Showcase Sponsor Bronze II",
                        "imagen": "http://cdn.images.express.co.uk/img/dynamic/78/590x/Great-White-shark-Evans-Head-595103.jpg",
                        "subtitulo": "Pase General + Campamento (900MX)",
                        "url": "https://www.marinahuerta.com/magicon"

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
                            "type":"postback",
                           // "url": boletos[i].url,
                            "title": "Reservar",
                            "payload": "TIBURON"+ (i+1)
                        }
                    ]
                });



                console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].title);
            }





            console.log('events Results >>>>>>>>>>>>>>>' + eventResults);
            // se las enviamos al cliente

            //enviarMensajeTemplate(senderId);
            Message.genericButton(senderId, eventResults);


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