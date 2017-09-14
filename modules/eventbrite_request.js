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
            console.log("URL>>>>>>>>>>>>>>>>" + baseURL + events + event );


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
                        console.log(JSON.parse(body)); 
                    }
                }

            );
 




        }//cierre de la función Start
    };//cierre del return
}();//cierre de la exportación del modulo

