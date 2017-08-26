module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    
            Message.sendMessage(senderId, "Magicon\r\n2 de Julio en Mérida. Vive la experiencia pottérica del año. \r\nReserva tú lugar.");
            Message.typingOff(senderId);

            // tipeado off


            //configuramos los boletos
            var boletos = [
                {
                    "titulo": "Magicamp",
                    "imagen": "https://botboletos.herokuapp.com/images/card_magicamp.jpg",
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
            for (var i = 0, c = boletos.length; i < c; i++) {

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
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": boletos[i].url,
                            "title": "Reservar"
                        }
                    ]
                });
                console.log('EVENT RESULT>>>>>>>>>>>>>>>>>>>>>>>>');
                console.log(eventResults[i]);
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
