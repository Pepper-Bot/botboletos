module.exports = function()
{

	return {

		start: function(senderId)
		{


            var Message = require('../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);      
            // simulamos el tipeado
            // enviamos el mensaje    
                  Message.sendMessage(senderId, "SHARK BOLETOS");
                  Message.typingOff(senderId);

                  // tipeado off


                  //configuramos los boletos
            var boletos = [
               {
                    "titulo": "Magicamp",
                    "imagen": "https://botboletos-test.herokuapp.com/images/card_magicamp.jpg",
                    "subtitulo": "Pase General + Campamento (900MX)",
                    "url": "https://www.marinahuerta.com/magicon"

                }];

                // creamos las tarjetas
            for(var i = 0, c = boletos.length; i < c; i++)
            {

                eventResults.push({
                    "title": boletos[i].titulo,
                    "image_url": boletos[i].imagen,
                    "subtitle": boletos[i].subtitulo,
                    "default_action": {
                      "type": "web_url",
                      "url": boletos[i].url,
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      "fallback_url": boletos[i].url
                    },
                    "buttons":[
                      {
                        "type":"web_url",
                        "url": boletos[i].url,
                        "title":"Reservar"
                      }           
                    ]      
                });
            }
     
        



            console.log('events Results >>>>>>>>>>>>>>>'+eventResults);
            // se las enviamos al cliente
            Message.genericButton(senderId, eventResults);
            // dejamos de tipear
            Message.typingOff(senderId);
            // Dentro de MAGICON.
		}

	};

}();
