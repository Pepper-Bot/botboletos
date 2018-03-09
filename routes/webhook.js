'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var Message = require('../bot/messages');
var UserData = require('../bot/userinfo');
var UserData2 = require('../schemas/userinfo');
var reqExternas = require('../bot/requestExternas');

var API_AI_CLIENT_ACCESS_TOKEN = require('../config/config_vars').API_AI_CLIENT_ACCESS_TOKEN;
var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../config/config_vars').PAGE_ACCESS_TOKEN;

var FB_APP_SECRET = require('../config/config_vars').FB_APP_SECRET;

var TevoClient = require('ticketevolution-node');
var only_with = require('../config/config_vars').only_with;
var tevo = require('../config/config_vars').tevo;
var tevoCategories = require('../modules/tevo/tevo');
var fsStrings = require('../config/funciones_varias');
var categories_queries = require('../schemas/queries/categories_queries')
const apiai = require('apiai');
const crypto = require('crypto');
const uuid = require('uuid');
var moment = require('moment');
var zomato = require('../modules/zomato/zomato');

var user_queries = require('../schemas/queries/user_queries');
var TevoModule = require('../modules/query_tevo_request');
var nlp = require('../bot/NLP/nlp')

const apiAiService = apiai(API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});

const tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});

const sessionIds = new Map();


var datos = {}; // Para saber si estamos o no con el ID

var dbObj = require('../schemas/mongodb');
dbObj.getConnection();





/**
 * 
 * @param {*} req Request 
 * @param {*} res Response 
 * @description Function route Webhook FaceBook. FaceBook verify token
 */
var intitGetFB = (req, res) => {
    if (req.query['hub.verify_token'] === process.env.BOT_TOKEN) {

        res.status(200).send(req.query['hub.challenge']);
    } else {

        res.sendStatus(403);
    }
}





/**
 * 
 * @param {*} req Request 
 * @param {*} res Response 
 * @description Function detected what event ocurrs in a messenger dialog
 * 
 * 
 */
var initFBEvents = (req, res) => {
    if (req.body.object == "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function (entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {

                //console.log('evento detectado ' + JSON.stringify(event))

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
                    var isEcho = event.message.is_echo;
                    if (!isEcho)
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

}



/**
 * 
 * @param {*} obj Object 
 * @description Function detected if object is undefined
 * 
 * 
 */
function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}



/**
 * 
 * @param {*} sender Face Book Id 
 * @param {*} text text send to Dialog Flow API.AI 
 * @description Function for send text to Dialog Flow API.AI will be analyzed
 * 
 * 
 */
function sendToApiAi(sender, text) {
    console.log('texto enviado a api.ai> ' + text)
    Message.typingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
        sessionId: sessionIds.get(sender)
    });

    apiaiRequest.on('response', (response) => {
        if (isDefined(response.result)) {
            //console.log('Api.ai response messages' + JSON.stringify(response))
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}


/**
 * 
 * @param {*} senderId Face Book Id 
 * @param {*} textMessage text send to Dialog Flow API.AI 
 * @description Function for send text to Dialog Flow API.AI will be analyzed
 * 
 */
function processMessage(senderId, textMessage) {
    textMessage = fsStrings.getCleanedString(textMessage);

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
                        'sessionEnd': -1
                    }
                }, function (err, result) {

                    var greeting = "Hi " + name;
                    var messagetxt = greeting + ", what would you like to do?";

                    var GreetingsReply = require('../modules/greetings');
                    GreetingsReply.send(Message, senderId, messagetxt);

                });


            }
        });

    } else {

        if (!sessionIds.has(senderId)) {
            sessionIds.set(senderId, uuid.v1());
        }

        var userSays = {
            typed: textMessage
        }
        user_queries.createUpdateUserDatas(senderId, '', '', userSays).then(() => {
            sendToApiAi(senderId, textMessage)
        })

    }
    console.log('process message ' + textMessage)

}


/**
 * 
 * @param {*} sender Face Book Id 
 * @param {*} response Response from Dialog Flow API.AI
 * @description Function managed Dialog Flow API.AI response 
 * 
 */
function handleApiAiResponse(sender, response) {

    //console.log("handleApiAiResponse >>> " + JSON.stringify(response));

    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    Message.typingOff(sender);
    //console.log('Api.ai response messages' + JSON.stringify(response))

    if (isDefined(messages) && (messages.length == 1 && messages[0].type != 0 || messages.length > 1)) {

        console.log('Api.ai isDefined(messages) ' + JSON.stringify(messages))
        let timeoutInterval = 1100;
        let previousType;
        let cardTypes = [];
        let timeout = 0;
        for (var i = 0; i < messages.length; i++) {

            if (previousType == 1 && (messages[i].type != 1 || i == messages.length - 1)) {

                timeout = (i - 1) * timeoutInterval;
                setTimeout(handleCardMessages.bind(null, cardTypes, sender), timeout);
                cardTypes = [];
                timeout = i * timeoutInterval;
                setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
            } else if (messages[i].type == 1 && i == messages.length - 1) {
                cardTypes.push(messages[i]);
                timeout = (i - 1) * timeoutInterval;
                setTimeout(handleCardMessages.bind(null, cardTypes, sender), timeout);
                cardTypes = [];
            } else if (messages[i].type == 1) {
                cardTypes.push(messages[i]);
            } else {
                timeout = i * timeoutInterval;
                setTimeout(handleMessage.bind(null, messages[i], sender), timeout);
            }

            previousType = messages[i].type;

        }
    } else if (responseText == '' && !isDefined(action)) {
        //api ai could not evaluate input.
        console.log('Unknown query' + response.result.resolvedQuery);

        Message.sendMessage(sender, "I'm not sure what you want. Can you be more specific?");
    } else if (isDefined(action)) {
        console.log('action ' + action);
        handleApiAiAction(sender, response, action, responseText, contexts, parameters);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
        try {
            console.log('Response as formatted message' + responseData.facebook);
            Message.sendMessage(sender, responseData.facebook);
        } catch (err) {
            Message.sendMessage(sender, err.message);
        }
    } else if (isDefined(responseText)) {

        Message.sendMessage(sender, responseText);
    }
}

