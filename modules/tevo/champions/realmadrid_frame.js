/*
REAL MADRID FAME COPIED FROM MARDIGRAS 
*/

var Message = require('../../../bot/messages');
var Message_2 = require('../../../bot/generic_buttton') // Define new card layout
var APLICATION_URL_DOMAIN = require('../../../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../../../config/config_vars').PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require('../../../config/config_vars').FBMESSAGESPAGE
var mlink = require('../../../config/config_vars').mlink.MLINK_BASE + "?ref="
var Message2 = require('../../../bot/generic_buttton');
var request = require('request');
var UserData = require('../../../bot/userinfo');
var UserData2 = require('../../../schemas/userinfo');
var Message = require('../../../bot/messages');
var user_queries = require('../../../schemas/queries/user_queries');
// Request the users ID from DB API
var startRealMadridFrame = (senderId, referral) => {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, foundUser) {
        // Check if user exists in DB
        if (!err) {
            if (foundUser) {
                foundUser.mlinkSelected = referral // Update Me Link selected
                foundUser.save((err, foundUserBefore) => {
                    if (err) {
                        console.log('Error al guardar el usuario');
                    } else {
                        console.log('usuario actualizado:' + foundUser.mlinkSelected);
                        start(senderId);
                    }
                });
            } else {
                // If the user is not already in the DB then store it
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

                            User.save(); // This is the actual save
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

// Here i make this standard me link for frameS ANALOGOUS to super_bowl_cheer.js

var start = (senderId) => {
    UserData.getInfo(senderId, function (err, result) {
        console.log('Consultado el usuario de Face !!');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;

            let eventResults = [];
            let urlLink = 'www.facebook.com/fbcameraeffects/tryit/1148639865272750/'
            // Draw the FB UI Cards and elements


            let buttons = [{
                    "type": "web_url",
                    "url": "www.facebook.com/fbcameraeffects/tryit/319319435256446/",
                    "title": "Wear Real Madrid  "
            },
                {
                    "type": "web_url",
                    "url": "www.facebook.com/fbcameraeffects/tryit/2065967663618433/",
                    "title": "Wear Paris SG"
                }

            ]
            let title = 'Wear your team colors and support the victory!';
            Message_2.listButtons(senderId, title, buttons).then(()=>{
              //  Message.getLocation(senderId, 'Check out these games for your team');
            
            startChampionsLeagueFrame (senderId);
               

            })
        }
    });

}


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






/*

var startChicas = (senderId) => {
    UserData.getInfo(senderId, function (err, result) {
        console.log('Consultado el usuario de Face !!');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;
            var messageTitle = 'Take a photo with the champions';
            Message.sendMessage(senderId, messageTitle);

            let eventResults = [];
            let urlLink = 'http://www.facebook.com/fbcameraeffects/tryit/1949359401991479/'
            // Draw the FB UI Cards and elements
            eventResults.push({
                "title": 'Cheer the champions with a photo', // This is the new title for the photo

                "image_url": APLICATION_URL_DOMAIN + "/images/super_bowl/cheer/photo_superbowl_chicas.gif",
                "subtitle": 'Take a photo and show your friends',
                "default_action": {
                    "type": "web_url",
                    "url": urlLink
                    //,
                    //                                                      "messenger_extensions": true,
                    //                                                      "webview_height_ratio": "tall",
                    //                                                      "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId
                },
                "buttons": [{
                        "type": "web_url",
                        "url": urlLink,
                        "title": "Take Photo"
                    },
                    {
                        "type": "element_share"
                    }
                ]
            });
            // Message.genericButton(senderId, eventResults);
            Message_2.genericTemplate(senderId, eventResults, 'square');

        }
    });


} 

*/



module.exports = {
    startRealMadridFrame,

}