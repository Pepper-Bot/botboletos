var Message = require('../../../bot/messages');
var APLICATION_URL_DOMAIN = require('../../../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../../../config/config_vars').PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require('../../../config/config_vars').FBMESSAGESPAGE
var mlink = require('../../../config/config_vars').mlink.MLINK_BASE + "?ref="
var Message2 = require('../../../bot/generic_buttton');
var request = require('request');
var UserData = require('../../../bot/userinfo');
var UserData2 = require('../../../schemas/userinfo');

var startSanValentin = (senderId) => { //Changed func name yes

    var replies = [{ // updated quick replies to match new mock
            "content_type": "text",
            "title": "The Notebook",
            "payload": "the_notebook"

        },
        {
            "content_type": "text",
            "title": "Me Before You",
            "payload": "me_before_you"
        },
        {
            "content_type": "text", // added new reply
            "title": "Romeo + Juliet",
            "payload": "romeo_juliet"
        }
    ];
    sendQuickReplay(senderId, "Which is your favorite romance movie? ", replies);
}

var sendMessageAndChoiceImage = (senderId, payload) => {
    console.log("escogiendo url de la imagen de pelicula payload: " + payload)
    var message = "You chose:" // typo
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
    console.log("escogiendo url de la imagen de Shakira  payload: " + payload)
    var urlImage = '';
    switch (payload) { //updated switch to have 3 cases for the movies 
        case "the_notebook":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/valentine_movies/thenotebook.jpg'
                sendImageAndTevoSearch(senderId, urlImage)
            }
            break;
        case "me_before_you":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/valentine_movies/mebeforeyou.jpg'
                sendImageAndTevoSearch(senderId, urlImage);
            }
            break;
        case "romeo_juliet":
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/valentine_movies/romeojuliet.jpg'
                sendImageAndTevoSearch(senderId, urlImage)
            }
            break;
        default:
            {
                urlImage = APLICATION_URL_DOMAIN + 'images/valentine_movies/thenotebook.jpg' //and update default
                sendImageAndTevoSearch(senderId, urlImage)
            }
    }


}

var sendImageAndTevoSearch = (senderId, urlImage) => {
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
                        "url": urlImage,
                        "is_reusable": true
                    }
                }
            }
        }
    }, function (error, response, body) {
        console.log(response)
        if (error) {
            console.log("MAL")
        } else {
            console.log(" urlImage de Shakira " + urlImage)
            console.log(" sendImage  de Shakira  BIEN")
            sendTemplate(senderId, '')

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

    //configuramos los boletos
    message = 'Great choice. Wanna book a Valentine Show?'

    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionEnd': -1
        }
    }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                let city = foundUser.searchTevoParameters.city
                if (city) {
                    switch (city) {
                        case 'Las Vegas':
                            {
                                Message.sendMessage(senderId, message);
                                las_vegas_events().then((boletos) => {
                                    sendEventsResults(senderId, boletos)
                                })

                            }
                            break;
                        case 'New York':
                            {
                                Message.sendMessage(senderId, message);
                                new_york_events().then((boletos) => {
                                    sendEventsResults(senderId, boletos)
                                })

                            }
                            break;
                        case 'Chicago':
                            {
                                Message.sendMessage(senderId, message);
                                chicago_events().then((boletos) => {
                                    sendEventsResults(senderId, boletos)
                                })

                            }
                            break;


                        case 'San Francisco':
                            {
                                Message.sendMessage(senderId, message);
                                san_francisco_events().then((boletos) => {
                                    sendEventsResults(senderId, boletos)
                                })

                            }
                            break;


                        default:
                            {

                            }
                    }






                }
            }
        }
    });





}



var sendEventsResults = (senderId, boletos, eventResults = []) => {
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

    Message.genericButton(senderId, eventResults);




    console.log('events Results >>>>>>>>>>>>>>>' + eventResults);

    Message.typingOff(senderId);


}