/**
 * 
 * @param {*} sender FaceBook Id
 * @param {*} response Respuesta de DialogFlow API.A
 * @param {*} action Action definida en Dialog Flow API.AI
 * @param {*} responseText Respuesta Final del Intent de Dialog Flow API.AI
 * @param {*} contexts Contextos Definidos en el Intent de Dialog Flow API.AI
 * @param {*} parameters Parametros Definidos en el Intent de Dialog Flow API.AI
 * 
 * @description Función donde se procesan las acciones, contextos y parametros de la Acción events.search.implicit con los que se arma 
 * una query que es enviadoa a Ticket Evolution, Zomato que termina en elaboración de un Generic Template de Facebook
 * 
 */
function handleApiAiAction(sender, response, action, responseText, contexts, parameters) {
    nlp.handleApiAiAction(sender, response, action, responseText, contexts, parameters);
}



/**
 * 
 * @param {*} message message from DialogFlow API.AI
 * @param {*} sender Facebook user Id
 * 
 * @description Función donde se manejan los mensajes que no poseen action que proceden del manejo de la respuesta de DialogFlow API.AI
 * 
 */
function handleMessage(message, sender) {
    switch (message.type) {
        case 0: //text

            Message.sendMessage(sender, message.speech);

            break;
        case 2: //quick replies
            let replies = [];
            for (var b = 0; b < message.replies.length; b++) {
                let reply = {
                    "content_type": "text",
                    "title": message.replies[b],
                    "payload": message.replies[b]
                }
                replies.push(reply);
            }
            sendQuickReply(sender, message.title, replies);
            break;
        case 3: //image
            sendImageMessage(sender, message.imageUrl);
            break;
        case 4:
            // custom payload
            var messageData = {
                recipient: {
                    id: sender
                },
                message: message.payload.facebook

            };

            callSendAPI(messageData);

            break;
    }
}

/**
 * 
 * @param {*} recipientId Facebook user Id
 * @param {*} imageUrl imageUrl
 * 
 * @description Función donde se manejan los mensajes que no poseen action
 * que proceden del manejo de la respuesta. Esta respuesta es una imagen de DialogFlow API.AI
 * 
 */
function sendImageMessage(recipientId, imageUrl) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: imageUrl
                }
            }
        }
    };

    callSendAPI(messageData);
}

/**
 * 
 * @param {*} recipientId Facebook user Id
 * @param {*} text titulo de la estrucutra del quick reply
 * @param {*} replies replies de DialogFlow API.AI
 * 
 * @description Función donde se manejan los mensajes que no poseen action
 * que proceden del manejo de la respuesta. Esta respuesta es un quick replay desde DialogFlow API.AI
 * 
 */
function sendQuickReply(recipientId, text, replies, metadata) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text,
            metadata: isDefined(metadata) ? metadata : '',
            quick_replies: replies
        }
    };

    callSendAPI(messageData);
}

/**
 * 
 * @param {*} messages message from  DialogFlow API.AI
 * @param {*} sender Facebook user Id
 * 
 * @description Función donde se manejan los mensajes que no poseen action
 * que proceden del manejo de la respuesta. Esta respuesta es un generic template  DialogFlow API.AI
 * 
 */
function handleCardMessages(messages, sender) {

    let elements = [];
    for (var m = 0; m < messages.length; m++) {
        let message = messages[m];
        let buttons = [];
        for (var b = 0; b < message.buttons.length; b++) {
            let isLink = (message.buttons[b].postback.substring(0, 4) === 'http');
            let button;
            if (isLink) {
                button = {
                    "type": "web_url",
                    "title": message.buttons[b].text,
                    "url": message.buttons[b].postback
                }
            } else {
                button = {
                    "type": "postback",
                    "title": message.buttons[b].text,
                    "payload": message.buttons[b].postback
                }
            }
            buttons.push(button);
        }


        let element = {
            "title": message.title,
            "image_url": message.imageUrl,
            "subtitle": message.subtitle,
            "buttons": buttons
        };
        elements.push(element);
    }
    sendGenericMessage(sender, elements);
}

/**
 * 
 * @param {*} recipientId Facebook user Id
 * @param {*} elements generic template elements
 * 
 * @description Función donde se manejan los mensajes que no poseen action
 * que proceden del manejo de la respuesta. Esta respuesta es un generic template  DialogFlow API.AI
 * 
 */
function sendGenericMessage(recipientId, elements) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };

    callSendAPI(messageData);
}

/**
 * 
 * @param {*} messageData messageData
 * 
 * @description Función para enviar al graph de facebook el messageData armado
 * 
 */
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}



/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} locationData locationData from Facebook Map
 * @description Función para procesar la localización enviada por el usuario mediante el mapa
 * 
 */
