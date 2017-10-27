module.exports = function () {
    return {
        start: function (senderId, event_name, locationData) {
            var Message = require('../bot/messages');
            var imageCards = require('../modules/imageCards'); // Google images
            var TevoClient = require('ticketevolution-node');
            var moment = require('moment');

            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });


            //var urlApiTevo = 'https://api.ticketevolution.com/v9/events?q=' + event_name + '&page=1&per_page=50&only_with_tickets=all'
            var urlApiTevo = '';

            if (event_name && !locationData) {
                urlApiTevo = 'https://api.ticketevolution.com/v9/events?q=' + event_name + '&page=1&per_page=50&only_with_available_tickets=true&order_by=events.occurs_at'
            } else if (!event_name && locationData) {
                urlApiTevo = 'https://api.ticketevolution.com/v9/events?lat=' + locationData.lat + '&lon=' + locationData.lon + '&page=1&per_page=50&only_with_available_tickets=true&order_by=events.occurs_at'
            } else if (!event_name && locationData) {
                urlApiTevo = 'https://api.ticketevolution.com/v9/events?q=' + event_name + '&lat=' + locationData.lat + '&lon=' + locationData.lon + +'&page=1&per_page=50&only_with_available_tickets=true&order_by=events.occurs_at'
            }



            console.log('url api tevo>>>>>>>' + urlApiTevo);

            var event_id = 0;
            if (tevoClient) {
                tevoClient.getJSON(urlApiTevo).then((json) => {
                    Message.sendMessage(senderId, "Getting Events:");
                    if (json.error) {
                        Message.sendMessage(senderId, json.error);
                    } else {

                        if (json.events.length > 0) {
                            console.log('TENEMOS  ' + json.events.length + ' EVENTOS <<<<<<<<<<<<<<<<<<<<<<<<<<')
                            var resultEvent = [];
                            resultEvent = json.events;
                            var eventButtons_ = [];
                            var callsGis = 0;
                            var baseURL = 'https://ticketdelivery.herokuapp.com/event/?event_id=';


                            if (resultEvent.length > 10) {
                                resultEvent.splice(10, resultEvent.length - 10);
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




                            gButtons = null;
                            gButtons = eventButtons_;
                            counter = 0;

                            for (var z = 0, k = gButtons.length; z < k; z++) {



                                imageCards('event ' + gButtons[z].title + ' ' + gButtons[z].image_url, z, function (err, images, index) {
                                    var imageIndex = 0;
                                    if (images.length >= 30) {
                                        imageIndex = Math.round(Math.random() * 30);
                                    } else {
                                        imageIndex = Math.round(Math.random() * images.length);
                                    }


                                    gButtons[index].image_url = images[imageIndex].url;
                                    counter++;
                                    if (counter == gButtons.length) {
                                        console.log("ENTRE A GBUTTONS:::::::>>>" + gButtons[index].image_url);
                                        Message.genericButton(senderId, gButtons);

                                        var ShowMeMoreQuickReply = require('../modules/tevo/show_me_more_quick_replay');
                                        ShowMeMoreQuickReply.send(Message, senderId);

                                    }


                                });



                            }

                        } else {
                            //busqueda en la otra api
                        }


                    } //fin  de else json.error
                }).catch((err) => {
                    console.err(err);
                });


            }

        }
    }
}();


function genericButtonAndShowReplays(senderId, gButtons) {
  return new Promise(function (resolve, reject) {
       resolve(  Message.genericButton(senderId, gButtons));
    }).then(()=>{
        var ShowMeMoreQuickReply = require('../modules/tevo/show_me_more_quick_replay');
        ShowMeMoreQuickReply.send(Message, senderId);
    })
}


function crateTemplates(json, senderId) {







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