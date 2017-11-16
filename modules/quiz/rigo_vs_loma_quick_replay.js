module.exports = function () {

    return {

        send: function (Message, senderId, title = "Now!.  Do you Want to go to the battle?") {

            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);


            var Message2 = require('../../bot/generic_buttton');





            var eventResults = [];

            var boletos = [{
                    "titulo": "Rigondeaux",
                    "imagen": "https://botboletos-test.herokuapp.com/images/box/rigo-larga.png",
                    "subtitulo": "4.700",
                    "url": ""

                },

                {
                    "titulo": "Lomachenko",
                    "imagen": "https://botboletos-test.herokuapp.com/images/box/loma-larga.png",
                    "subtitulo": "1.225",
                    "url": ""
                }

            ];



            for (var i = 0, c = boletos.length; i < c; i++) {
                eventResults.push({
                    "title": boletos[i].titulo,
                    "image_url": boletos[i].imagen,
                    "subtitle": boletos[i].subtitulo,
                    //"item_url": boletos[i].url,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": boletos[i].subtitulo,
                            "payload": boletos[i].subtitulo
                        }
                      ]
                    
                });



                console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].url);
            }


            Message2.listTemplateButtons(senderId, eventResults);


            /* var replies = [

                 {
                     "content_type": "text",
                     "title": "GET TICKETS",
                     "payload": "find_my_event_rigo_vs_loma"
                 }
             ];



             Message.quickReply(senderId, title, replies);
             Message.typingOff(senderId);*/

        }
    }

}();