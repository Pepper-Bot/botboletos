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


var startVegasShow = (senderId, referral) => {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                foundUser.mlinkSelected = referral
                foundUser.save((err, foundUserBefore) => {
                    if (err) {
                        console.log('Error al guardar el usuario');
                    } else {
                        console.log('usuario actualizado:' + foundUser.mlinkSelected);
                        start(senderId);
                    }
                });
            } else {
                UserData.getInfo(senderId, function (err, result) {
                    console.log('Dentro de UserData');
                    if (!err) {
                        var bodyObj = JSON.parse(result);
                        console.log(result);
                        var User = new UserData2; {
                            User.fbId = senderId;
                            User.firstName = bodyObj.first_name;
                            User.LastName = bodyObj.last_name;
                            User.profilePic = bodyObj.profile_pic;
                            User.locale = bodyObj.locale;
                            User.timeZone = bodyObj.timezone;
                            User.gender = bodyObj.gender;
                            User.messageNumber = 1;
                            User.mlinkSelected = referral

                            User.save();
                            start(senderId);

                            User.save((err, foundUserBefore) => {
                                if (err) {
                                    console.log('Error al guardar el usuario ');
                                } else {
                                    console.log('usuario guardado:' + foundUserBefore.mlinkSelected);
                                    start(senderId);
                                }

                            });
                        }
                    }
                });
            }
        }
    });

}



var start = (senderId) => {
    UserData.getInfo(senderId, function (err, result) {
        console.log('Consultado el usuario de Face !!');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;

            let urlImage = APLICATION_URL_DOMAIN + 'images/christmas/christmas.png';

            sendTemplate(senderId);

        }
    });


}





var sendTemplate = (senderId, message = "") => {

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
            "titulo": "Ricky Martin",
            "imagen": URLAplication + "images/christmas/promo/a-christmas-carol.jpg",
            "subtitulo": "",
            "url": mlink + "Ricky Martin"
        },
        {
            "titulo": "Celine Dion",
            "imagen": URLAplication + "images/christmas/promo/christmas-spectacular.jpg",
            "subtitulo": "",
            "url": mlink + "Celine Dion"

        },
        {
            "titulo": "Jennifer Lopez",
            "imagen": URLAplication + "images/christmas/promo/disney-on-ice-dream-big.jpg",
            "subtitulo": "",
            "url": mlink + "Jennifer Lopez"

        },
        {
            "titulo": "Cher",
            "imagen": URLAplication + "images/christmas/promo/elf-the-musical.jpg",
            "subtitulo": "",
            "url": mlink + "Cher"
        },
        {
            "titulo": "Vegas! The Show",
            "imagen": URLAplication + "images/christmas/promo/anastasia.png",
            "subtitulo": "",
            "url": mlink + "Vegas! The Show"
        },
        {
            "titulo": "Cirque Du Soleil: O",
            "imagen": URLAplication + "images/christmas/promo/anastasia.png",
            "subtitulo": "",
            "url": mlink + "Vegas! The Show"
        },
        {
            "titulo": "Cirque Du Soleil: Michael Jackson ONE",
            "imagen": URLAplication + "images/christmas/promo/anastasia.png",
            "subtitulo": "",
            "url": mlink + "Cirque Du Soleil: Michael Jackson ONE"
        },
        {
            "titulo": "Paranormal - The Mindreading Magic Show",
            "imagen": URLAplication + "images/christmas/promo/anastasia.png",
            "subtitulo": "",
            "url": mlink + "Paranormal - The Mindreading Magic Show"
        },
        {
            "titulo": " Cirque Du Soleil: Love (The Beatles)",
            "imagen": URLAplication + "images/christmas/promo/anastasia.png",
            "subtitulo": "",
            "url": mlink + " Cirque Du Soleil: Love (The Beatles)"
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
                    "title": "View",
                    "payload": boletos[i].titulo

                },
                {
                    "type": "element_share"
                }
            ]
        })

    }
    let counter = 0;



    Message.genericButton(senderId, eventResults);




    console.log('events Results >>>>>>>>>>>>>>>' + eventResults);

    Message.typingOff(senderId);



}









module.exports = {
    startVegasShow,

}