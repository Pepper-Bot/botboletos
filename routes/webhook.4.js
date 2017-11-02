var express = require('express');
var router = express.Router();
var request = require('request');
var Message = require('../bot/messages');
var UserData = require('../bot/userinfo');
var UserData2 = require('../schemas/userinfo');

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
        res.end();
    } else {

        res.sendStatus(200);
        res.end();
    }
    console.log('#######################################################')
    //console.log(event);
    console.log('#######################################################')

});

function processMessage(senderId, textMessage) {



    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, foundUser) {
        if (foundUser.context === 'find_my_event_by_name') {
            console.log(foundUser.context);
            startTevoModuleWithMlink(textMessage, senderId);
            foundUser.context = '';
            foundUser.save();
        } else {
            //find_my_event(senderId);
            if (textMessage) {
                var yes_no = require('../modules/tevo/yes_no_find_quick_replay')
                yes_no.send(Message, senderId, textMessage);
                foundUser.context = textMessage
                foundUser.save();
            }


        }


    });


    if ('start again' === textMessage.toLowerCase()) {

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
    //aaki iba esta respuesta por default
    //var DefaultReply = require('../modules/defaultreply');
    //DefaultReply.send(Message, senderId);
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



                if (result.context == "find_my_event_by_category") {

                    let totalElements = result.categorySearchSelected.length;
                    let category = result.categorySearchSelected[totalElements - 1];

                    let lat = locationData.payload.coordinates.lat;
                    let lon = locationData.payload.coordinates.long;

                    var tevo = require('../modules/tevo/tevo');
                    tevo.startByParentsCategoriesAndLocation(senderId, category, 0, lat, lon)
                    saveContext(senderId, "");


                } else {
                    var totalElements = result.optionsSelected.length;
                    if (totalElements < 1) {
                        return;
                    }

                    var lastSelected = result.optionsSelected[totalElements - 1];

                    if ('Food' == lastSelected) {
                        var Food = require('../modules/food');
                        Food.get(Message, result, locationData);

                    } else if ('Events' == lastSelected) {
                        /* Llamamos al módulo de ventos */
                        /*                           var Events = require('../modules/events');
                                                    Events.get(Message, result, locationData);

                        var Evo = require('../modules/ticketevo');
                        Evo.get(Message, result, locationData);
                        */
                        let lat = locationData.payload.coordinates.lat;
                        let lon = locationData.payload.coordinates.long;

                        var ticketEvoByLocation = require('../modules/tevo/tevo_request_by_location');
                        ticketEvoByLocation.startTevoRequestByLocation(senderId, lat, lon, );

                        

                    } else if ('Drinks' == lastSelected) {

                        var Drink = require('../modules/drink');
                        Drink.get(Message, result, locationData);

                    }


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


    console.log('este es el quick replay  payload  ' + payload);



    switch (payload) {

        case "find_my_event_show_me_more":
            {
                var aki = ""
                //var MonthsQuickReply = require('../modules/tevo/months_replay');
                //MonthsQuickReply.send(Message, senderId, "Please choose month...");
                Message.markSeen(senderId);
                Message.getLocation(senderId, 'Where would you like to see an event?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;

        case "find_my_event_search_event":
            {
                var SearchQuickReply = require('../modules/tevo/search_quick_replay');
                SearchQuickReply.send(Message, senderId);
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;


        case "find_my_event_yes":
            {
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    startTevoModuleWithMlink(foundUser.context, senderId);

                });
            }
            break;


        case "find_my_event_no":
            {
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    Message.sendMessage(senderId, "Ok!");

                });
            }
            break;

        case "find_my_event_by_month":
            {
                var MonthsQuickReply = require('../modules/tevo/months_replay');
                MonthsQuickReply.send(Message, senderId, "Please choose month...");

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;




        case "find_my_event_by_category":
            {

                var CategoriesQuickReplay = require('../modules/tevo/tevo_categories_quick_replay');
                //var ButtonsEventsQuery = require('../modules/buttons_event_query');
                CategoriesQuickReplay.send(Message, senderId, "Please choose category....");

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }

            break;

        case "find_my_event_by_name":
            {



                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = 'find_my_event_by_name'
                    foundUser.save(function (err, userSaved) {
                        if (!err) {
                            console.log("se actualiza el index 1 foundUser.context " + foundUser.context)

                            Message.sendMessage(senderId, "Please enter your favorite artist, sport  team or event");


                        } else {
                            console.log("error al actualizar el index 1 ")
                        }
                    });




                });
            }

            break;

        case "find_my_event_by_location":
            {


                Message.markSeen(senderId);
                Message.getLocation(senderId, 'Where would you like to see an event?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });
            }
            break;


        default:
            {

            }
            break;
    }




    var moment = require('moment');
    var follow_months = require('../modules/tevo/follow_months');


    var monthsReplays = follow_months.follow_months(2);


    for (var i = 0; i < monthsReplays.length; i++) {
        if (payload == moment(monthsReplays[i]).format('MMM YYYY')) {

            let currentDate = moment(monthsReplays[i]);
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, foundUser) {
                if (!err) {
                    if (foundUser) {
                        console.log("foundUser.fbId " + foundUser.fbId + "\n");
                        var position = 0;
                        if (foundUser.eventSearchSelected) {
                            if (foundUser.eventSearchSelected.length > 0) {
                                let totalSelecteds = foundUser.eventSearchSelected.length - 1;
                                let lastSelected = foundUser.eventSearchSelected[totalSelecteds];


                                if (foundUser.eventSearchSelected.length >= 2) {
                                    let anterior = foundUser.eventSearchSelected.length - 2;
                                    let actual = foundUser.eventSearchSelected.length - 1;

                                    let anteriorS = foundUser.eventSearchSelected[anterior];
                                    let actualS = foundUser.eventSearchSelected[actual];

                                    if (actualS == anteriorS) {
                                        foundUser.showMemore.index2 = foundUser.showMemore.index2 + 1
                                        position = foundUser.showMemore.index2
                                    }
                                }
                                console.log('lastSelected>>>>' + lastSelected);


                                Message.sendMessage(senderId, 'Mes escogido ' + moment(currentDate).format('MMM YYYY') + 'evento ' + lastSelected);

                                let startOfMonth = moment(currentDate, moment.ISO_8601).startOf('month').format();
                                startOfMonth = startOfMonth.substring(0, startOfMonth.length - 6)

                                console.log("startOfMonth>>>>>>" + startOfMonth)

                                let endOfMonth = moment(currentDate, moment.ISO_8601).endOf('month').format();
                                endOfMonth = endOfMonth.substring(0, endOfMonth.length - 6)

                                console.log("endOfMonth>>>>>>" + endOfMonth);

                                foundUser.save(function (err, userSaved) {
                                    if (!err) {
                                        console.log("se actualiza el index 1 userSaved.showMemore.index1 " + userSaved.showMemore.index2)

                                    } else {
                                        console.log("error al actualizar el index 1 ")
                                    }
                                });


                                var TevoModuleByMonth = require('../modules/tevo/tevo_request_by_name_date');
                                TevoModuleByMonth.showEventsByNameAndDate(senderId, lastSelected, startOfMonth, endOfMonth, position);

                            } else {
                                console.log('En este la propiedad eventSearchSelected no tiene nada')
                            }
                        } else {
                            console.log('Este registro no tiene  eventSearchSelected')
                        }
                    } else {
                        console.log('No encontré el senderId >' + senderId);
                    }


                } else {

                    console.log('Tenemos un error >' + err);
                }

            });


            break;
        }

    }

    var tevo_categories = require('../modules/tevo/tevo_categories');
    var repliesArray = [];
    var parentCategories = tevo_categories.getParentCategories();

    for (var i = 0; i < parentCategories.length; i++) {
        let categoria = '';
        if (parentCategories[i].Sports) {
            categoria = "Sports";
        } else {
            categoria = parentCategories[i].name;
        }

        if (payload == categoria) {


            //aki2



            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {

                if (!err) {
                    if (null != result) {
                        result.context = 'find_my_event_by_category'
                        result.categorySearchSelected.push(categoria);
                        result.save(function (err) {
                            if (!err) {
                                console.log('Guardamos laa categoria ' + categoria);
                                Message.markSeen(senderId);
                                Message.getLocation(senderId, 'Where would you like to see an event?');
                                Message.typingOn(senderId);
                            } else {
                                console.log('Error guardando la categoria')
                            }
                        });
                    }
                }

            });





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
                    Message.getLocation(senderId, 'Where would you like to see an event?');

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



function processPostback(event) {


    var senderId = event.sender.id;
    var payload = event.postback.payload;



    switch (payload) {

        case "find_my_event_see_more_events":
            {
                var busqueda = ''
                startTevoModuleWithMlink(busqueda, senderId)
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;

        case "find_my_event_show_me_more":
            {
                var aki = ""
                //var MonthsQuickReply = require('../modules/tevo/months_replay');
                //MonthsQuickReply.send(Message, senderId, "Please choose month...");
                Message.markSeen(senderId);
                Message.getLocation(senderId, 'Where would you like to see an event?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;

        case "find_my_event_search_event":
            {
                var SearchQuickReply = require('../modules/tevo/search_quick_replay');
                SearchQuickReply.send(Message, senderId);
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;

        case "find_my_event_by_name":
            {

                Message.sendMessage(senderId, "Please enter your favorite artist, sport  team or event");
                context = 'find_my_event_by_name'

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = 'find_my_event_by_name'
                    foundUser.save();
                });

            }
            break;

        case "find_my_event_by_location":
            {


                Message.markSeen(senderId);
                Message.getLocation(senderId, 'Where would you like to see an event?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                context = ''
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });
            }
            break;

        case "find_my_event_by_category":
            {

                UserData.getInfo(senderId, function (err, result) {
                    console.log('Dentro de UserData');
                    if (!err) {
                        var bodyObj = JSON.parse(result);

                        var name = bodyObj.first_name;
                        var greeting = name;
                        var messagetxt = greeting + ", Please choose the category what you are looking for";

                        var tevoCategoriesQuickReplay = require('../modules/tevo/tevo_categories_quick_replay');
                        tevoCategoriesQuickReplay.send(Message, senderId, messagetxt);

                    }
                });
                context = ''

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.save();
                });


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
            var messagetxt = greeting; //+ ", Please enter your favorite artist, sport  team or event.";




            //var ButtonsEventsQuery = require('../modules/tevo/buttons_event_query');
            //var ButtonsEventsQuery = require('../modules/tevo/buttons_choise_again');
            //ButtonsEventsQuery.send(Message, senderId, messagetxt);

            var SearchQuickReply = require('../modules/tevo/search_quick_replay');
            SearchQuickReply.send(Message, senderId, messagetxt  +  ", please choose option for find your artist, sport team or event." );
            context = ''
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, foundUser) {
                foundUser.context = ''
                foundUser.save();
            });


        }
    });
};


