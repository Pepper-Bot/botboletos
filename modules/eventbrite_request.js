'use strict';

module.exports = function () {
    return {
        start: function (senderId) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<ENTRAMOS A EVENTBRITE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><');
            var Message = require('../bot/messages');
            var ElementTemplate = require('../fbObjects/ElementTemplate');
            var ButtonTemplate =   require('../fbObjects/ButtonTemplate');
            var mensajeTemplate = require("../fbObjects/MensajeTemplate");
           
            var buttonArray = new Array();
            var buttonTemplate = new ButtonTemplate(
                "",
                ""
            );
            
            buttonArray.push(buttonTemplate);

            var elementTemplate = new ElementTemplate(
                "",
                "",
                "",
                "",
                buttonArray
            );



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
                        Message.typingOn(senderId);
                        Message.sendMessage(senderId, evento.url);
                        Message.typingOff(senderId);



                    }
                }

            );





        }//cierre de la función Start
    };//cierre del return
}();//cierre de la exportación del modulo