var las_vegas_events = () => {
    return new Promise((resolve, reject) => {
        let boletos = [{
                "titulo": "Backstreet Boys",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/backstreet_boys.gif',
                "subtitulo": "",
                "url": mlink + "Backstreet Boys"
            },
            {
                "titulo": "Bruno Mars",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/bruno_mars.gif',
                "subtitulo": "",
                "url": mlink + "Bruno Mars"
            },
            {
                "titulo": "Legends In Concert",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/legends_in_concert.gif',
                "subtitulo": "",
                "url": mlink + "Legends In Concert"

            },
            {
                "titulo": "Magic Mike",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/magic_mike.gif',
                "subtitulo": "",
                "url": mlink + "Magic Mike"
            },
            {
                "titulo": "The Beatles Love",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/the_beatles_love.gif',
                "subtitulo": "",
                "url": mlink + "The Beatles Love"
            },
            {
                "titulo": "Zumanity",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/las_vegas/zumanity.gif',
                "subtitulo": "",
                "url": mlink + "Zumanity"
            }



        ];
        resolve(boletos)

    })



}





var new_york_events = () => {
    return new Promise((resolve, reject) => {
        let boletos = [{
                "titulo": "Aladdin",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/new_york/aladdin.gif',
                "subtitulo": "",
                "url": mlink + "Aladdin"
            },
            {
                "titulo": "Anastasia",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/new_york/anastacia.gif',
                "subtitulo": "",
                "url": mlink + "Anastasia"
            },
            {
                "titulo": "Kinky Boots",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/new_york/kinky_boots.gif',
                "subtitulo": "",
                "url": mlink + "Kinky Boots"

            },
            {
                "titulo": "The Phantom Of The Opera",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/new_york/the_phantom_of_the_opera.gif',
                "subtitulo": "",
                "url": mlink + "The Phantom Of The Opera"
            },
            {
                "titulo": "Wicked",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/new_york/wicked.gif',
                "subtitulo": "",
                "url": mlink + "Wicked"
            }



        ];
        resolve(boletos)

    })



}



var chicago_events = () => {
    return new Promise((resolve, reject) => {
        let boletos = [{
                "titulo": "Awolnation",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/awolnation.gif',
                "subtitulo": "",
                "url": mlink + "Awolnation"
            },
            {
                "titulo": "Brad Paisley",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/brad_paisley.gif',
                "subtitulo": "",
                "url": mlink + "Brad Paisley"
            },
            {
                "titulo": "Justin Moore",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/justin_moore.gif',
                "subtitulo": "",
                "url": mlink + "Justin Moore"

            },
            {
                "titulo": "Love Never Dies",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/love_never_dies.gif',
                "subtitulo": "",
                "url": mlink + "Love Never Dies"
            },
            {
                "titulo": "Nate Feuerstein",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/nate_feuerstein.gif',
                "subtitulo": "",
                "url": mlink + "Nate Feuerstein"
            }
            ,
            {
                "titulo": "Whitney",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/chicago/whitney.gif',
                "subtitulo": "",
                "url": mlink + "Whitney"
            }



        ];
        resolve(boletos)

    })



}


var san_francisco_events = () => {
    return new Promise((resolve, reject) => {
        let boletos = [{
                "titulo": "Aida rodrigu",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/sf/aida_rodrigu.gif',
                "subtitulo": "",
                "url": mlink + "Aida rodrigu"
            },
            {
                "titulo": "Shawn Wayan",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/sf/shawn_wayan.gif',
                "subtitulo": "",
                "url": mlink + "Shawn Wayan"
            },
            {
                "titulo": "Sleeping Beauty",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/sf/sleeping_beauty.gif',
                "subtitulo": "",
                "url": mlink + "Sleeping Beauty"

            },
            {
                "titulo": "The Lovemakers",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/sf/the_lovemak.gif',
                "subtitulo": "",
                "url": mlink + "The Lovemak"
            },
            {
                "titulo": "Mike Gordon",
                "imagen": APLICATION_URL_DOMAIN + 'images/valentine_movies/sf/mike_gordon.jpg',
                "subtitulo": "",
                "url": mlink + "Mike Gordon"
            }
            



        ];
        resolve(boletos)

    })



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

function startTevo(event_name, senderId, mlink = 0) {
    console.log("event_name " + event_name);
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');




}
module.exports = {
    startSanValentin,
    sendMessageAndChoiceImage
}







































//var happyNYMasive  = require ('../happy_new_year/happy_new_year_masive')
/*
var startSanValentin = (senderId, referral) => {
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






var start= (senderId) =>{
         

}









module.exports = {
    startSanValentin,

}

*/