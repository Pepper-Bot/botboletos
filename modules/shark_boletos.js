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
                  Message.sendMessage(senderId, "SHARK DE OCTUBRE de Julio en Mérida. Vive la experiencia pottérica del año. \r\nReserva tú lugar.");
                  Message.typingOff(senderId);

                  // tipeado off


                  //configuramos los boletos
            var boletos = [
               {
                    "titulo": "SHARK",
                    "imagen": "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/592534/580/386/m1/fpnw/wm1/shark-20-.jpg?1443712707&s=827e3cff971616fb69f4e9d71c218922",
                    "subtitulo": "Pase General + Campamento (900MX)",
                    "url": "https://www.marinahuerta.com/magicon"

                }, 
                {
                    "titulo": "Paquete Magico",
                    "imagen": "https://botboletos.herokuapp.com/images/card_paquetemagico.jpg",
                    "subtitulo": "Magicamp + Pase Magico (1,370MX)",
                    "url": "https://www.marinahuerta.com/magicon"

                },
                {
                    "titulo": "Pase Black",
                    "imagen": "https://botboletos.herokuapp.com/images/card_paseblack.jpg",
                    "subtitulo": "Campamento + Varita + Actividades (565MX)",
                    "url": "https://venta.tusboletos.mx/ordertickets.asp?p=2777&backurl=default.asp"

                },
                {
                    "titulo": "Pase General",
                    "imagen": "https://botboletos.herokuapp.com/images/card_pasegenera.jpg",
                    "subtitulo": "Experiencia Magica (95MX) ",
                    "url": " https://venta.tusboletos.mx/ordertickets.asp?p=2777&backurl=default.asp"

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
     
        



            console.log(eventResults);
            // se las enviamos al cliente
            Message.genericButton(senderId, eventResults);
            // dejamos de tipear
            Message.typingOff(senderId);
            // Dentro de MAGICON.
		}

	};

}();
