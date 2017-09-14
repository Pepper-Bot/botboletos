module.exports = function () {
    return {
        start: function (senderId) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<ENTRAMOS A EVENTBRITE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><');
            var Message = require('../bot/messages');
            Message.typingOn(senderId);
            Message.sendMessage(senderId, "Eventbrite Request !! ");
            Message.typingOff(senderId);



            var eventbriteAPI = require('node-eventbrite');
            var token = 'GAPMQH6AUBENAC2SPCEX';
            try {
                var api = eventbriteAPI({
                    token: token,
                    version: 'v3'
                });

                console.log('>>>>>>>>>>>>>YA TENEMOS UNA VARIABLE api de EVENTBRITEAPI<<<<<<<<<<<<<<<<                                   '); // the options are missing, this function throws an error.
            } catch (error) {
                console.log("ERROR EN LA API>>>" + error.message); // the options are missing, this function throws an error.
            }


            api.owned_events({ user_id: 221981936048 }, function (error, data) {
                if (error)
                    console.log(error.message);
                else {
                    console.log('<<<<<<<<<<<<<<  -ENCONTRAMOS RESPUESTA- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                    console.log(JSON.stringify(data)); // Do something with your data!

                    // 


                }





            });











        }//cierre de la función Start
    };//cierre del return
}();//cierre de la exportación del modulo

