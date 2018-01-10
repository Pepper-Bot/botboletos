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


var startHappyNewYear = (senderId, referral, con = true) => {
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
                        start(senderId, con);
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
                            start(senderId, con);

                            User.save((err, foundUserBefore) => {
                                if (err) {
                                    console.log('Error al guardar el usuario ');
                                } else {
                                    console.log('usuario guardado:' + foundUserBefore.mlinkSelected);
                                    start(senderId, con);
                                }

                            });
                        }
                    }
                });
            }
        }
    });

}



var start = (senderId, con = true) => {
    UserData.getInfo(senderId, function (err, result) {
        console.log('Consultado el usuario de Face !!');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;

            let urlImage = APLICATION_URL_DOMAIN + 'images/christmas/christmas.png';

            // sendTemplate(senderId);
            var urlVideo = APLICATION_URL_DOMAIN + "videos/happy_new_year/happy_new_year_480.mp4"
            if (con == true) {
                var message = 'Seasson´s Greetings! And best wishes for the New Year 😄'
                sendVideoMessage(senderId, message, urlVideo)
            } else {
                sendTemplate(senderId, message = "")
            }
            //
        }
    });


}


function sendVideoMessage(senderId, message = "", urlVideo) {
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
                            "type": "video",
                            "payload": {
                                "url": urlVideo
                            }
                        }
                    }
                }
            }, function (error, response, body) {
                console.log(response)
                if (error) {
                    console.log("MAL")
                } else {
                    sendMessageAndTemplate(senderId, "Check the events for this season")
                }
            });
        }
    })
}




function sendMessageAndTemplate(senderId, message) {
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
    }, function (dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
        if (dataAndEvents) {
            return false;
        } else {
            sendTemplate(senderId, message = "")
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
            "titulo": "Super Bowl",
            "imagen": URLAplication + "images/happy_new_year/super_bowl.jpg",
            "subtitulo": "",
            "url": mlink + "Super Bowl"
        },
        {
            "titulo": "Blake Shelton ",
            "imagen": URLAplication + "images/happy_new_year/blake_shelton.jpg",
            "subtitulo": "",
            "url": mlink + "Blake Shelton"

        },
        {
            "titulo": "Katy Perry",
            "imagen": URLAplication + "images/happy_new_year/katy_perry.jpg",
            "subtitulo": "",
            "url": mlink + "Katy Perry"

        },
        {
            "titulo": "Demi Lovato",
            "imagen": URLAplication + "images/happy_new_year/demi.jpg",
            "subtitulo": "",
            "url": mlink + "Demi Lovato"
        },
        {
            "titulo": "Bruno Mars",
            "imagen": URLAplication + "images/happy_new_year/bruno_mars.jpg",
            "subtitulo": "",
            "url": mlink + "Bruno Mars"
        }




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
    startHappyNewYear,
    sendVideoMessage

}