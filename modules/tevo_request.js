module.exports = function () {
    return {
        start: function (senderId, event_name, position = 0, cool = 0) {
            var Message = require('../bot/messages');
            var imageCards = require('../modules/imageCards'); // Google images
            var TevoClient = require('ticketevolution-node');
            var moment = require('moment');
            var UserData = require('../bot/userinfo');
            var UserData2 = require('../schemas/userinfo');
            var tevo = require('../config/config_vars').tevo;
            var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
            var only_with = require('../config/config_vars').only_with;


            var tevoClient = new TevoClient({
                apiToken: tevo.API_TOKEN,
                apiSecretKey: tevo.API_SECRET_KEY
            });



            var urlApiTevo = '';

            urlApiTevo = tevo.API_URL + 'events?q=' + event_name + '&page=1&per_page=50&' + only_with + '&order_by=events.occurs_at'

            if ('shakira' === event_name.toLowerCase()) {
                urlApiTevo = tevo.API_URL + 'events?q=' + event_name + '&occurs_at.gte=2018-01-01T08:00:00Z&page=1&per_page=50&' + only_with + '&order_by=events.occurs_at'
            }





            console.log('url api tevo>>>>>>>' + urlApiTevo);

            var event_id = 0;
            if (tevoClient) {
                tevoClient.getJSON(urlApiTevo).then((json) => {
                    if (json.error) {
                        Message.sendMessage(senderId, json.error);
                    } else {

                        if (json.events.length > 0) {
                            Message.typingOn(senderId);
                            Message.markSeen(senderId);
                            Message.typingOn(senderId);

                            switch (cool) {
                                case 0:
                                    {
                                        Message.sendMessage(senderId, 'Book "' + event_name + '" Events');
                                    }
                                    break;
                                case 1:
                                    {
                                        Message.sendMessage(senderId, 'Cool, I looked for "' + event_name + '"  Book a ticket:');
                                    }
                                    break;
                                case 2:
                                    {
                                        Message.sendMessage(senderId, 'Thank your for your vote. Now, do you want to go to the concert?');
                                    }
                                    break;
                                default:
                                    {
                                        Message.sendMessage(senderId, 'Book "' + event_name + '" Events');
                                    }
                                    break;
                            }

                            Message.typingOn(senderId);

                            console.log('TENEMOS  ' + json.events.length + ' EVENTOS <<<<<<<<<<<POSITION > ' + position);
                            var resultEvent = [];
                            resultEvent = json.events;
                            var eventButtons_ = [];
                            var callsGis = 0;
                            var baseURL = APLICATION_URL_DOMAIN + 'event/?event_id=';


                            if (resultEvent.length > 9 * (position - 1)) {
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

                                console.log("position: " + position);
                                if (9 * (position + 1) < resultEvent.length + 1)
                                    resultEvent.splice(9 * (position + 1), resultEvent.length - 9 * (position + 1));
                                if (position - 1 >= 0)
                                    if (9 * (position) < resultEvent.length + 1)
                                        resultEvent.splice(0, 9 * (position));
                            }
                            //}

                            console.log('TENEMOS  ' + resultEvent.length + ' EVENTOS LUEGO DE RECORTARLOS    <<<<<<<<<<<<<<<<<<<<<<<<<<');

                            for (var j = 0, c = resultEvent.length; j < c; j++) {
                                console.log('EVENTO ' + j + '--' + resultEvent[j].id + '>>>>>>>>>>>>>>>>');


                                var occurs_at = resultEvent[j].occurs_at;
                                occurs_at = occurs_at.substring(0, occurs_at.length - 4)

                                //var occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')

                                var occurs_at = moment(occurs_at).format('MMM Do YYYY, h:mm a')



                                eventButtons_.push({
                                    "title": resultEvent[j].name, // +' '+ resultEvent[j].category.name,
                                    "image_url": resultEvent[j].category.name,
                                    "subtitle": resultEvent[j].venue.name + " " + resultEvent[j].venue.location + " " + occurs_at,
                                    "default_action": {
                                        "type": "web_url",
                                        "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name
                                        /*,
                                        "messenger_extensions": true,
                                        "webview_height_ratio": "tall",
                                        "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name*/
                                    },
                                    "buttons":

                                        [

                                            {
                                                "type": "web_url",
                                                "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name,
                                                "title": "Book"
                                            },
                                            {

                                                "type": "element_share"
                                            }
                                        ]
                                });



                            }

                            eventButtons_.push({
                                "title": "Can’t make any of these times?",
                                "subtitle": "My Pepper Bot",
                                "default_action": {
                                    "type": "web_url",
                                    "url": "https://www.facebook.com/mypepperbot/"
                                    /*,
                                    "messenger_extensions": true,
                                    "webview_height_ratio": "tall",
                                    "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name*/
                                },
                                "buttons": [{
                                    "type": "postback",
                                    "title": "More event times",
                                    "payload": "find_my_event_see_more_events"
                                }]
                            });



                            var gButtons = eventButtons_;
                            var counter = 0;


                            setImagesToEvents(gButtons, counter).then((gButtons) => {

                                console.log("luego del GButons event_name >>>>> " + event_name);
                                saveUsuarioAndEventSearchLastSelected(senderId, event_name);

                                var GenericButton = require('../bot/generic_buttton');
                                GenericButton.genericButtonQuickReplay(senderId, gButtons, "Find something else? ")


                                Message.typingOff(senderId);

                            });










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



var setImagesToEvents = (resultEvents, counter) => {
    // var gButtons = [];
    var gButtons = resultEvents;
    return new Promise((resolve, reject) => {


        for (let z = 0; z < gButtons.length; z++) {
            let search = gButtons[z].title
            console.log("search " + search)
            getGoogleImage(search, gButtons).then((images) => {
                let results1 = [];
                let contador1 = 0;
                
                    console.log("images.length " + images.length)
                    var imageIndex = 0;
                    if (images.length > 4) {
                        imageIndex = Math.round(Math.random() * 3);
                    } else {
                        imageIndex = Math.round(Math.random() * images.length - 1);
                    }

                    if (z < gButtons.length - 1) {

                        gButtons[z].image_url = images[imageIndex].url;

                    }
                    if (z == gButtons.length - 1) {
                        gButtons[gButtons.length - 1].image_url = "https://ticketdelivery.herokuapp.com/images/ciudad.jpg"

                    }
                   console.log("counter " + counter + " gButtons.length "+gButtons.length )

                    if (counter + 1 == gButtons.length) {
                        gButtons[gButtons.length - 1].image_url = "https://ticketdelivery.herokuapp.com/images/ciudad.jpg"
                        resolve(gButtons)
                    }

                
            }).then(() => {
                counter = counter + 1;
            })
        }






    });

    /// Promise.all(gButtons).then(a => console.log("Eventos >" + JSON.stringify(a)));

}


var getGoogleImage = (search, matriz = []) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');
        gis(search, logResults);

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results, matriz);
            }
        }

    });
}

var selectImages = (results, results1, contador) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i].width / results[i].height >= 1.91 && results[i].width / results[i].height <= 2 && results[i].height > 300) {


                results1.push(results[i])
                contador++;
                if (contador == 4) {
                    resolve(results1);
                }


            }


        }
    });
}