function saveContext(senderId, context) {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        if (!err) {
            if (null != result) {
                result.context = context;
                result.save(function (err) {
                    if (!err) {

                        console.log('Guardamos el context de ' + context);
                    } else {
                        console.log('Error guardando context')
                    }
                });
            }
        }

    });
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

function saveCategorySelection(senderId, category) {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        if (!err) {
            if (null != result) {
                result.context = 'find_my_event_by_category'
                result.categorySearchSelected.push(category);
                result.save(function (err) {
                    if (!err) {
                        console.log('Guardamos la categoria seleccionada' + category);
                    } else {
                        console.log('Error guardando la categoria')
                    }
                });
            }
        }

    });
}


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

                startTevoModuleWithMlink(referral, senderId, 1);

            }
            break;

    }
}



function startTevoModuleWithMlink(event_name, senderId, mlink = 0) {
    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, foundUser) {
        if (!err) {
            if (null != foundUser) {
                var position = 0;
                if (mlink == 0) {
                    if (foundUser.eventSearchSelected) {
                        if (foundUser.eventSearchSelected.length >= 2) {
                            let anterior = foundUser.eventSearchSelected.length - 2;
                            let actual = foundUser.eventSearchSelected.length - 1;

                            let anteriorS = foundUser.eventSearchSelected[anterior];
                            let actualS = foundUser.eventSearchSelected[actual];

                            if (actualS == anteriorS) {
                                foundUser.showMemore.index1 = foundUser.showMemore.index1 + 1
                                position = foundUser.showMemore.index1
                            }
                        }
                    }

                } else {
                    foundUser.showMemore.index1 = 0;
                }




                if (event_name == '') {
                    let actual = foundUser.eventSearchSelected.length - 1;
                    event_name = foundUser.eventSearchSelected[actual];
                }

                var TevoModule = require('../modules/tevo_request');
                TevoModule.start(senderId, event_name, position);


                foundUser.save(function (err, userSaved) {
                    if (!err) {
                        console.log("se actualiza el index 1 userSaved.showMemore.index1 " + userSaved.showMemore.index1)

                    } else {
                        console.log("error al actualizar el index 1 ")
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


                            User.save();
                            console.log("Guardé el senderId result.fbId>>>> " + result.fbId);

                            let TevoModule = require('../modules/tevo_request');
                            let position = 0;
                            TevoModule.start(senderId, referral, position);



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




module.exports = router;