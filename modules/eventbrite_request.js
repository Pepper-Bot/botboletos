module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../bot/messages');
            var eventResults = [];
            Message.typingOn(senderId);
            Message.sendMessage(senderId, "Eventbrite Request !! ");
            Message.typingOff(senderId);


            /*var eventbriteAPI = require('node-eventbrite');

            var token = 'GAPMQH6AUBENAC2SPCEX';

            try {
                var api = eventbriteAPI({
                    token: token,
                    version: 'v3'
                });
            } catch (error) {
                console.log(error.message); // the options are missing, this function throws an error.
            }

            api.owned_events({ user_id: 221981936048 }, function (error, data) {
                if (error)
                    console.log(error.message);
                else
                    console.log(JSON.stringify(data)); // Do something with your data!
            });*/





        }

    }();

}