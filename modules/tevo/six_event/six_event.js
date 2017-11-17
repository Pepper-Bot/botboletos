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
            for (let i = 0, c = boletos.length; i < c; i++) {
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

            }
            let counter = 0;
            for (let i = 0; i < eventResults.length; i++) {
                let search = eventResults[i].title;
                googleImage(search).then((images) => {
                    eventResults[i].image_url = images[0].url;
                    counter++;
                    if (counter == eventResults.length - 1) {
                        Message.genericButton(senderId, eventResults);
                    }
                });
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

var googleImage = (search) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');
        gis(search, logResults);

        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        }

    });
}