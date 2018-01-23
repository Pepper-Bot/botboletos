'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var Message = require('../bot/messages');
var UserData = require('../bot/userinfo');
var UserData2 = require('../schemas/userinfo');
var API_AI_CLIENT_ACCESS_TOKEN = require('../config/config_vars').API_AI_CLIENT_ACCESS_TOKEN;
var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require('../config/config_vars').PAGE_ACCESS_TOKEN;

var FB_APP_SECRET = require('../config/config_vars').FB_APP_SECRET;

var TevoClient = require('ticketevolution-node');
var only_with = require('../config/config_vars').only_with;
var tevo = require('../config/config_vars').tevo;
var tevoCategories = require('../modules/tevo/tevo');


const apiai = require('apiai');
const crypto = require('crypto');
const uuid = require('uuid');
var moment = require('moment');


var user_queries = require('../schemas/queries/user_queries');
var TevoModule = require('../modules/query_tevo_request');


const apiAiService = apiai(API_AI_CLIENT_ACCESS_TOKEN, {
    language: "en",
    requestSource: "fb"
});

const tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});


const sessionIds = new Map();
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
    var data = req.body;
    console.log(JSON.stringify(data));



    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {

                if (messagingEvent.referral) {
                    handleReferrals(messagingEvent);
                }
                if (messagingEvent.optin) {
                    receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    receivedMessage(messagingEvent); //Function that that handles everything our visitor will write to the bot
                } else if (messagingEvent.delivery) {
                    receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        // You must send back a 200, within 20 seconds
        res.sendStatus(200);
    }
});




function receivedMessage(event) {

    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    if (!sessionIds.has(senderID)) {
        sessionIds.set(senderID, uuid.v1());
    }
    //console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    //console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        handleEcho(messageId, appId, metadata);
        return;
    } else if (quickReply) {
        handleQuickReply(senderID, quickReply, messageId);
        return;
    }


    if (messageText) {
        //send message to api.ai
        //
        var userSays = {
            typed: messageText
        }
        if (messageText != '') {
            //senderId, context = '', mlinkSelected = '', userSays = {}, eventSearchSelected = '', querysTevo = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0
            user_queries.createUpdateUserDatas(senderID, '', '', userSays).then((foundUser) => {
                sendToApiAi(senderID, messageText);
            })
        }

    } else if (messageAttachments) {
        handleMessageAttachments(messageAttachments, senderID);
    }
}




function handleMessageAttachments(messageAttachments, senderId) {

    if ('location' == messageAttachments[0].type) {
        processLocation(senderId, messageAttachments);
        console.log("Procesando ubicación!!" + JSON.stringify(messageAttachments));
    }

}



function handleQuickReply(senderId, quickReply, messageId) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
    //send payload to api.ai
    switch (quickReplyPayload) {

        case "find_my_event_by_location":
            {

                Message.markSeen(senderId);
                Message.getLocation(senderId, 'What location would you like to catch show?');
                Message.typingOn(senderId);

                //senderId, context = '', mlinkSelected = '', eventSearchSelected = '', querysTevo = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0
                user_queries.createUpdateUserDatas(senderId, '-', '', '', '', '', '', 'Events')




                break;
            }
        case "find_my_event_search_event":
            {
                find_my_event(senderId);

                break;
            }

        default:
            {
                sendToApiAi(senderId, quickReplyPayload);
                break;
            }
    }


}


var processQuickReplayShakira = (senderId, payload) => {
    console.log("Shakira votación Module " + payload)
    Message.markSeen(senderId);
    var shakiraModule = require('../modules/promo/shakira');
    shakiraModule.sendMessageAndChoiceImage(senderId, payload);
}

var processQuickReplayChristmasSongs = (senderId, payload) => {
    console.log("ChristmasSongs votación Module " + payload)
    Message.markSeen(senderId);
    var christmasSongsModule = require('../modules/tevo/chirstmas/christmas_songs');
    christmasSongsModule.sendMessageAndChoiceImage(senderId, payload);
}

