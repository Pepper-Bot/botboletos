module.exports = function () {
    return {
        start: function (senderId, event_name, position = 0) {
            var Message = require('../bot/messages');
            var imageCards = require('../modules/imageCards'); // Google images
            var TevoClient = require('ticketevolution-node');
            var moment = require('moment');




            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });



            var urlApiTevo = '';


            urlApiTevo = 'https://api.ticketevolution.com/v9/events?q=' + event_name + '&page=1&per_page=50&only_with_available_tickets=true&order_by=events.occurs_at'



            console.log('url api tevo>>>>>>>' + urlApiTevo);

            var event_id = 0;
            if (tevoClient) {
                tevoClient.getJSON(urlApiTevo).then((json) => {
                    Message.typingOn(senderId);
                    Message.markSeen(senderId);
                    Message.typingOn(senderId);
                    Message.sendMessage(senderId, "Getting Events:");
                    if (json.error) {
                        Message.sendMessage(senderId, json.error);
                    } else {

                        if (json.events.length > 0) {
                            console.log('TENEMOS  ' + json.events.length + ' EVENTOS <<<<<<<<<<<POSITION > ' + position);
                            var resultEvent = [];
                            resultEvent = json.events;
                            var eventButtons_ = [];
                            var callsGis = 0;
                            var baseURL = 'https://ticketdelivery.herokuapp.com/event/?event_id=';



                            if ((position * 9) > resultEvent.length - 9) {
                                position = 0;
                                UserData2.findOne({
                                    fbId: senderId
                                }, {}, {
                                    sort: {
                                        'sessionStart': -1
                                    }
                                }, function (err, foundUser) {
                                    if (!err) {
                                        if (null != foundUser) {
                                            foundUser.showMemore.index1 = 0
                                            foundUser.save(function (err) {
                                                if (!err) {
                                                    console.log("index1 en cero");
                                                } else {
                                                    console.log("error al actualizar el index 0");
                                                }
                                            });
                                        }
                                    }

                                });
                            }
                            if (resultEvent.length >= 9) {
                                if (9 * (position + 1) < resultEvent.length + 1)
                                    resultEvent.splice(9 * (position + 1), resultEvent.length - 9 * (position + 1));
                                if (position - 1 >= 0)
                                    resultEvent.splice(0, 9 * (position));
                            }

                            console.log('TENEMOS  ' + resultEvent.length + ' EVENTOS LUEGO DE RECORTARLOS    <<<<<<<<<<<<<<<<<<<<<<<<<<');

                            for (var j = 0, c = resultEvent.length; j < c; j++) {
                                console.log('EVENTO ' + j + '--' + resultEvent[j].id + '>>>>>>>>>>>>>>>>');


                                var occurs_at = resultEvent[j].occurs_at;
                                occurs_at = occurs_at.substring(0, occurs_at.length - 4)

                                var occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')





                                eventButtons_.push({
                                    "title": resultEvent[j].name, // +' '+ resultEvent[j].category.name,
                                    "image_url": resultEvent[j].category.name,
                                    "subtitle": resultEvent[j].venue.name + " " + occurs_at,
                                    "default_action": {
                                        "type": "web_url",
                                        "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name
                                        /*,
                                        "messenger_extensions": true,
                                        "webview_height_ratio": "tall",
                                        "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name*/
                                    },
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name,
                                        "title": "Book"
                                    }]
                                });



                            }

                            eventButtons_.push({
                                "title": "See more " + resultEvent[0].name + " events", // +' '+ resultEvent[0].category.name,



                                "buttons": [{
                                    "type": "postback",
                                    "title": "See more events",
                                    "payload": "find_my_event_see_more_events"
                                }]
                            });


                            gButtons = null;
                            gButtons = eventButtons_;
                            counter = 0;

                            for (var z = 0, k = gButtons.length; z < k; z++) {



                                imageCards('event ' + gButtons[z].title + ' ' + gButtons[z].image_url, z, function (err, images, index) {
                                    var imageIndex = 0;
                                    if (images.length >= 5) {
                                        imageIndex = Math.round(Math.random() * 5);
                                    } else {
                                        imageIndex = Math.round(Math.random() * images.length);
                                    }

                                    if (index < 9)
                                        gButtons[index].image_url = images[imageIndex].url;
                                    counter++;
                                    if (counter == gButtons.length) {

                                        console.log('gButtons.length> ' + gButtons.length);


                                        console.log("ENTRE A GBUTTONS:::::::>>>" + gButtons[index].image_url);
                                        // Message.genericButton(senderId, gButtons);

                                        //var ShowMeMoreQuickReply = require('../modules/tevo/show_me_more_quick_replay');
                                        // ShowMeMoreQuickReply.send(Message, senderId);
                                        console.log("luego del GButons event_name >>>>> " + event_name);
                                        saveUsuarioAndEventSearchLastSelected(senderId, event_name);

                                        var GenericButton = require('../bot/generic_buttton');
                                        //GenericButton.genericButtonQuickReplay(senderId, gButtons, "Choose Option: ")
                                        GenericButton.genericButtonAndTemplateButtons(senderId, gButtons, "You Can choice other options... ")

                                        Message.typingOff(senderId);
                                    }


                                });



                            }

                        } else {
                            Message.sendMessage(senderId, "No Found Events");
                        }


                    } //fin  de else json.error
                }).catch((err) => {
                    console.err(err);
                });


            }

        }
    }
}();




function saveUsuarioAndEventSearchLastSelected(senderId, lastSelected) {
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
                result.eventSearchSelected.push(lastSelected);

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

                            User.eventSearchSelected.push(lastSelected);

                            User.save();
                            console.log("Guardé el senderId result.fbId>>>> " + result.fbId);
                        }



                        var name = bodyObj.first_name;
                        var greeting = "Hi " + name;
                        var messagetxt = greeting + ", what would you like to do?";
                        //Message.sendMessage(senderId, message);
                        /* INSERT TO MONGO DB DATA FROM SESSION*/


                    }
                });
            }
        }

    });
}



function inspeccionar(obj) {
    var msg = '';

    for (var property in obj) {
        if (typeof obj[property] == 'function') {
            var inicio = obj[property].toString().indexOf('function');
            var fin = obj[property].toString().indexOf(')') + 1;
            var propertyValue = obj[property].toString().substring(inicio, fin);
            msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
        } else if (typeof obj[property] == 'unknown') {
            msg += 'unknown ' + property + ' : unknown ;\n';
        } else {
            msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
        }
    }
    return msg;
}

function inspeccionar2(obj) {
    var msg = new Array();

    for (var property in obj) {
        if (typeof obj[property] == 'function') {
            var inicio = obj[property].toString().indexOf('function');
            var fin = obj[property].toString().indexOf(')') + 1;
            var propertyValue = obj[property].toString().substring(inicio, fin);
            msg[msg.length] = {
                'type': (typeof obj[property]),
                'name': property,
                'value': propertyValue
            };
        } else if (typeof obj[property] == 'unknown') {
            msg[msg.length] = {
                'type': 'unknown',
                'name': property,
                value: 'unknown'
            };
        } else {
            msg[msg.length] = {
                'type': (typeof obj[property]),
                'name': property,
                'value': obj[property]
            };
        }
    }
    return msg;
}