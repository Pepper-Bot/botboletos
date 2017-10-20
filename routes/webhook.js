var express = require('express');
var router = express.Router();
var request = require('request');
var Message = require('../bot/messages');
var UserData = require('../bot/userinfo');
var UserData2 = require('../schemas/userinfo');
var context = '';
//--

var datos = {}; // Para saber si estamos o no con el ID

var dbObj = require('../schemas/mongodb');
dbObj.getConnection();



router.get('/', function (req, res, next) {

    if (req.query['hub.verify_token'] === process.env.BOT_TOKEN) {

        res.status(200).send(req.query['hub.challenge']);
    } else {

        res.sendStatus(403);
    }

});

router.post('/', function (req, res) {


    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function (entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {


                //console.log(event);

                if (event.referral) {

                    console.log('0');
                    handleReferrals(event);
                }
                console.log('1');
                if (event.postback) {
                    console.log('2');
                    processPostback(event);
                } else if (undefined !== event.message.quick_reply) {

                    console.log('3');
                    processQuickReplies(event);

                } else if (undefined !== event.message.attachments /* && event.message.attachments[0].type == "location" */ ) {
                    console.log('4');

                    if ('location' == event.message.attachments[0].type) {
                        console.log('4.1');
                        processLocation(event.sender.id, event.message.attachments[0]);
                    }
                } else if (undefined !== event.message.text) {
                    console.log('5');
                    processMessage(event.sender.id, event.message.text);
                }
            });
        });

        res.sendStatus(200);
    }
    console.log('#######################################################')
    //console.log(event);
    console.log('#######################################################')

});

function processMessage(senderId, textMessage) {
    if (context) {
        switch (context) {
            case 'find_my_event':
                {
                    startTevoModuleWithMlink(textMessage, senderId);
                }
                break;
            default:
                {


                }
                break;
        }
    }


    if ('start again' === textMessage.toLowerCase()) {
        startAgainFBResponse(senderId, textMessage)
    } else {
        if (!context) {
            if (context == '')
                defaultReplayFBResponse(senderId);
        }
    }
}

function startAgainFBResponse(senderId, textMessage) {
    UserData.getInfo(senderId, function (err, result) {
        console.log('Dentro de UserData');
        if (!err) {

            var bodyObj = JSON.parse(result);
            console.log(result);

            var name = bodyObj.first_name;

            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                var greeting = "Hi " + name;
                var messagetxt = greeting + ", what would you like to do?";

                var GreetingsReply = require('../modules/greetings');
                GreetingsReply.send(Message, senderId, messagetxt);

            });
        }
    });

}

function defaultReplayFBResponse(senderId) {
    var DefaultReply = require('../modules/defaultreply');
    DefaultReply.send(Message, senderId);
}



function processLocation(senderId, locationData) {

    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {
        //--
        if (!err) {
            if (result !== null) {


                var totalElements = result.optionsSelected.length;
                if (totalElements < 1) {
                    return;
                }



                var lastSelected = result.optionsSelected[totalElements - 1];

                if ('Food' == lastSelected) {
                    var Food = require('../modules/food');
                    Food.get(Message, result, locationData);

                } else if ('Events' == lastSelected) {

                    /* var Events = require('../modules/events');
                     Events.get(Message, result, locationData);*/

                    console.log('Se encuentra que guardó la selección de Events y se prosigue a buscar el evento');

                    var Evo = require('../modules/ticketevo');
                    Evo.get(Message, result, locationData);


                } else if ('Drinks' == lastSelected) {

                    var Drink = require('../modules/drink');
                    Drink.get(Message, result, locationData);

                }


                result.location.coordinates = [locationData.payload.coordinates.lat, locationData.payload.coordinates.long];
                result.locationURL = locationData.url;
                result.save(function (err) {
                    if (!err) {

                        console.log('Guardamos la localizacion');
                    } else {
                        console.log('Error guardando selección')
                    }
                });
            }
        }

    });

}