var processQuickReplaySuperBowl = (senderId, payload) => {
    console.log("SuperBowl Module " + payload)
    Message.markSeen(senderId);
    var superBowlModule = require('../modules/tevo/super_bowl/super_bowl');
    superBowlModule.sendMessageAndChoiceImage(senderId, payload);
}




function processQuickReplayBox(senderId) {

    console.log("Rigondeaux  Lomachenko   ")
    Message.markSeen(senderId);

    //Message.sendMessage(senderId, "Results:");
    //resultados...
    var rigovslomaQuickReplay = require('../modules/quiz/rigo_vs_loma_quick_replay');
    rigovslomaQuickReplay.send(Message, senderId);

}




function processLocation(senderId, locationData) {
    let lat = locationData.payload.coordinates.lat;
    let lon = locationData.payload.coordinates.long;

    user_queries.createUpdateUserDatas(senderId).then((foundUser) => {

        console.log("Process Location foundUser %s  lat  %d  lon  %d", foundUser.fbId, lat, lon);


       /* if (foundUser.context == "find_my_event_by_category") {
            let totalElements = foundUser.categorySearchSelected.length;
            let category = foundUser.categorySearchSelected[totalElements - 1];

            tevoCategories.startByParentsCategoriesAndLocation(senderId, category, lat, lon)
            user_queries.createUpdateUserDatas(senderId, '-')
        } else {


            var totalElements = foundUser.optionsSelected.length;
            console.log('foundUser.optionsSelected.length %s', )
            if (totalElements < 1) {
                return;
            }

            var lastSelected = foundUser.optionsSelected[totalElements - 1];

            console.log('lastSelected >>' + lastSelected)
            if ('Food' == lastSelected) {
                var Food = require('../modules/food');
                Food.get(Message, foundUser, locationData);

            } else if ('Events' == lastSelected) {


                let page = 1;
                let per_page = 50;
                let page_per_page = '&page=' + page + '&per_page=' + per_page
                let query = {
                    searchBy: 'ByLocation',
                    query: tevo.API_URL + 'events?order_by=events.occurs_at,events.popularity_score DESC&lat=' + lat + '&lon=' + lon + '&page=1&per_page=50&' + only_with + '&within=100',
                    messageTitle: 'Cool, I looked for your selected Location.  Book a ticket'
                }
                TevoModule.start(senderId, query.query, 1, query.messageTitle);


            } else if ('Drinks' == lastSelected) {

                var Drink = require('../modules/drink');
                Drink.get(Message, result, locationData);

            }


        }

        foundUser.location.coordinates = [lat, lon];
        foundUser.locationURL = locationData.url;
        foundUser.save(function (err) {
            if (!err) {

                console.log('Guardamos la localizacion');
            } else {
                console.log('Error guardando selección')
            }
        });*/
    })


}

//https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-echo
function handleEcho(messageId, appId, metadata) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
}


