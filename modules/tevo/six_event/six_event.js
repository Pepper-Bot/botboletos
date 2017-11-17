module.exports = function () {

    return {

        start: function (senderId) {


            var Message = require('../../../bot/messages');
            // llamamos al modulo de mensajes
            var eventResults = [];
            Message.typingOn(senderId);
            // simulamos el tipeado
            // enviamos el mensaje    
            Message.sendMessage(senderId, "SIX EVENTS");
            Message.typingOff(senderId);

            // tipeado off

            // Guarda el url cada vez que el usuario hace click en la tarjeta
            var URLAplication = "https://botboletos-test.herokuapp.com/redirect/?u="
            //configuramos los boletos


            var boletos = [{
                    "titulo": "Shakira",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""
                },
                {
                    "titulo": "Katy Perry",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""

                },
                {
                    "titulo": "Bruno Mars",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""

                },
                {
                    "titulo": "Wicked",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""
                },
                {
                    "titulo": "Disney On Ice",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""
                },
                {
                    "titulo": "The Phantom of the Opera",
                    "imagen": "",
                    "subtitulo": "",
                    "url": ""
                },

            ];

            // creamos las tarjetas
            for (var i = 0, c = boletos.length; i < c; i++) {
                var search = boletos[i].titulo;

                googleImage(search, boletos).then((images, boletos) => {
                    ///boletos[i].imagen = images[0].url;
                    console.log(">>> " + images[0].url);
                    boletos[i].imagen = images[0].url

                    eventResults.push({
                        "title": boletos[i].titulo,
                        "image_url": boletos[i].imagen,
                        "subtitle": boletos[i].subtitulo,

                        "buttons": [{
                                "type": "postback",
                                "title": boletos[i].titulo,
                                "payload": boletos[i].titulo

                            },
                            {
                                "type": "element_share"
                            }
                        ]
                    })
                    if (i == boletos.length - 1) {
                        Message.genericButton(senderId, eventResults)
                    }
                }).then(() => {

                });





                // console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].image_url);
            }





            console.log('events Results >>>>>>>>>>>>>>>' + eventResults);
            // se las enviamos al cliente

            //enviarMensajeTemplate(senderId);
            //Message.genericButton(senderId, eventResults);





            // dejamos de tipear
            Message.typingOff(senderId);





        }

    };

}();

var googleImage = (search, matriz = []) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');
        gis(search, logResults);

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results, matriz);
            }
        }

    });
}