function processLocation(senderId, locationData) {
    console.log('lat ' + locationData.payload.coordinates.lat)
    console.log('long ' + locationData.payload.coordinates.long)

    UserData2.findOne({
        fbId: senderId
    }, {}, {
        sort: {
            'sessionEnd': -1
        }
    }, function (err, result) {
        //--
        if (!err) {
            if (result !== null) {
                result.location.coordinates = [locationData.payload.coordinates.lat, locationData.payload.coordinates.long];
                result.locationURL = locationData.url;
                result.save(function (err) {
                    if (!err) {
                        console.log('Guardamos la localizacion');

                        if (result.context == "find_venue_to_eat") {
                            let totalElements = result.userSays.length;
                            let userSays = result.userSays[totalElements - 1];
                            if (isDefined(userSays)) {
                                if (isDefined(userSays.typed)) {
                                    console.log('userSays  find_venue_to_eat ' + userSays.typed)
                                    user_queries.createUpdateUserDatas(senderId, '-');
                                    sendToApiAi(senderId, userSays.typed)

                                }
                            }

                        }

                        if (result.mlinkSelected == "MARDIGRAS_FRAME") {


                            let userPreferences = {
                                event_title: '',
                                city: '',
                                artist: '',
                                team: '',
                                event_type: '',
                                music_genre: ''
                            }

                            let lat = locationData.payload.coordinates.lat;
                            let lon = locationData.payload.coordinates.long;


                            let page = 1
                            let per_page = 9



                            var query = {
                                prioridad: 1,
                                searchBy: 'Category',
                                query: tevo.API_URL + 'events?category_id=' + '54' + '&page=' + page + '&per_page=' + per_page + '&lat=' + lat + '&lon=' + lon + '&' + only_with + '&within=100&order_by=events.occurs_at,events.popularity_score DESC',
                                queryReplace: tevo.API_URL + 'events?category_id=' + '54' + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&lat=' + lat + '&lon=' + lon + '&' + only_with + '&within=100&order_by=events.occurs_at,events.popularity_score DESC',
                                queryPage: page,
                                queryPerPage: per_page,
                                messageTitle: 'Cool, I looked for ' + 'concerts' + ' at your location.  Book a ticket'
                            }


                            user_queries.createUpdateUserDatas(senderId, '', '', {}, '', query.query, query.queryReplace, query.queryPage, query.queryPerPage, userPreferences.artist, userPreferences.music_genre, userPreferences.team, userPreferences.city, query.messageTitle, userPreferences.event_type)
                            TevoModule.start(senderId, query.query, 0, query.messageTitle, {}, query);



                        } else



                        if (result.context == "find_my_event_by_category") {

                            let totalElements = result.categorySearchSelected.length;
                            let category = result.categorySearchSelected[totalElements - 1];

                            let lat = locationData.payload.coordinates.lat;
                            let lon = locationData.payload.coordinates.long;

                            let tevo = require('../modules/tevo/tevo');
                            tevo.startByParentsCategoriesAndLocation(senderId, category, lat, lon)
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

                                startTevoModuleByLocation(senderId, lat, lon);

                            } else if ('Drinks' == lastSelected) {

                                var Drink = require('../modules/drink');
                                Drink.get(Message, result, locationData);

                            }


                        }
                    } else {
                        console.log('Error guardando selección')
                    }
                });
            }
        }

    });

}



/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} payload payload en el quick replay
 * @description Función para evaluar un quick replay
 * 
 */
var processQuickReplaySanValentin = (senderId, payload) => {
    console.log("San Valentin votación Module " + payload)
    Message.markSeen(senderId);
    var sanvalentinModule = require('../modules/tevo/san_valentin/san_valentin');
    sanvalentinModule.sendMessageAndChoiceImage(senderId, payload);
}


/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} payload payload en el quick replay
 * @description Función para evaluar un quick replay
 * 
 */
var processQuickReplayShakira = (senderId, payload) => {
    console.log("Shakira votación Module " + payload)
    Message.markSeen(senderId);
    var shakiraModule = require('../modules/promo/shakira');
    shakiraModule.sendMessageAndChoiceImage(senderId, payload);
}


/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} payload payload en el quick replay
 * @description Función para evaluar un quick replay
 * 
 */
var processQuickReplayChristmasSongs = (senderId, payload) => {
    console.log("ChristmasSongs votación Module " + payload)
    Message.markSeen(senderId);
    var christmasSongsModule = require('../modules/tevo/chirstmas/christmas_songs');
    christmasSongsModule.sendMessageAndChoiceImage(senderId, payload);
}


/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} payload payload en el quick replay
 * @description Función para evaluar un quick replay
 * 
 */
var processQuickReplaySuperBowl = (senderId, payload) => {
    console.log("SuperBowl Module " + payload)
    Message.markSeen(senderId);
    var superBowlModule = require('../modules/tevo/super_bowl/super_bowl');
    superBowlModule.sendMessageAndChoiceImage(senderId, payload);
}



/**
 * 
 * @param {*} senderId FaceBook user ID
 * @param {*} payload payload en el quick replay
 * @description Función para evaluar un quick replay
 * 
 */
function processQuickReplayBox(senderId) {

    console.log("Rigondeaux  Lomachenko   ")
    Message.markSeen(senderId);

    //Message.sendMessage(senderId, "Results:");
    //resultados...
    var rigovslomaQuickReplay = require('../modules/quiz/rigo_vs_loma_quick_replay');
    rigovslomaQuickReplay.send(Message, senderId);

}



/**
 * 
 * @param {*} event objeto que trae la información del evento
 * @description Función que ha detectado la acción de un quick replay
 * 
 */
