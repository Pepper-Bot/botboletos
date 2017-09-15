'use strict';

module.exports = function () {
    return {
        start: function (senderId) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<ENTRAMOS A EVENTBRITE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><');
            var Message = require('../bot/messages');
            Message.typingOn(senderId);
            Message.sendMessage(senderId, "Eventbrite Request !! ");
            Message.typingOff(senderId);
            var request = require('request');

            var baseURL = "https://www.eventbriteapi.com/v3"
            var userID = 221981936048;
            var OAuthtoken = "GAPMQH6AUBENAC2SPCEX";
            //==========================//
            var token = "?token=" + OAuthtoken;
            var events = "/events/"
            var event = 37138315702
            console.log("URL>>>>>>>>>>>>>>>>" + baseURL + events + event);

            request(
                {
                    url: baseURL + events + event,
                    qs: {
                        token: 'GAPMQH6AUBENAC2SPCEX'

                    },
                    method: 'GET'
                }
                ,
                function (error, response, body) {
                    if (!error) {
                        var evento = JSON.parse(body);
                        var baseURL = 'https://botboletos-test.herokuapp.com/redirect/?u=';
                        Message.typingOn(senderId);
                        Message.sendMessage(senderId, evento.name.text);
                        Message.typingOff(senderId);
                        var eventResults = [];
                        eventResults.push({
                            "title": evento.name.text,
                            "image_url": evento.logo.original.url,
                            "subtitle": evento.description.text,
                            "default_action": {
                                "type": "web_url",
                                "url": baseURL + evento.url + ' ' + '&id=' + senderId/*,
                              "messenger_extensions": true,
                              "webview_height_ratio": "tall",
                              "fallback_url": 'https://botboletos.herokuapp.com/redirect/?u='+json.restaurants[i].restaurant.url + '&id='+result.fbId*/
                            },
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": baseURL + evento.url + ' ' + '&id=' + senderId,
                                    "title": "Go"
                                }
                            ]
                        });
                        Message.genericButton(senderId, elementTemplateArray);






                    }//fin de if  error
                }//fin de función de respuesta
            );//fin de request





        }//cierre de la función Start
    };//cierre del return
}();//cierre de la exportación del modulo

