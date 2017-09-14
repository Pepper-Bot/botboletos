module.exports = function () {
    return {
        start: function (senderId) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<ENTRAMOS A EVENTBRITE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><');
            var Message = require('../bot/messages');
            Message.typingOn(senderId);
            Message.sendMessage(senderId, "Eventbrite Request !! ");
            Message.typingOff(senderId);

            var apiEB;
            var eventbriteAPI = require('node-eventbrite');
            var eventbrite_token = 'GAPMQH6AUBENAC2SPCEX';
         
            try {
                apiEB = eventbriteAPI({
                    token: eventbrite_token,
                    version : 'v3'
                });
            } catch (error) {
                console.log(error.message);
            }
           
            apiEB.prototype.owned_events({ user_id: 221981936048 }, function (error, data) {
                if (error)
                    console.log(error.message);
                else
                    console.log(JSON.stringify(data)); // Do something with your data!
            });








        }//cierre de la función Start
    };//cierre del return
}();//cierre de la exportación del modulo