function processQuickReplies(event) {
    var senderId = event.sender.id;
    var payload = event.message.quick_reply.payload;


    console.log('este es el quick replay  payload  ' + payload);



    switch (payload) {


    case "BARCELONA":
        {
            console.log('entré al barcelona')
            startTevoModuleWithMlink('Barcelona', senderId)
        }
        break;
    case "CHELSEA":
        {
            console.log('entré al chelsea')
            startTevoModuleWithMlink('Chelsea FC', senderId)
        }
        break;


        case "REAL_MADRID":
            {
                console.log('entré al al real madrid')
                startTevoModuleWithMlink('Real Madrid', senderId)
            }
            break;
        case "PARIS_SAINT_GERMAN":
            {
                console.log('entré al al Paris Saint-German FC')
                startTevoModuleWithMlink('Paris Saint-Germain FC', senderId)
            }
            break;


        case "find_my_event_Patriots":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;

        case "find_my_event_Broncos":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;


        case "find_my_event_Seahawks":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;
        case "find_my_event_Cowboys":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;

        case "find_my_event_Packers":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;

        case "find_my_event_Steelers":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;
        case "find_my_event_Falcons":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;
        case "find_my_event_Eagles":
            {
                processQuickReplaySuperBowl(senderId, payload);
            }
            break;
        case "find_my_event_mariah":
            {
                processQuickReplayChristmasSongs(senderId, payload);
            }
            break;

        case "find_my_event_ariana":
            {
                processQuickReplayChristmasSongs(senderId, payload);
            }
            break;

        case "find_my_event_katy":
            {
                processQuickReplayChristmasSongs(senderId, payload);
            }
            break;

        case "the_notebook":
            {
                processQuickReplaySanValentin(senderId, payload);
            }
            break;
        case "me_before_you":
            {
                processQuickReplaySanValentin(senderId, payload);
            }
            break;
        case "romeo_juliet":
            {
                processQuickReplaySanValentin(senderId, payload);
            }
            break;

        case "la_bicicleta":
            {
                processQuickReplayShakira(senderId, payload);
            }
            break;
        case "chantaje":
            {
                processQuickReplayShakira(senderId, payload);
            }
            break;
        case "Rigondeaux":
            {
                processQuickReplayBox(senderId);

            }
            break;
        case "Lomachenko":
            {
                processQuickReplayBox(senderId);
            }
            break;

        case "find_my_event_rigo_vs_loma":
            {
                //startTevoModuleWithMlink("Top Rank Boxing: Vasyl Lomachenko vs. Guillermo Rigondeaux", senderId);
            }
            break;
        case "find_my_event_show_me_more":
            {

                //var MonthsQuickReply = require('../modules/tevo/months_replay');
                //MonthsQuickReply.send(Message, senderId, "Please choose month...");
                Message.markSeen(senderId);
                Message.getLocation(senderId, 'What location would you like to catch show?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');

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
                find_my_event(senderId);

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
                CategoriesQuickReplay.send(Message, senderId, "Pick a category:");

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.showMemore.index3 = -1;
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

                            Message.sendMessage(senderId, "What is the artist, sport team or event name?");


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
                Message.getLocation(senderId, 'What location would you like to catch show?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.showMemore.index2 = -1;
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
                        result.showMemore.index3 = -1;
                        result.save(function (err) {
                            if (!err) {
                                console.log('Guardamos laa categoria ' + categoria);
                                Message.markSeen(senderId);
                                Message.getLocation(senderId, 'What location would you like to catch show?');
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
                    Message.getLocation(senderId, 'What location would you like to catch show?');

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
            saveUserSelection(senderId, 'Events')

            break;

        case "GET_LOCATION_EVENTS":


            Message.markSeen(senderId);
            Message.getLocation(senderId, 'What location would you like to catch a show?');
            Message.typingOn(senderId);
            saveUserSelection(senderId, 'Events')


            break;

        case "GET_LOCATION_FOOD":

            Message.markSeen(senderId);
            Message.getLocation(senderId, 'What location would you like to get a bite at?');
            Message.typingOn(senderId);
            console.log('Dentro de GET LOCATION FOOD');
            console.log('Sender ID: ' + senderId);

            saveUserSelection(senderId, 'Food')




            break;


        default:
            console.log('Llamamos a Default');
            break;
    }
}


/**
 * 
 * @param {*} event objeto que trae la información del evento
 * @description Función que ha detectado la acción de un postback
 * 
 */
function processPostback(event) {


    var senderId = event.sender.id;
    var payload = event.postback.payload;
    console.log('processPostback ' + payload)


    switch (payload) {

        case "SUPER_BOWL_CHEER_TAKE_FOTO":
            {
                reqExternas.takePhoto(senderId)
            }
            break;

        case "VEGAS_SHOW":
            {
                startVegasShow(senderId, referral)
            }
            break;

        case "HAPPY_NEW_YEAR":
            {
                startHappyNewYear(senderId, referral)
            }
            break;
        case "VEGAS_SHOW":
            {
                startVegasShow(senderId, referral)
            }
            break;

        case "CHRISTMAS_SONGS":
            {
                startChristmasSongs(senderId, payload);
            }
            break;


        case "CHRISTMAS_PROMO":
            {
                startChristmas(senderId, payload);
            }
            break;

        case "SHAKIRA_PROMO":
            {
                starShakiraPromo(senderId, payload)
            }
            break;

        case "BLACK_FRIDAY":
            {
                starSixEvent(senderId, "BLACK_FRIDAY");
            }
            break;


        case "Rigondeaux" || "Lomachenko":
            {
                console.log("Rigondeaux  Lomachenko   ")
            }
            break;

        case "zomato_see_more_venues":
            {

                console.log("zomato_see_more_venues")
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionEnd': -1
                    }
                }, function (err, foundUser) {
                    let qs = foundUser.zomatoQs;
                    if (isDefined(qs)) {
                        if (isDefined(qs.start) && isDefined(qs.count)) {
                            qs.start = qs.start + 9
                            zomato.hasVenues(qs)

                            zomato.hasVenues(qs).then((tiene) => {
                                if (tiene === true) {
                                    zomato.starRenderFBTemplate(senderId, qs)
                                } else {
                                    qs.start = 1
                                    zomato.starRenderFBTemplate(senderId, qs)
                                }
                            })
                        }
                    }
                })

            }
            break;
        case "find_my_event_see_more_events_by_query":
            {
                console.log("find_my_event_see_more_events_by_query   ")
                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionEnd': -1
                    }
                }, function (err, foundUser) {


                    let query1 = foundUser.queryTevoFinal
                    let page = foundUser.page + 1
                    let per_page = foundUser.per_page

                    query1 = query1.replace('{{page}}', page);
                    query1 = query1.replace('{{per_page}}', per_page);
                    console.log('find_my_event_see_more_events_by_query query1 ' + query1)

                    let query = {
                        prioridad: 1,
                        searchBy: '-',
                        query: query1,
                        queryReplace: foundUser.queryTevoFinal,
                        queryPage: page,
                        queryPerPage: per_page,
                        messageTitle: ''
                    }

                    let userPreferences = {
                        event_title: '',
                        city: '',
                        artist: '',
                        team: '',
                        event_type: '',
                        music_genre: ''
                    }

                    tevoClient.getJSON(query1).then((json) => {
                        let salir = false;
                        if (json.error) {

                        } else {
                            if (json.events.length > 0) {
                                console.log('1- find_my_event_see_more_events_by_query json.events.length ' + json.events.length)
                                console.log('query.query ' + query.query)
                                TevoModule.start(senderId, query.query, 0, query.messageTitle, userPreferences, query);
                            } else {
                                query1 = foundUser.queryTevoFinal
                                page = 1
                                per_page = 9

                                query1 = query1.replace('{{page}}', page);
                                query1 = query1.replace('{{per_page}}', per_page);


                                query = {
                                    prioridad: 1,
                                    searchBy: '-',
                                    query: query1,
                                    queryReplace: foundUser.queryTevoFinal,
                                    queryPage: page,
                                    queryPerPage: per_page,
                                    messageTitle: ''
                                }

                                tevoClient.getJSON(query1).then((json) => {

                                    if (json.error) {

                                    } else {
                                        if (json.events.length > 0) {
                                            console.log('2- find_my_event_see_more_events_by_query json.events.length ' + json.events.length)
                                            console.log('query.query ' + query.query)
                                            TevoModule.start(senderId, query.query, 0, query.messageTitle, userPreferences, query);
                                        } else {
                                            console.log('No hay eventos O_O, imposible!! ')

                                        }
                                    }
                                }).catch((err) => {
                                    console.log('Error' + err)
                                })
                            }
                        }
                    }).catch((err) => {
                        console.log('Error' + err)
                    })




                });

            }
            break;

        case "find_my_event_see_more_events_by_cat_loc":
            {

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    let lat = foundUser.location.coordinates[0];
                    let lon = foundUser.location.coordinates[1];

                    let totalElements = foundUser.categorySearchSelected.length;
                    let category = foundUser.categorySearchSelected[totalElements - 1];

                    var tevo = require('../modules/tevo/tevo');
                    tevo.startByParentsCategoriesAndLocation(senderId, category, lat, lon)
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;



        case "find_my_event_see_more_events_by_location":
            {

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    let lat = foundUser.location.coordinates[0];
                    let lon = foundUser.location.coordinates[1];
                    startTevoModuleByLocation(senderId, lat, lon);
                    foundUser.context = ''
                    foundUser.save();
                });

            }
            break;


        case "find_my_event_see_more_events":
            {
                var busqueda = ''
                startTevoModuleWithMlink(busqueda, senderId)
                saveContext(senderId, '-')

            }
            break;

        case "find_my_event_show_me_more":
            {

                //var MonthsQuickReply = require('../modules/tevo/months_replay');
                //MonthsQuickReply.send(Message, senderId, "Please choose month...");
                Message.markSeen(senderId);
                Message.getLocation(senderId, 'What location would you like to catch show?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');
                saveContext(senderId, '-')

            }
            break;

        case "find_my_event_search_event":
            {
                var SearchQuickReply = require('../modules/tevo/search_quick_replay');
                SearchQuickReply.send(Message, senderId);

                saveContext(senderId, '-')

            }
            break;

        case "find_my_event_by_name":
            {

                Message.sendMessage(senderId, "What is the artist, sport team or event name?t");
                context = 'find_my_event_by_name'

                saveContext(senderId, '-')

            }
            break;

        case "find_my_event_by_location":
            {


                Message.markSeen(senderId);
                Message.getLocation(senderId, 'What location would you like to catch show?');
                Message.typingOn(senderId);
                saveUserSelection(senderId, 'Events');

                UserData2.findOne({
                    fbId: senderId
                }, {}, {
                    sort: {
                        'sessionStart': -1
                    }
                }, function (err, foundUser) {
                    foundUser.context = ''
                    foundUser.showMemore.index2 = -1;
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
                saveContext(senderId, '-')

            }
            break;


        case "FIND_MY_EVENT":
            find_my_event(senderId);


            break;

            //inicio
        case "Greetings":


            if (undefined !== event.postback.referral) {
                // Comprobamos que exista el comando de referencia y mostramos la correspondiente tarjeta.
                console.log('Esta definido event.postback.referral ');
                handleReferrals(event);
            } else {
                console.log('NO Esta definido event.postback.referral ');
                console.log('Greetings');
                saluda(senderId);
            }


            break;


        default:
            UserData2.findOne({
                fbId: senderId
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, foundUser) {
                if (!err) {
                    if (foundUser) {
                        console.log('Found User  BLACK_FRIDAY<< ' + payload);
                        if (foundUser.mlinkSelected == "BLACK_FRIDAY") {
                            startTevoModuleWithMlink(payload, senderId);

                        } else {
                            console.log('No guardé el mlink ?? O_O << ' + foundUser.mlinkSelected);
                        }
                        if (foundUser.mlinkSelected == "CHRISTMAS_PROMO") {
                            startTevoModuleWithMlink(payload, senderId);

                        } else {
                            console.log('No guardé el mlink DE  CHRISTMAS_PROMO ?? O_O << ' + foundUser.mlinkSelected);
                        }

                        if (foundUser.mlinkSelected == "CHRISTMAS_SONGS") {
                            startTevoModuleWithMlink(payload, senderId);

                        } else {
                            console.log('No guardé el mlink DE  CHRISTMAS_SONGS ?? O_O << ' + foundUser.mlinkSelected);
                        }

                        if (foundUser.mlinkSelected == "VEGAS_SHOW") {
                            startTevoModuleWithMlink(payload, senderId);

                        } else {
                            console.log('No guardé el mlink DE  SHOW_VEGAS ?? O_O << ' + foundUser.mlinkSelected);
                        }

                        if (foundUser.mlinkSelected == "HAPPY_NEW_YEAR") {
                            startTevoModuleWithMlink(payload, senderId);

                        } else {
                            console.log('No guardé el mlink DE  HAPPY_NEW_YEAR ?? O_O << ' + foundUser.mlinkSelected);
                        }

                        if (foundUser.mlinkSelected == "SAN_VALENTIN") {

                            let page = 1
                            let per_page = 9

                            let city = foundUser.searchTevoParameters.city
                            let startDate = '20180201T000000'
                            startDate = moment()
                            startDate = moment(startDate, moment.ISO_8601).format()
                            startDate = startDate.substring(0, startDate.length - 6)

                            let finalDate = '20180218T230000'




                            var query = {
                                prioridad: 1,
                                searchBy: 'NameAndCityAndDate',
                                query: tevo.API_URL + 'events?q=' + payload + '&page=' + page + '&per_page=' + per_page + '&city_state=' + city + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                queryReplace: tevo.API_URL + 'events?q=' + payload + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&city_state=' + city + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                queryPage: page,
                                queryPerPage: per_page,
                                messageTitle: 'Cool, I looked for "' + payload + '" ' + city + ' shows.  Book a ticket'
                            }



                            TevoModule.start(senderId, query.query, 0, query.messageTitle, {}, query);


                        } else {
                            console.log('No guardé el mlink DE  SAN_VALENTIN ?? O_O << ' + foundUser.mlinkSelected);
                        }

                    }
                }

            });



            break;

    }



}

