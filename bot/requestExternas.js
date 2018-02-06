var request = require('request');
var UserData = require('../bot/userinfo');
var UserData2 = require('../schemas/userinfo');

var takePhoto = (senderId) => {
    request({
        url: 'http://www.facebook.com/fbcameraeffects/tryit/1949359401991479/',
        qs: {

        },
        json: true,
        method: 'GET'
    }, function (error, response, body) {
        if (!error) {
            console.log("Petición sin error!! ")

        } else {
            console.log('error !!' + error);
        }
    })  
    saveUser(senderId, 'http://www.facebook.com/fbcameraeffects/tryit/1949359401991479/')
}


function saveUser(senderId, urlsVisited) {
    var UserData = require('../bot/userinfo');
    var UserData2 = require('../schemas/userinfo');

    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        if (!err) {

            if (null != result) {
                result.urlsVisited.push(urlsVisited);

                result.save(function (err, userSaved) {
                    if (!err) {
                        console.log(userSaved)
                        console.log(
                            "userSaved.fbId " + userSaved.fbId + "\n" +
                            "userSaved.firstName " + userSaved.firstName + "\n" +
                            "userSaved.LastName " + userSaved.LastName + "\n" +
                            "userSaved.profilePic " + userSaved.profilePic + "\n" +
                            "userSaved.locale " + userSaved.locale + "\n" +
                            "userSaved.timeZone " + userSaved.timeZone + "\n" +
                            "userSaved.gender " + userSaved.gender + "\n" +
                            "userSaved.sessionStart " + userSaved.sessionStart + "\n" +
                            "userSaved.eventSearchSelected " + userSaved.eventSearchSelected.length + "\n"
                        );



                        console.log("Consulto y Actualizo el result.fbId>>>> " + result.fbId);
                        console.log('Guardamos la seleccion' + lastSelected);
                    } else {
                        console.log('Error guardando selección')
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

                            result.urlsVisited.push(urlsVisited);

                            User.save();
                            console.log("Guardé el senderId result.fbId>>>> " + result.fbId);
                        }

                        

                    }
                });
            }
        }

    });
}


module.exports = {
    takePhoto,
}