function handleApiAiAction(sender, response, action, responseText, contexts, parameters) {
    console.log('>> handleApiAiAction');
    switch (action) {
        case "events.search":
            {
                console.log(" Action events.search >>> ");

                //console.log("handleApiAiResponse >>> " + JSON.stringify(response));
                //console.log("handleApiAiResponse contexts>>> " + JSON.stringify(contexts));


                let city = ''
                let country = ''
                let artist = ''
                let date_time = ''
                let date_time_original = ''
                let event_title = ''
                let startDate = ''
                let finalDate = ''
                if (isDefined(contexts[0]) && contexts[0].name == 'eventssearch-followup' && contexts[0].parameters) {
                    if ((isDefined(contexts[0].parameters.location))) {
                        if (isDefined(contexts[0].parameters.location.city)) {
                            city = contexts[0].parameters.location.city
                            console.log('city>> ' + city)
                        } else {
                            if (isDefined(contexts[0].parameters.location.country)) {
                                country = contexts[0].parameters.location.country
                                console.log('country>> ' + country)
                                city = country
                            }
                        }

                    }

                    if ((isDefined(contexts[0].parameters.date_time))) {
                        if (contexts[0].parameters.date_time != "") {
                            date_time = contexts[0].parameters.date_time


                            var cadena = date_time,
                                separador = "/",
                                arregloDeSubCadenas = cadena.split(separador);

                            if (isDefined(arregloDeSubCadenas[0])) {

                                startDate = arregloDeSubCadenas[0]

                                if (moment(startDate).isSameOrAfter(moment())) {
                                    console.log('Es mayor !!')

                                } else {
                                    console.log('La fecha inicial es menor a la actual!!!')
                                    startDate = moment()
                                }


                                startDate = moment(startDate, moment.ISO_8601).format()


                                startDate = startDate.substring(0, startDate.length - 6)




                                console.log("startDate>>> " + startDate);


                            }

                            if (isDefined(arregloDeSubCadenas[1])) {
                                finalDate = arregloDeSubCadenas[1]
                                finalDate = moment(finalDate, moment.ISO_8601).format()
                                finalDate = finalDate.substring(0, finalDate.length - 6)

                                console.log("finalDate>>> " + finalDate);
                            }

                            if (finalDate == '') {
                                finalDate = moment(startDate, moment.ISO_8601).endOf('day').format();
                                finalDate = finalDate.substring(0, finalDate.length - 6)
                                console.log("finalDate = startDate >>> " + finalDate);
                            }




                            console.log('date_time>> ' + date_time)

                        }

                    }

                    if ((isDefined(contexts[0].parameters.artist))) {
                        if (contexts[0].parameters.artist != "") {
                            artist = contexts[0].parameters.artist
                            console.log('artist>> ' + artist)
                        }
                    }

                    if ((isDefined(contexts[0].parameters.event_title))) {
                        if (contexts[0].parameters.event_title != "") {
                            event_title = contexts[0].parameters.event_title
                            console.log('event_title>> ' + event_title)
                        }
                    }
                    var urlApiTevo = ''
                    var urlsApiTevo = []

                    if (artist != '') {
                        event_title = artist
                    }




                    var page = 1;
                    var per_page = 50;
                    var page_per_page = '&page=' + page + '&per_page=' + per_page

                    var arrayQueryMessages = []


                    if (event_title != '') {
                        if (city != '') {
                            if (date_time != '') {
                                var queryMessage = {
                                    prioridad: 1,
                                    searchBy: 'NameAndCityAndDate',
                                    query: tevo.API_URL + 'events?q=' + event_title + page_per_page + '&city_state=' + city + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                    messageTitle: 'Cool, I looked for "' + event_title + '" ' + city + ' shows.  Book a ticket'
                                }
                                arrayQueryMessages.push(queryMessage)
                            }
                        }


                        if (city != '') {
                            var queryMessage = {
                                prioridad: 2,
                                searchBy: 'NameAndCity',
                                query: tevo.API_URL + 'events?q=' + event_title + page_per_page + '&city_state=' + city + '&' + only_with + '&order_by=events.occurs_at',
                                messageTitle: 'Cool, I looked for "' + event_title + '" ' + city + ' shows.  Book a ticket'
                            }
                            arrayQueryMessages.push(queryMessage)
                        }

                        if (date_time != '') {
                            var queryMessage = {
                                prioridad: 3,
                                searchBy: 'NameAndDate',
                                query: tevo.API_URL + 'events?q=' + event_title + page_per_page + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                messageTitle: 'Cool, I looked for "' + event_title + '" at ' + date_time + ' shows.  Book a ticket'
                            }
                            arrayQueryMessages.push(queryMessage)
                        }


                        var queryMessage = {
                            prioridad: 4,
                            searchBy: 'ByName',
                            query: tevo.API_URL + 'events?q=' + event_title + page_per_page + '&' + only_with + '&order_by=events.occurs_at',
                            messageTitle: 'Cool, I looked for "' + event_title + '" at ' + date_time + ' shows.  Book a ticket'
                        }
                        arrayQueryMessages.push(queryMessage)



                        /*if (city != '') {
                            if (date_time != '') {
                                var queryMessage = {
                                    prioridad: 5,
                                    searchBy: 'CityAndDate',
                                    query: tevo.API_URL + 'events?city_state=' + city + page_per_page + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                    messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                                }
                                arrayQueryMessages.push(queryMessage)
                            }
                        }

                        if (city != '') {
                            var queryMessage = {
                                prioridad: 6,
                                searchBy: 'City',
                                query: tevo.API_URL + 'events?city_state=' + city + page_per_page + '&' + only_with + '&order_by=events.occurs_at',
                                messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                            }
                            arrayQueryMessages.push(queryMessage)
                        }*/

                    } else {
                        if (city != '') {
                            if (date_time != '') {
                                var queryMessage = {
                                    prioridad: 1,
                                    searchBy: 'CityAndDate',
                                    query: tevo.API_URL + 'events?city_state=' + city + page_per_page + '&occurs_at.gte=' + startDate + '&occurs_at.lte=' + finalDate + '&' + only_with + '&order_by=events.occurs_at',
                                    messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                                }
                                arrayQueryMessages.push(queryMessage)
                            }
                        }
                        if (city != '') {
                            var queryMessage = {
                                prioridad: 2,
                                searchBy: 'City',
                                query: tevo.API_URL + 'events?city_state=' + city + page_per_page + '&' + only_with + '&order_by=events.occurs_at',
                                messageTitle: 'Cool, I looked for ' + city + ' shows.  Book a ticket'
                            }
                            arrayQueryMessages.push(queryMessage)
                        }
                    }

                    //setTimeout(function () {}, 1000);


                    if (responseText === "end.events.search") {
                        if (city != '') {
                            console.log('end.events.search city< ' + city)
                            if (date_time != '') {
                                console.log('end.events.search date_time< ' + date_time)

                                startTevoByQuery(arrayQueryMessages).then((query) => {
                                    if (query.query) {
                                        console.log("query Tevo >>> " + JSON.stringify(query));
                                        TevoModule.start(sender, query.query, 1, query.messageTitle);
                                    } else {
                                        console.log('Not Found Events')
                                        find_my_event(sender, 1, '');

                                    }

                                })

                            }
                        }
                    }

                }


                if (responseText != "end.events.search") {
                    sendTextMessage(sender, responseText);
                }






                break;
            }
        case "detalied-application":
            {
                if (isDefined(contexts[0]) && contexts[0].name == 'job_application' && contexts[0].parameters) {
                    let call_number =
                        (isDefined(contexts[0].parameters['call-number']) && contexts[0].parameters['call-number'] != '') ?
                        contexts[0].parameters['call-number'] :
                        "";




                    let user_name =
                        (isDefined(contexts[0].parameters['user-name']) && contexts[0].parameters['user-name'] != '') ?
                        contexts[0].parameters['user-name'] :
                        "";



                    let previous_job =
                        (isDefined(contexts[0].parameters['previous-job']) && contexts[0].parameters['previous-job'] != '') ?
                        contexts[0].parameters['previous-job'] :
                        "";



                    let years_of_experience =
                        (isDefined(contexts[0].parameters['years-of-experience']) && contexts[0].parameters['years-of-experience'] != '') ?
                        contexts[0].parameters['years-of-experience'] :
                        "";


                    let job_vacancy =
                        (isDefined(contexts[0].parameters['job-vacancy']) && contexts[0].parameters['job-vacancy'] != '') ?
                        contexts[0].parameters['job-vacancy'] :
                        "";



                    if (
                        call_number != '' &&
                        user_name != '' &&
                        user_name != '' &&
                        previous_job != '' &&
                        years_of_experience != '' &&
                        job_vacancy != ''
                    ) {


                        let emailContent =
                            'A new job-enquiry from ' + user_name +
                            ' for the job: ' + job_vacancy +
                            '<br> Previos Job-Positiion: ' + previous_job +
                            '<br> Years of experience: ' + years_of_experience +
                            '<br> Phone Number: ' + call_number;

                        sendEmail("New Job Application ", emailContent);






                    } //fin de validación de parametros








                }

                sendTextMessage(sender, responseText);





                break;
            }
        case "job-enquiry":
            {
                let replies = [{
                        "content_type": "text",
                        "title": "Accountant",
                        "payload": "Accountant"

                    },
                    {
                        "content_type": "text",
                        "title": "Sales",
                        "payload": "Sales"

                    },
                    {
                        "content_type": "text",
                        "title": "Not interested",
                        "payload": "Not interested"

                    }
                ];


                sendQuickReply(sender, responseText, replies);

                break;
            }
        default:
            //unhandled action, just send back the text
            sendTextMessage(sender, responseText);
    }
}