/**
 * 
 * @param {*} senderId Facebook user id
 * @param {*} hi 
 * @param {*} event_name 
 * @description Función que se ejecuta cuando no se encuentra el evento buscado...
 * 
 */
var find_my_event = (senderId, hi = 0, event_name = '') => {
    user_queries.createUpdateUserDatas(senderId, '-').then((foundUser) => {
        let name = foundUser.firstName
        var greeting = "Hi " + name;
        var messagetxt = greeting + ", you can search events by:";
        if (hi == 1) {
            messagetxt = 'I didn’t find any of that. ' + name + ", you can search events by:";
            greeting = name;
        }

        var SearchQuickReply = require('../modules/tevo/search_init_quick_replay');
        SearchQuickReply.send(Message, senderId, messagetxt);
    })
};


/**
 * 
 * @param {*} senderId Facebook user id
 * @param {*} context
 * @description Función para actualizar el contexto
 * 
 */
function saveContext(senderId, context) {
    user_queries.createUpdateUserDatas(senderId, context)
}


/**
 * 
 * @param {*} senderId Facebook user id
 * @param {*} selection selection optionSelect en la tabla userdatas.
 * @description Función para guardar la optionSelect
 * 
 */
function saveUserSelection(senderId, selection) {
    user_queries.createUpdateUserDatas(senderId, '', '', {}, '', '', '', 0, 0, '', '', '', '', '', '', '', selection)
}

