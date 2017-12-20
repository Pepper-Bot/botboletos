var Message = require('../../../bot/messages');
var APLICATION_URL_DOMAIN = require('../../../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../../../config/config_vars').PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require('../../../config/config_vars').FBMESSAGESPAGE
var mlink = require('../../../config/config_vars').mlink.MLINK_BASE + "?ref="
var Message2 = require('../../../bot/generic_buttton');
var request = require('request');
var UserData = require('../../../bot/userinfo');
var UserData2 = require('../../../schemas/userinfo');
var Message = require('../../../bot/messages');


var startChirstmasSongs = (senderId) => {

    UserData.getInfo(senderId, function (err, result) {
        console.log('Consultado el usuario de Face !!');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;

            let urlImage = APLICATION_URL_DOMAIN + 'images/christmas/christmas.png';


            let messageText = "Hi " + name + ", Which is your favorite Christmas song interpreter?";
            var replies = [{
                    "content_type": "text",
                    "title": "Mariah y Justin", //
                    "payload": "find_my_event_mariah"

                },
                {
                    "content_type": "text",
                    "title": "Ariana Grande",
                    "payload": "find_my_event_ariana"
                },
                {
                    "content_type": "text",
                    "title": "Katy Perry",
                    "payload": "find_my_event_katy"
                }
            ];
            quickReply(senderId, messageText, replies)

        }
    });

}


function quickReply(senderId, messageText, replies) {
    request({
        url: FBMESSAGESPAGE,
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: {
            "recipient": {
                "id": senderId
            },
            "message": {
                "text": messageText,
                "quick_replies": replies
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log("BIEN")
            //sendYoutubeVideo(senderId)
            //sendVideoMessage(senderId);
        }
    });
}


var sendMessageAndChoiceImage = (senderId, payload) => {
    console.log("escogiendo url de la imagen de Christmas Songs: " + payload)
    var message = "You chose Katy Perry with her song Every Day Is A Holiday"
    switch (payload) {

        case "find_my_event_mariah":
            {
                message = 'Great! Mariah and Justin "All I Want For Christmas Is You"'
            }
            break;

        case "find_my_event_ariana":
            {
                message = 'Great! Ariana Grande "Santa Tell Me"'
            }
            break;

        case "find_my_event_katy":
            {
                message = 'Great! Katy Perry "Every Day Is A Holiday"'
            }
            break;

    }


    request({
        url: FBMESSAGESPAGE,
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            }
        }
    }, function (error, response, body) {
        if (error) {
            console.log("Error al enviar el mensaje")
        } else {
            selectSendImageAndTemplates(senderId, payload)
        }
    });
}

var selectSendImageAndTemplates = (senderId, payload) => {
    console.log("escogiendo url de la imagen  " + payload)
    var messasge = '🎄 Thanks for participate. Pepper Bot wishes you a merry Chrismas and brings the best Christmas events for you.'
    var urlImage = '';
    switch (payload) {
        case "find_my_event_mariah":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/christmas/songs/mariah_justin.jpg'
                sendImageMessage(senderId, urlImage, messasge)
            }
            break;
        case "find_my_event_ariana":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/christmas/songs/ariana.jpg'
                sendImageMessage(senderId, urlImage, messasge)
            }
            break;
        case "find_my_event_katy":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/christmas/songs/katy.jpg'
                sendImageMessage(senderId, urlImage, messasge)
            }
            break;

        default:
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/christmas/songs/mariah_justin.jpg'
                sendImageMessage(senderId, urlImage, messasge)
            }
            break;
    }


}




var sendImageMessage = (senderId, urlImage, message) => {
    request({
        url: FBMESSAGESPAGE,
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            "recipient": {
                "id": senderId
            },
            "message": {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": urlImage
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" sendImage  BIEN")
            sendMessageAndChirsmas(senderId, message)

        }
    });
}



var sendMessageAndChirsmas = (senderId, message) => {
    request({
        url: FBMESSAGESPAGE,
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            }
        }
    }, function (error, response, body) {
        if (error) {
            return false;
        } else {

            var Message = require('../../../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    


            // Guarda el url cada vez que el usuario hace click en la tarjeta
            var URLAplication = APLICATION_URL_DOMAIN
            //configuramos los boletos


            var boletos = [{
                    "titulo": "A Christmas Carol",
                    "imagen": URLAplication + "images/christmas/promo/a-christmas-carol.jpg",
                    "subtitulo": "",
                    "url": mlink + "A Christmas Carol"
                },
                {
                    "titulo": "Radio City Christmas Spectacular",
                    "imagen": URLAplication + "images/christmas/promo/christmas-spectacular.jpg",
                    "subtitulo": "",
                    "url": mlink + "Radio City Christmas Spectacular"

                },
                {
                    "titulo": "Disney On Ice: Dream Big",
                    "imagen": URLAplication + "images/christmas/promo/disney-on-ice-dream-big.jpg",
                    "subtitulo": "",
                    "url": mlink + "Disney On Ice: Dream Big"

                },
                {
                    "titulo": "Elf - The Musical",
                    "imagen": URLAplication + "images/christmas/promo/elf-the-musical.jpg",
                    "subtitulo": "",
                    "url": mlink + "Elf - The Musical"
                },
                {
                    "titulo": "Anastasia",
                    "imagen": URLAplication + "images/christmas/promo/anastasia.png",
                    "subtitulo": "",
                    "url": mlink + "Anastasia"
                },

            ];

            // creamos las tarjetas
            for (let i = 0, c = boletos.length; i < c; i++) {

                eventResults.push({
                    "title": boletos[i].titulo,
                    "image_url": boletos[i].imagen,
                    "subtitle": boletos[i].subtitulo,
                    "default_action": {
                        "type": "web_url",
                        "url": boletos[i].url //,

                    },
                    "buttons": [{
                            "type": "postback",
                            "title": "View " + boletos[i].titulo,
                            "payload": boletos[i].titulo

                        },
                        {
                            "type": "element_share"
                        }
                    ]
                })

            }
            let counter = 0;
            /*for (let i = 0; i < eventResults.length; i++) {
                let search = eventResults[i].title;
                 googleImage(search).then((images) => {
                     eventResults[i].image_url = images[0].url;
                     if (eventResults[i].image_url == "") {
                         eventResults[i].image_url = images[1].url;
                     }
                     counter++;
                     if (counter == eventResults.length - 1) {
                         Message.genericButton(senderId, eventResults);
                     }
                 });
                console.log("urlimage " + eventResults[i].image_url)
            }*/


            Message.genericButton(senderId, eventResults);




            console.log('events Results >>>>>>>>>>>>>>>' + eventResults);

            Message.typingOff(senderId);


        }
    });
}






module.exports = {
    startChirstmasSongs,
    sendMessageAndChoiceImage,
}