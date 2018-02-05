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


var startSuperBowl = (senderId, referral) => {
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


            let eventResults = [];


            eventResults.push({
                "title": json.restaurants[i].restaurant.name,
                //"image_url": json.restaurants[i].restaurant.thumb,
                "image_url": images[0].url,
                "subtitle": json.restaurants[i].restaurant.cuisines + ' ' + json.restaurants[i].restaurant.location.city,
                "default_action": {
                    "type": "web_url",
                    "url": APLICATION_URL_DOMAIN + 'redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + senderId
                    /*,
                                                                          "messenger_extensions": true,
                                                                          "webview_height_ratio": "tall",
                                                                          "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId*/
                },
                "buttons": [{
                    "type": "web_url",
                    "url": APLICATION_URL_DOMAIN + 'redirect/?u=' + json.restaurants[i].restaurant.url + '&id=' + senderId,
                    "title": "Go"
                }]
            });
            Message.genericButton(senderId, eventResults);















        }
    });


}










module.exports = {
    startSuperBowl,
    
}