/**
 * 
 * @param {*} senderId Facebook user id
 * @param {*} category selection category en la tabla userdatas.
 * @description Función para guardar la category
 * 
 */
function saveCategorySelection(senderId, category) {
    user_queries.createUpdateUserDatas(senderId, 'find_my_event_by_category', '', {}, '', '', '', 0, 0, '', '', '', '', '', '', category)
}

/**
 * 
 * @param {*} senderId Facebook user id
 * @description Función para saludar el usuario envia los quick replay de Food Drink y Events
 * 
 */
function saluda(senderId) {
    console.log('entré a saluda!')
    var Message_2 = require('../bot/generic_buttton');

     user_queries.createUpdateUserDatas(senderId, '-').then((foundUser) => {   
         
        let buttons = [{
                "type": "web_url",
                "url": "https://pepper-bussines.herokuapp.com/?"+senderId,
                "title": "My Artists",
               // webview_height_ratio: "tall",
                //messenger_extensions: "true",  
            } 
       ]

       Message_2.listButtons( senderId,  'Select your favorite Artists ', buttons  )
    
        let name = foundUser.firstName
        var greeting = "Hi " + name;
        var messagetxt = greeting + ", what would you like to do?";
        Message.markSeen(senderId);
        Message.typingOn2(senderId, function (error, response, body) {
            var GreetingsReply = require('../modules/greetings');
            GreetingsReply.send(Message, senderId, messagetxt);

        });
    })
};


/**
 * 
 * @param {*} event event
 * @description Función que detecta el uso de un MLINK del bot. 
 * Función que verificar si el short link viene de una ventana nueva
 * o una conversación PRE-EXISTENTE
 * 
 */