function find_my_event(senderId, hi = 0, event_name = '') {

    user_queries.createUpdateUserDatas(senderId, '').then((foundUser) => {
        //var greeting = "Hi " + foundUser.firstName;
        //console.log("foundUser de  find_my_event >>> " + JSON.stringify(foundUser));
        var greeting = foundUser.firstName;
        var messagetxt = greeting + ", you can search events by:";
        if (hi == 1) {
            messagetxt = 'Oops, I looked for: "' + event_name + '" but found no events. ' + name + ", you can search events by:";
            greeting = name;
        }
        var SearchQuickReply = require('../modules/tevo/search_init_quick_replay');
        SearchQuickReply.send(Message, senderId, messagetxt);

    }); //end user_queries

};



function addToArray(data, array) {
    const promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            array.push(data)
            resolve(array)
        }, 100);

        if (!array) {
            reject(new Error('No existe un array'))
        }
    })

    return promise
}


var startTevoByQuery = (arrayQueryMessages) => {
    return new Promise((resolve, reject) => {

        for (let i = 0; i < arrayQueryMessages.length; i++) {
            tevoClient.getJSON(arrayQueryMessages[i].query).then((json) => {
                let salir = false;
                if (json.error) {
                    //console.log('Error al ejecutar la tevo query ' + arrayQueryMessages[i].query + 'err.message: ' + json.error);

                } else {
                    console.log('i > ' + i + ' ' + arrayQueryMessages[i].searchBy + ' ' + arrayQueryMessages[i].query)
                    if (json.events.length > 0) {
                        resolve(arrayQueryMessages[i])
                        salir = true;
                    }
                }

                if (salir == false && (i == arrayQueryMessages.length - 1)) {
                    resolve({})
                }

            }).catch((err) => {
                console.log("Error al ejecutar la tevo query  " + arrayQueryMessages[i].query + 'err.message: ' + err.message);
            })

        }
    })
}