var getGoogleImage2 = (search) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');

        var opts = {
            searchTerm: search,
            queryStringAddition: '&tbs=ic:trans',
            filterOutDomains: [
                'pinterest.com',
                'deviantart.com'
            ]
        };


        var opts = {
            searchTerm: search,


        };




        gis(opts, logResults);

        var contador = 0

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {



                resolve(results);

                //console.log("Imagenes gis Respuesta >>> " + results.length);
                //console.log("Imagenes gis Respuesta >>> " + JSON.stringify(results));
                //resolve(results, matriz);
                /* var results1 = [];
                 for (let i = 0; i < results.length; i++) {

                     if (results[i].width / results[i].height >= 1.91 && results[i].width / results[i].height <= 2 && results[i].height > 300) {

                         results1.push(results[i])
                         contador++;
                         if (contador == 4) {
                             resolve(results1);
                         }


                     }

                     let index = results.length - 1 - i;

                    /* if (results[index]) {
                         if (results[index].width / results[index].height >= 1.91 && results[index].width / results[index].height <= 2 && results[index].height > 300) {

                             results1.push(results[index])
                             contador++;
                             if (contador == 4) {
                                 resolve(results1);
                             }


                         }
                     } else {
                         console.log("Error index > " + index);

                     } 


                     if (results.length - 1 <= 0)
                         if (i + 1 == results.length) {
                             resolve(results);
                         }


                 }*/

            }
        }

    });
}

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