function processQuickReplies(event) {



    var senderId = event.sender.id;
    var payload = event.message.quick_reply.payload;

    var moment = require('moment');
    var follow_months = require('../modules/follow_months')


    var monthsReplays = follow_months.follow_months(2);

    for (var i = 0; i < monthsReplays.length; i++) {
        if (payload == moment(monthsReplays[i]).format('MMM YYYY')) {
            choosedMonth = moment(monthsReplays[i]).format('MMM YYYY')
            Message.sendMessage(senderId, 'Mes escogido ' + monthsReplays[i]);
            break;
        }

    }

    switch (payload) {


        case "TRYAGAIN_NO":
            Message.typingOn(senderId);
            Message.sendMessage(senderId, 'Ok, if you change your mind, type START AGAIN. See you Later.');
            Message.typingOff(senderId);
            break;

        case "TRYAGAIN_YES":
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                var totalSelecteds = result.optionsSelected.length - 1;
                var lastSelected = result.optionsSelected[totalSelecteds];


                if ('Food' == lastSelected) {

                    Message.markSeen(senderId);
                    Message.getLocation(senderId, 'What location would you like to get a bite at?');

                    Message.typingOn(senderId);
                    //sleep(1000);
                    console.log('Dentro de GET LOCATION FOOD');
                    UserData2.findOne({
                        fbId: senderId
                    }, {}, {
                        sort: {
                            'sessionStart': -1
                        }
                    }, function (err, result) {

                        if (!err) {

                            console.log(result);
                            if (null != result) {
                                result.optionsSelected.push('Food');
                                result.save(function (err) {
                                    if (!err) {

                                        console.log('Guardamos la seleccion de Drinks');
                                    } else {
                                        console.log('Error guardando selección')
                                    }
                                });
                            }
                        }

                    });


                } else if ('Events' == lastSelected) {


                    Message.markSeen(senderId);
                    Message.getLocation(senderId, 'What location would you like to catch a show?');

                    Message.typingOn(senderId);
                    //sleep(1000);
                    UserData2.findOne({
                        fbId: senderId
                    }, {}, {
                        sort: {
                            'sessionStart': -1
                        }
                    }, function (err, result) {

                        if (!err) {

                            if (null != result) {

                                result.optionsSelected.push('Events');
                                result.save(function (err) {
                                    if (!err) {

                                        console.log('Guardamos la seleccion de Drinks');
                                    } else {
                                        console.log('Error guardando selección')
                                    }
                                });
                            }
                        }

                    });
                } else if ('Drinks' == lastSelected) {


                    Message.markSeen(senderId);
                    Message.getLocation(senderId, 'What location would you like to get a drink at?');
                    Message.typingOn(senderId);
                    //sleep(1000);

                    UserData2.findOne({
                        fbId: senderId
                    }, {}, {
                        sort: {
                            'sessionStart': -1
                        }
                    }, function (err, result) {

                        if (!err) {

                            if (null != result) {
                                result.optionsSelected.push('Drinks');
                                result.save(function (err) {
                                    if (!err) {

                                        console.log('Guardamos la seleccion de Drinks');
                                    } else {
                                        console.log('Error guardando selección')
                                    }
                                });
                            }
                        }

                    });
                }

            });

            break;
        case "GET_LOCATION_DRINKS":



            Message.markSeen(senderId);
            Message.getLocation(senderId, 'What location would you like to get a drink at?');
            Message.typingOn(senderId);
            //sleep(1000);

            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                if (!err) {

                    if (null != result) {


                        result.optionsSelected.push('Drinks');
                        result.save(function (err) {
                            if (!err) {

                                console.log('Guardamos la seleccion de Drinks');
                            } else {
                                console.log('Error guardando selección')
                            }
                        });

                    }
                }

            });
            break;

        case "GET_LOCATION_EVENTS":


            Message.markSeen(senderId);
            Message.getLocation(senderId, 'What location would you like to catch a show?');
            Message.typingOn(senderId);
            //sleep(1000);
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                if (!err) {
                    if (null != result) {
                        result.optionsSelected.push('Events');
                        result.save(function (err) {
                            if (!err) {

                                console.log('Guardamos la seleccion de Drinks');
                            } else {
                                console.log('Error guardando selección')
                            }
                        });
                    }
                }

            });
            break;

        case "GET_LOCATION_FOOD":

            Message.markSeen(senderId);
            Message.getLocation(senderId, 'What location would you like to get a bite at?');
            Message.typingOn(senderId);
            //sleep(1000);

            console.log('Dentro de GET LOCATION FOOD');
            console.log('Sender ID: ' + senderId);
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                if (!err) {
                    if (null != result) {

                        console.log('Resultado de buscar senderId:');
                        console.log(result);

                        console.log('Guardando selección');
                        result.optionsSelected.push('Food');
                        result.save(function (err) {
                            if (!err) {

                                console.log('Guardamos la seleccion de Drinks');
                            } else {
                                console.log('Error guardando selección')
                            }
                        });
                    }

                }

            });



            break;


        default:
            console.log('Llamamos a Default');
            break;
    }
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

function processPostback(event) {

    var senderId = event.sender.id;
    var payload = event.postback.payload;

    switch (payload) {
        case "find_my_event_by_name":
            {

                Message.sendMessage(senderId, "Please enter your favorite artist, sport  team or event");
                context = 'find_my_event';
            }
            break;

        case "find_my_event_by_location":
            {


                Message.markSeen(senderId);
                Message.getLocation(senderId, 'What location would you like to catch a show?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                context = 'find_my_event_by_location';

            }
            break;


        case "FIND_MY_EVENT":
            find_my_event(senderId);


            break;



        case "Greetings":

            if (undefined !== event.postback.referral) {
                // Comprobamos que exista el comando de referencia y mostramos la correspondiente tarjeta.
                console.log('Dentro de referrals handler');
                handleReferrals(event);
            } else {
                // De lo contrario saludamos.
                console.log('#######################################################################################');
                console.log('saludamos');
                saluda(senderId);
            }


            break;


        default:

            //saluda(senderId);
            console.log('Si no reconozco, saludo');

            break;

    }



}

function saveUserSelection(senderId, selection) {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        if (!err) {
            if (null != result) {
                result.optionsSelected.push(selection);
                result.save(function (err) {
                    if (!err) {

                        console.log('Guardamos la seleccion de ' + selection);
                    } else {
                        console.log('Error guardando selección')
                    }
                });
            }
        }

    });
}