function sendEmail(subject, content) {
    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email(config.EMAIL_FROM);


    var toEmail = new helper.Email(config.EMAIL_TO);
    var subject = subject
    var content = new helper.Content('text/html', content);





    var mail = new helper.Mail(fromEmail, subject, toEmail, content);


    //aki
    var sg = require('sendgrid')(config.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });


}




function handleMessage(message, sender) {
    switch (message.type) {
        case 0: //text
            sendTextMessage(sender, message.speech);
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


function handleApiAiResponse(sender, response) {

    //console.log("handleApiAiResponse >>> " + JSON.stringify(response));

    let responseText = response.result.fulfillment.speech;
    let responseData = response.result.fulfillment.data;
    let messages = response.result.fulfillment.messages;
    let action = response.result.action;
    let contexts = response.result.contexts;
    let parameters = response.result.parameters;

    sendTypingOff(sender);

    if (isDefined(messages) && (messages.length == 1 && messages[0].type != 0 || messages.length > 1)) {
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
        sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");








    } else if (isDefined(action)) {
        handleApiAiAction(sender, response, action, responseText, contexts, parameters);
    } else if (isDefined(responseData) && isDefined(responseData.facebook)) {
        try {
            console.log('Response as formatted message' + responseData.facebook);
            sendTextMessage(sender, responseData.facebook);
        } catch (err) {
            sendTextMessage(sender, err.message);
        }
    } else if (isDefined(responseText)) {

        sendTextMessage(sender, responseText);
    }
}

function sendToApiAi(sender, text) {

    console.log('texto enviado a api.ai> ' + text)
    sendTypingOn(sender);
    let apiaiRequest = apiAiService.textRequest(text, {
        sessionId: sessionIds.get(sender)
    });

    apiaiRequest.on('response', (response) => {
        if (isDefined(response.result)) {
            handleApiAiResponse(sender, response);
        }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
}




function sendTextMessage(recipientId, text) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: text
        }
    }
    callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
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

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: APLICATION_URL_DOMAIN + "/public/imates/instagram_logo.gif"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "audio",
                payload: {
                    url: APLICATION_URL_DOMAIN + "/public/music/sample.mp3"
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example videoName: "/assets/allofus480.mov"
 */
function sendVideoMessage(recipientId, videoName) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: APLICATION_URL_DOMAIN + videoName
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a video using the Send API.
 * example fileName: fileName"/assets/test.txt"
 */
function sendFileMessage(recipientId, fileName) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "file",
                payload: {
                    url: APLICATION_URL_DOMAIN + fileName
                }
            }
        }
    };

    callSendAPI(messageData);
}



