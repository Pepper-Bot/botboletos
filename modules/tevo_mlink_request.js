module.exports = function () {
    return {
        start: function (senderId, filtro) {
            var Message = require('../bot/messages');
            var TevoClient = require('ticketevolution-node');
            var tevoClient = new TevoClient({
                apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
                apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
            });





            var urlApiTevo = 'https://api.ticketevolution.com/v9/ticket_groups/' + filtro + "?ticket_list=true"



            console.log('url api tevo>>>>>>>' + urlApiTevo);

            var event_id = 0;
            if (tevoClient) {
                tevoClient.getJSON(urlApiTevo).then((json) => {
                    Message.sendMessage(senderId, "Obteniendo Eventos:");
                    if (json.error) {
                        Message.sendMessage(senderId, json.error);
                    } else {
                        event_id = json.event.id;
                        console.log("ESTE ES EL ID DEL EVENTO>>>>>>>>>>>>> " + event_id);


                        if (event_id > 0) {
                            console.log('encontré el evento:::::>>>>>>  ' + event_id);
                            urlApiTevo = 'https://api.ticketevolution.com/v9/events/' + event_id
                            tevoClient.getJSON(urlApiTevo).then((json) => {
                                Message.sendMessage(senderId, "Obteniendo Eventos parte 2:");
                                if (json.error) {
                                    Message.sendMessage(senderId, json.error);
                                } else {
                                    console.log("EVENTO PROPIEDADES PARTE DOS:::::>>>>>>>>>>>>> " +
                                        inspeccionar(json));


                                    var eventButtons = crateTemplates(json, senderId);




                                    console.log('EVENT BUTTONS ==========>>>>>>>>>>>>>>' + eventButtons);
                                    setImageURL(eventButtons, senderId);
                                   










                                    //Message.genericButton(senderId, gButtons);

                                }
                            }).catch((err) => {
                                console.err(err);
                            });
                        }




                    } //fin  de else json.error
                }).catch((err) => {
                    console.err(err);
                });


            }

        }
    }
}();

function crateTemplates(json, senderId) {
    var resultEvent = [];
    resultEvent[0] = json;
    var eventButtons_ = [];
    var baseURL = 'https://ticketdelivery.herokuapp.com/event/?event_id=';
    for (var j = 0, c = resultEvent.length; j < c; j++) {
        eventButtons_.push({
            "title": resultEvent[j].name,
            "image_url": '',
            "subtitle": resultEvent[j].performances[0].performer.name,
            "default_action": {
                "type": "web_url",
                "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name,
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name
            },
            "buttons": [{
                "type": "web_url",
                "url": baseURL + resultEvent[j].id + '&uid=' + senderId + '&venue_id=' + resultEvent[j].venue.id + '&performer_id=' + resultEvent[j].performances[0].performer.id + '&event_name=' + resultEvent[j].name,
                "title": "Book"
            }]
        });
    }
    return eventButtons_;

}

function setImageURL(eventButtons, senderId) {
    var imageCards = require('../modules/imageCards'); // Google images
    var image_url = '';
    counter = 0;
    for (var j = 0, c = eventButtons.length; j < c; j++) {
        console.log("entramos al for=======================================>>>>>>>>>>>>>>>>>>");
        imageCards(eventButtons[j].title, j, function (err, images, index) {
            eventButtons[index].image_url = images[0].url;
            counter++;
            if(counter==eventButtons.length){
                console.log("IMAGE URL VS 300>>>>>" + eventButtons[index].image_url );
                Message.genericButton(senderId, eventButtons);
            }
            
        });
    }
    
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