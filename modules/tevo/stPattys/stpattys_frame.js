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
var startstPattysFrame = (senderId, referral) => {
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

            //let eventResults = [];
            //let urlLink = 'www.facebook.com/fbcameraeffects/tryit/1148639865272750/'
            // Draw the FB UI Cards and elements


            let buttons = [{
                    "type": "web_url",
                    "url": "https://www.facebook.com/fbcameraeffects/tryit/414869202274176/",
                    "title": "Take selfie (mobile)"
            }/*,
                {
                    "type": "web_url",
                    "url": "https://www.facebook.com/profilepicframes/?overlay_source_object_id=1881553218822492&selected_page_id=1593266137651203&selected_overlay_id=143206143013774",
                    "title": "Change profile picture"
                }*/

            ]
            let title = "Share the St Patty's Spirit w a Picture!";
            Message.listButtons(senderId, title, buttons).then(()=>{
                Message.getLocation(senderId, 'Check out this events during St Pats');
               
               

            })
        }
    });

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
    startstPattysFrame,

}