/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId, text, buttons) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: text,
                    buttons: buttons
                }
            }
        }
    };

    callSendAPI(messageData);
}


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


function sendReceiptMessage(recipientId, recipient_name, currency, payment_method,
    timestamp, elements, address, summary, adjustments) {
    // Generate a random receipt ID as the API requires a unique ID
    var receiptId = "order" + Math.floor(Math.random() * 1000);

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "receipt",
                    recipient_name: recipient_name,
                    order_number: receiptId,
                    currency: currency,
                    payment_method: payment_method,
                    timestamp: timestamp,
                    elements: elements,
                    address: address,
                    summary: summary,
                    adjustments: adjustments
                }
            }
        }
    };

    callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
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

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "mark_seen"
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {


    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };

    callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {


    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    callSendAPI(messageData);
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Welcome. Link your account.",
                    buttons: [{
                        type: "account_link",
                        url: APLICATION_URL_DOMAIN + "/authorize"
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}


function greetUserText(userId) {
    //first read user firstname
    request({
        uri: 'https://graph.facebook.com/v2.7/' + userId,
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        }

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var user = JSON.parse(body);

            if (user.first_name) {
                console.log("FB user: %s %s, %s",
                    user.first_name, user.last_name, user.gender);

                sendTextMessage(userId, "Welcome " + user.first_name + '!');
            } else {
                console.log("Cannot get data for fb user with id",
                    userId);
            }
        } else {
            console.error(response.error);
        }

    });
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
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



/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
    var senderId = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    var payload = event.postback.payload;

    switch (payload) {
        case "Greetings":
            // var menu = require('../bot/get_started');
            // menu.deleteAndCreatePersistentMenu();

            if (undefined !== event.postback.referral) {
                // Comprobamos que exista el comando de referencia y mostramos la correspondiente tarjeta.
                console.log('Dentro de referrals handler');
                handleReferrals(event);
            } else {

                saluda(senderId);
            }
            break;
        default:
            //unindentified payload
            sendTextMessage(senderId, "I'm not sure what you want. Can you be more specific?");
            break;

    }

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

}