function handleReferrals(event) {
    var senderId = event.sender.id;
    var referral;
    if (undefined !== event.postback) {

        referral = event.postback.referral.ref;
        console.log('event.postback.referral.ref ' + referral)
        chooseReferral(referral, senderId);
    } else {
        // Msgr tiene un error, cuando detecta que ya es una conversacion abierta
        // envia 3 requests y por ende repite los mensajes, para evitar esto
        // se almacena el id en mongodb hasta la 3ra vuelta se envia la informacion 
        // no se si esto es problema de msgr como tal o heroku (quiero pensar que es de msgr)        
        referral = event.referral.ref;
        console.log('event.referral.ref ' + referral)
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

/**
 * 
 * @param {*} referral event
 * @param {*} senderId FaceBook User Id
 * @description Función que  procesa el uso de un MLINK
 * 
 */
function chooseReferral(referral, senderId) {

    // Esta funcion nos permite agregar mas tipos de referrals links, unicamente agregando en case 
    // y llamando a su modulo correspondiente.
    console.log('referral' + referral)
    user_queries.createUpdateUserDatas(senderId, '', referral).then(() => {
        switch (referral) {

            case "SAN_VALENTIN_CHICAGO":
                {
                    let searchTevoParameters = {
                        city: 'Chicago'
                    }
                    user_queries.createUpdateUserDatas(senderId, '', 'SAN_VALENTIN', '', '', '', '', 0, 0, '', '', '', '', 'Las Vegas Events', '', '', '', '', 0, 0, {}, searchTevoParameters).then(() => {

                    })
                    startSanValentin(senderId, referral)
                }
                break; 


            case "SAN_VALENTIN_SAN_FRANCISCO":
                {
                    let searchTevoParameters = {
                        city: 'San Francisco'
                    }
                    user_queries.createUpdateUserDatas(senderId, '', 'SAN_VALENTIN', '', '', '', '', 0, 0, '', '', '', '', 'Las Vegas Events', '', '', '', '', 0, 0, {}, searchTevoParameters).then(() => {

                    })
                    startSanValentin(senderId, referral)
                }
                break; 


            case "SAN_VALENTIN_NEW_YORK":
                {
                    let searchTevoParameters = {
                        city: 'New York'
                    }
                    user_queries.createUpdateUserDatas(senderId, '', 'SAN_VALENTIN', '', '', '', '', 0, 0, '', '', '', '', 'Las Vegas Events', '', '', '', '', 0, 0, {}, searchTevoParameters).then(() => {

                    })
                    startSanValentin(senderId, referral)
                }
                break; 


            case "SAN_VALENTIN_LAS_VEGAS":
                {
                    let searchTevoParameters = {
                        city: 'Las Vegas'
                    }
                    user_queries.createUpdateUserDatas(senderId, '', 'SAN_VALENTIN', '', '', '', '', 0, 0, '', '', '', '', 'Las Vegas Events', '', '', '', '', 0, 0, {}, searchTevoParameters).then(() => {

                    })
                    startSanValentin(senderId, referral)
                }
                break; 


            case "CHAMPIONS_LEAGUE": // Here we create the new CASE w new Me Link name 02/27/18
                {
                    startChampionsLeagueFrame(senderId, referral) //We create a new variable
                }
                break;

            case "BARCELONA_CHELSEA": // Here we create the new casw w New Me Link 
                {
                    startBarcaVsChelsea(senderId, referral) //We create a new variable
                }
                break;

            case "REALMADRID_FRAME": // Here we create the new CASE w new Me Link name on 02/28/18
                {
                    startRealMadridFrame(senderId, referral) //We create a new variable
                }
                break;

            case "BAR_v_CHE_FRAME": // Here we create the new CASE w new Me Link name on 02/28/18
                {
                    startBarVsCheFrame(senderId, referral) //We create a new variable
                }
                break;
            
            case "MARDIGRAS_FRAME": // Here we create the new CASE w new Me Link name 02/09/18
                {
                    startMardiGrasFrame(senderId, referral) //We create a new variable
                }
                break;

            case "VALENTINE_FRAME_CHEER": // Here we create the new CASE w new Me Link name
                {
                    startValentineFrameCheer(senderId, referral) //We create a new variable
                }
                break;

            case "SUPERBOWL_CHEER": // Here we create the new CASE w new Me Link name
                {
                    startSuperBowlCheer(senderId, referral) //We create a new variable
                }
                break;

            case "NEW_YEAR_MASSIVE":
                {
                    startNYMassive(senderId, referral)
                }
                break;

            case "HappyNewYear":
                {
                    startHappyNewYear(senderId, referral, false)
                }
                break;

            case "HAPPY_NEW_YEAR":
                {
                    startHappyNewYear(senderId, referral)
                }
                break;


            case "VEGAS_SHOW":
                {
                    startVegasShow(senderId, referral)
                }
                break;

            case "SUPER_BOWL":
                {

                    startSuperBowl(senderId, referral)
                }
                break;
            case "CHRISTMAS_SONGS":
                {
                    startChristmasSongs(senderId, referral)
                }
                break;
            case "CHRISTMAS_PROMO":
                {
                    startChristmas(senderId, referral)
                }
                break;
            case "SHAKIRA_PROMO":
                {

                    starShakiraPromo(senderId, referral);
                }

                break;


            case "BLACK_FRIDAY":
                {

                    starSixEvent(senderId, referral);
                }

                break;
            case "RIGOVSLOMA":
                {
                    startPepperQUiz(senderId);
                }
                break;


            case "MAGICON":
                {

                    var Magic = require('../modules/boletos');
                    Magic.start(senderId);

                }
                break;

            case "OSCARS":
                {
                    var Oscars = require('../modules/oscars');
                    Oscars.start(senderId);

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
                    sendToApiAi(senderId, referral)


                }
                break;

        }
    })
}






/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral  mlink
 * @description Función  para  inciar el mlink de la champions league
 * 
 */
var startChampionsLeagueFrame = (senderId, referral) => {
    let championsModule = require('../modules/tevo/champions/champions')
    championsModule.startChampionsLeagueFrame(senderId)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral  mlink
 * @description Función  para  inciar el mlink de la champions league
 * 
 */
var startBarcaVsChelsea = (senderId, referral) => {
    let championsModule = require('../modules/tevo/champions/champions')
    championsModule.startBarcaVsChelsea(senderId)
}


/**
 * 
 * @param {*} senderId FaceBook User Id
 * @description Función startPepperQUiz
 * 
 */
function startPepperQUiz(senderId) {
    var QuizModule = require('../modules/quiz/quiz')
    QuizModule.start(senderId);

}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var starShakiraPromo = (senderId, referral) => {
    var promoModule = require('../modules/promo/shakira')
    promoModule.startShakira(senderId);
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startSuperBowl = (senderId, referral) => {
    var superBowlModule = require('../modules/tevo/super_bowl/super_bowl')
    superBowlModule.startSuperBowl(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startVegasShow = (senderId, referral) => {
    var vegasShowModule = require('../modules/tevo/vegas_show/vegas_show')
    vegasShowModule.startVegasShow(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startHappyNewYear = (senderId, referral, con = true) => {
    var happyNewYearModule = require('../modules/tevo/happy_new_year/happy_new_year')
    happyNewYearModule.startHappyNewYear(senderId, referral, con)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startNYMassive = (senderId, referral) => {
    var NYMassiveModule = require('../modules/tevo/happy_new_year/new_year_massive')
    NYMassiveModule.startNYMassive(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startSanValentin = (senderId, referral) => {
    var sanValentinModule = require('../modules/tevo/san_valentin/san_valentin')
    sanValentinModule.startSanValentin(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startSuperBowlCheer = (senderId, referral) => {
    var superBowlCheerModule = require('../modules/tevo/super_bowl/super_bowl_cheer.js')
    superBowlCheerModule.startSuperBowl(senderId, referral)
}

// Created Mar 08
/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startBarVsCheFrame = (senderId, referral) => {
    var BarVsCheFrameModule = require('../modules/tevo/champions/barcelonaChelsea_frame.js')
    BarVsCheFrameModule.startBarVsCheFrame(senderId, referral)
}


// Created Feb 28
/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startRealMadridFrame = (senderId, referral) => {
    var realMadridFrameModule = require('../modules/tevo/champions/realmadrid_frame.js')
    realMadridFrameModule.startRealMadridFrame(senderId, referral)
}

// Created Feb 9
/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startMardiGrasFrame = (senderId, referral) => {
    var mardiGrasFrameModule = require('../modules/tevo/mardigras/mardigras_frame.js')
    mardiGrasFrameModule.startMardiGrasFrame(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startValentineFrameCheer = (senderId, referral) => {
    var valentineFrameCheerModule = require('../modules/tevo/san_valentin/valentine_frame_cheer.js')
    valentineFrameCheerModule.startValentineFrame(senderId, referral)
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startChristmasSongs = (senderId, referral) => {
    var chirstmasSongsModule = require('../modules/tevo/chirstmas/christmas_songs')
    chirstmasSongsModule.startChirstmasSongs(senderId);
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
var startChristmas = (senderId, referral) => {
    var chirstmasModule = require('../modules/tevo/chirstmas/christmas')
    chirstmasModule.startChirstmas(senderId);
}

/**
 * 
 * @param {*} senderId FaceBook User Id
 * @param {*} referral Variable ref que se encia con el vinculo del bot
 * @description Función 
 * 
 */
function starSixEvent(senderId, referral) {
    var SixtEventModule = require('../modules/tevo/six_event/six_event')
    SixtEventModule.start(senderId);
}


/**
 * 
 * @param {*} event_name nombre del evento
 * @param {*} senderId  FaceBook Id
 * @param {*} mlink  
 * @param {*} cool  
 * @param {*} messageTitle  Titulo que llevarán las tarjetas
 * @description Función que inicia la busqueda de tarjetas por nombre de evento.
 * 
 */
function startTevoModuleWithMlink(event_name, senderId, mlink = 0, cool = 0, messageTitle = "") {
    let page = 1 
    let per_page = 9
    console.log("event_name " + event_name);
    let userPreferences = {
        event_title: '',
        city: '',
        artist: '',
        team: '',
        event_type: '',
        music_genre: ''
    }

    let query = {
        prioridad: 4,
        searchBy: 'ByName',
        //query: tevo.API_URL + 'events?q=' + event_name + '&page=' + page + '&per_page=' + per_page + '&' + only_with + '&order_by=events.occurs_at',
        //queryReplace: tevo.API_URL + 'events?q=' + event_name + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&' + only_with + '&order_by=events.occurs_at',
        query: tevo.API_URL + 'events?q=' + event_name  + '&' + only_with + '&page=' + page + '&per_page=' + per_page + '&order_by=events.occurs_at',
        queryReplace: tevo.API_URL + 'events?q=' + event_name + '&' + only_with + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' + '&order_by=events.occurs_at'  ,

        queryPage: page,
        queryPerPage: per_page,
        messageTitle: 'Cool, I looked for "' + event_name + '" shows.  Book a ticket'
    }

    console.log('query.query ' + query.query)
     nlp.tevoByQuery(senderId, query, userPreferences).then((cantidad) => {
        if (cantidad == 0) {
            find_my_event(senderId, 1, '')
        }
    }) 

}

/**
 * 
 * @param {*} sender nombre del evento
 * @param {*} lat Latitud
 * @param {*} lat Longitud
 * @description Función que inicia la busqueda de tarjetas por coordenadas
 * 
 */
function startTevoModuleByLocation(sender, lat, lon) {
    let page = 1
    let per_page = 9

    var query = {
        prioridad: 1,
        searchBy: 'Location',
        query: tevo.API_URL + 'events?lat=' + lat + '&lon=' + lon + '&' + only_with + '&order_by=events.occurs_at,events.popularity_score DESC' + '&page=' + page + '&per_page=' + per_page +  '&within=100',
        queryReplace: tevo.API_URL + 'events?lat=' + lat + '&lon=' + lon + '&' + only_with + '&order_by=events.occurs_at,events.popularity_score DESC' + '&page=' + '{{page}}' + '&per_page=' + '{{per_page}}' +  '&within=100',
        queryPage: page,
        queryPerPage: per_page,
        messageTitle: 'Cool, I found events in your location.  Book a ticket'
    }


    var userPreferences = {
        event_title: '',
        city: '',
        artist: '',
        team: '',
        event_type: '',
        music_genre: ''
    }

    nlp.tevoByQuery(sender, query, userPreferences).then((cantidad) => {
        if (cantidad == 0) {
            var ticketMaster = require('../modules/tevo/ticket_master_request');
            ticketMaster.get(Message, sender, lat, lon);
        }
    })

}

module.exports = {
    router,
    initFBEvents,
    intitGetFB
};