// sends message to user

function saluda(senderId) {

    console.log('Greetings Payload');
    // Metemos el ID
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

                User.save();
            }



            var name = bodyObj.first_name;
            var greeting = "Hi " + name;
            var messagetxt = greeting + ", what would you like to do?";
            //Message.sendMessage(senderId, message);
            /* INSERT TO MONGO DB DATA FROM SESSION*/


            Message.markSeen(senderId);
            Message.typingOn2(senderId, function (error, response, body) {

                var GreetingsReply = require('../modules/greetings');
                GreetingsReply.send(Message, senderId, messagetxt);

            });


        }
    });
};






function find_my_event(senderId) {
    UserData.getInfo(senderId, function (err, result) {
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

                User.save();
            }

            var name = bodyObj.first_name;
            var greeting = "Hi " + name;
            //var messagetxt = greeting + ", Please enter your favorite artist, sport  team or event.";

            context = 'find_my_event'

            var ButtonsEventsQuery = require('../modules/months_replay');
            //var ButtonsEventsQuery = require('../modules/buttons_event_query');

            ButtonsEventsQuery.send(Message, senderId, greeting);

        }
    });
};



function handleReferrals(event) {
    // Handle Referrals lo que hace  es verificar si el short link viene de una ventana nueva
    // o una conversación PRE-EXISTENTE.

    var senderId = event.sender.id;
    var referral;

    console.log('0.1');



    console.log('0.2');
    if (undefined !== event.postback) {
        console.log('0.3');
        // Obtenemos la referencia por "Start Button" o sea una conversación nueva.
        referral = event.postback.referral.ref;
        chooseReferral(referral, senderId);
    } else {
        // Msgr tiene un error, cuando detecta que ya es una conversacion abierta
        // envia 3 requests y por ende repite los mensajes, para evitar esto
        // se almacena el id en mongodb hasta la 3ra vuelta se envia la informacion 
        // no se si esto es problema de msgr como tal o heroku (quiero pensar que es de msgr)        
        referral = event.referral.ref;

        var FBSessions = require('../schemas/boletos');
        // Buscamos el id del usuario
        FBSessions.find({
            fbId: senderId
        }, {}, function (err, result) {

            if (!err) {

                if (result.length < 2) {
                    // si estamos dentro del rango de dos peticiones guardamos el id
                    var FBSession = new FBSessions; {
                        FBSession.fbId = senderId;
                        FBSession.save();
                    }
                } else {
                    // tercera peticion, mandamos a llamar a los boletos y elminamos los registros.

                    chooseReferral(referral, senderId);
                    FBSessions.remove({
                        fbId: senderId
                    }, function (err) {

                    });

                }

            }


        });
        // Ya tiene iniciada una conversacion el usuario con el robot

    }

}

function chooseReferral(referral, senderId) {

    // Esta funcion nos permite agregar mas tipos de referrals links, unicamente agregando en case 
    // y llamando a su modulo correspondiente.
    switch (referral) {
        case "MAGICON":
            {

                console.log('0.5');
                console.log('Sender ID:' + senderId);


                console.log('El sender id es:' + senderId);
                console.log('Estamos dentro de Start');

                // llamamos al módulo de boletos y los enviamos.
                var Magic = require('../modules/boletos');
                Magic.start(senderId);

            }
            break;


        case "SHARKSTANK":
            {
                var Shark = require('../modules/shark_boletos');
                Shark.start(senderId);

            }
            break;


        case "EVENTBRITE":
            {
                var EventBriteModule = require('../modules/eventbrite_request');
                EventBriteModule.start(senderId);
            }
            break;

        default:
            {
                startTevoModuleWithMlink(referral, senderId);
            }
            break;

    }
}


function startTevoModuleWithMlink(referral, senderId) {
    //consultando la api donde se estan guardando los mlinks!!
    var baseURL = 'https://botboletos-test.herokuapp.com/api/';
    var mlinks = 'mlinks/';
    var request = require('request');
    console.log("URL CONSULTA>>>>>>>>>>>>>>>" + baseURL + mlinks + referral);



    var TevoModule = require('../modules/tevo_request');
    TevoModule.start(senderId, referral);


    /* request({
             url: baseURL + mlinks + referral,
             qs: {

             },
             method: 'GET'
         },
         function (error, response, body) {
             if (!error) {
                 var body = JSON.parse(body);
                 if (body.mlinks[0].mlink) {
                     var event_name = body.mlinks[0].mlink;
                     //console.log( "ID CONSULTADO CON EXITO: >>>>>>>>>>>>>"  +  body.mlinks[0].id_evento);
                     var TevoModule = require('../modules/tevo_request');
                     TevoModule.start(senderId, event_name);


                 } else {
                     console.log("Records no found");
                 }
             }

         });*/
}


module.exports = router;