function saluda(senderId) {

    console.log('Greetings Payload');
    // Metemos el ID
    UserData.getInfo(senderId, function (err, result) {
        console.log('Dentro de UserData');
        if (!err) {


            console.log(result);
            var bodyObj = result

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


/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
function receivedMessageRead(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

    console.log("Received message read event for watermark %d and sequence " +
        "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */
function receivedAccountLink(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    var status = event.account_linking.status;
    var authCode = event.account_linking.authorization_code;

    console.log("Received account link event with for user %d with status %s " +
        "and auth code %s ", senderID, status, authCode);
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about 
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

    if (messageIDs) {
        messageIDs.forEach(function (messageID) {
            console.log("Received delivery confirmation for message ID: %s",
                messageID);
        });
    }

    console.log("All message before %d were delivered.", watermark);
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the 
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger' 
    // plugin.
    var passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
        "through param '%s' at %d", senderID, recipientID, passThroughParam,
        timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    sendTextMessage(senderID, "Authentication successful");
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers["x-hub-signature"];

    if (!signature) {
        throw new Error('Couldn\'t validate the signature.');
    } else {
        var elements = signature.split('=');
        var method = elements[0];
        var signatureHash = elements[1];

        //var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
        var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}



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
        chooseMlink(referral, senderId);
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

                    chooseMlink(referral, senderId);
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

function chooseMlink(referral, senderId) {

    //senderId, context = '', mlinkSelected = '', eventSearchSelected = '', querysTevo = '', categorySearchSelected = '', optionsSelected = '', index1 = 0, index2 = 0, index3 = 0
    user_queries.createUpdateUserDatas(senderId, '-', referral).then((foundUser) => {
        switch (referral) {
            case "SAN_VALENTIN":
                {
                    var sanValentinModule = require('../modules/tevo/san_valentin/san_valentin')
                    sanValentinModule.startSanValentin(senderId, referral)

                }
                break;

            case "HappyNewYear":
                {
                    var happyNewYearModule = require('../modules/tevo/happy_new_year/happy_new_year')
                    happyNewYearModule.startHappyNewYear(senderId, referral, false)
                }
                break;

            case "HAPPY_NEW_YEAR":
                {
                    var happyNewYearModule = require('../modules/tevo/happy_new_year/happy_new_year')
                    happyNewYearModule.startHappyNewYear(senderId, referral)
                }
                break;

            case "VEGAS_SHOW":
                {
                    var vegasShowModule = require('../modules/tevo/vegas_show/vegas_show')
                    vegasShowModule.startVegasShow(senderId, referral)
                }
                break;

            case "SUPER_BOWL":
                {
                    var superBowlModule = require('../modules/tevo/super_bowl/super_bowl')
                    superBowlModule.startSuperBowl(senderId, referral)
                }
                break;
            case "CHRISTMAS_SONGS":
                {
                    var chirstmasSongsModule = require('../modules/tevo/chirstmas/christmas_songs')
                    chirstmasSongsModule.startChirstmasSongs(senderId);
                }
                break;
            case "CHRISTMAS_PROMO":
                {
                    var chirstmasModule = require('../modules/tevo/chirstmas/christmas')
                    chirstmasModule.startChirstmas(senderId);
                }
                break;
            case "SHAKIRA_PROMO":
                {
                    var promoModule = require('../modules/promo/shakira')
                    promoModule.startShakira(senderId);
                }

                break;


            case "BLACK_FRIDAY":
                {
                    var SixtEventModule = require('../modules/tevo/six_event/six_event')
                    SixtEventModule.start(senderId);
                }

                break;
            case "RIGOVSLOMA":
                {
                    var QuizModule = require('../modules/quiz/quiz')
                    QuizModule.start(senderId);
                }
                break;


            case "MAGICON":
                {

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
                    startTevoModuleByEventTitle(senderId, referral)

                }
                break;

        }

    })

    // Esta funcion nos permite agregar mas tipos de referrals links, unicamente agregando en case 
    // y llamando a su modulo correspondiente.

}


var startTevoModuleByEventTitle = (event_title, senderId) => {


    let page = 1;
    let per_page = 50;
    let page_per_page = '&page=' + page + '&per_page=' + per_page
    let query = {
        searchBy: 'ByName',
        query: tevo.API_URL + 'events?q=' + event_title + page_per_page + '&' + only_with + '&order_by=events.occurs_at',
        messageTitle: 'Cool, I looked for "' + event_title + '".  Book a ticket'
    }
    TevoModule.start(senderId, query.query, 1, query.messageTitle);

}

module.exports = router;