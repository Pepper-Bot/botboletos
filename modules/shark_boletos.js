var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var nlp = require('../bot/NLP/nlp')
var tevo = require("../config/config_vars").tevo;
var only_with = require("../config/config_vars").only_with;


function start2(senderId) {
    var Message = require('../bot/messages');
    // llamamos al modulo de mensajes
    var eventResults = [];
    Message.typingOn(senderId);
    // simulamos el tipeado
    // enviamos el mensaje    
    Message.sendMessage(senderId, "Sharks Tank EnVivo® Episode 58 - with $50k in prizes!");
    Message.typingOff(senderId);

    // tipeado off

    // Guarda el url cada vez que el usuario hace click en la tarjeta
    var URLAplication = APLICATION_URL_DOMAIN + "redirect/?u="
    //configuramos los boletos


    var boletos = [{
            "titulo": "Discount - Limited Time",
            "imagen": APLICATION_URL_DOMAIN + "images/sharkstank/sharks_image_discount_20.jpg",
            "subtitulo": "Live the Sharks Tank experience. You can also pitch and Win 50K",
            "url": URLAplication + "https://www.eventbrite.com/e/live-sharks-tank-envivo-episode-58-with-50k-in-prizes-tickets-43909866593?discount=SuperPromo " + '&id=' + senderId


        },

        {
            "titulo": "General Admission - $20",
            "imagen": APLICATION_URL_DOMAIN + "images/sharkstank/sharks_tank_16sec_video_attendees.png",
            "subtitulo": "Bring cards and network w Bay Area investors and entrepreneurs",
            "url": URLAplication + "https://www.eventbrite.com/e/live-sharks-tank-envivo-episode-58-with-50k-in-prizes-tickets-43909866593" + '&id=' + senderId

        },
        {
            "titulo": "Startups - $150",
            "imagen": APLICATION_URL_DOMAIN + "images/sharkstank/sharks_Fb_image_participant.png",
            "subtitulo": "Pitch your idea and Win 50K. Get Funded this Friday.",
            "url": URLAplication + "https://www.eventbrite.com/e/live-sharks-tank-envivo-episode-58-with-50k-in-prizes-tickets-43909866593" + '&id=' + senderId

        },

        {
            "titulo": "Sponsors - from $500",
            "imagen": APLICATION_URL_DOMAIN + "images/sharkstank/sharks_Fb_image_sponsor.png",
            "subtitulo": "Get your logo in front of 50 thousand people. Get a VIP table and join the smashing party.",
            "url": URLAplication + "https://www.eventbrite.com/e/live-sharks-tank-envivo-episode-58-with-50k-in-prizes-tickets-43909866593" + '&id=' + senderId

        }



    ];

    // creamos las tarjetas
    for (var i = 0, c = boletos.length; i < c; i++) {
        eventResults.push({
            "title": boletos[i].titulo,
            "image_url": boletos[i].imagen,
            "subtitle": boletos[i].subtitulo,
            //"item_url": boletos[i].url,
            "default_action": {
                "type": "web_url",
                "url": boletos[i].url //,
                //"messenger_extensions": true//,
                // "webview_height_ratio": "tall",
                // "fallback_url": boletos[i].url
            },
            "buttons": [{
                    "type": "web_url",
                    "url": boletos[i].url,
                    "title": "Book"
                    //"payload": "TIBURON" + (i + 1)
                },
                {
                    "type": "element_share"
                }
            ]
        });



        console.log('events Results >>>>>>>>>>>>>>>' + eventResults[i].url);
    }





    console.log('events Results >>>>>>>>>>>>>>>' + eventResults);
    // se las enviamos al cliente

    //enviarMensajeTemplate(senderId);
    //Message.genericButton(senderId, eventResults);


    var GenericButton = require('../bot/generic_buttton');
    GenericButton.genericButtonQuickReplay(senderId, eventResults, "Find something else? ", function () {})


    // dejamos de tipear
    Message.typingOff(senderId);

}



function start(sender) {
    let userPreferences = {
        event_title: "",
        city: "",
        artist: "",
        team: "",
        event_type: "",
        music_genre: ""
    };

    let page = 1
    let per_page = 9
    let event_title = `Live Sharks Tank`

    let query = {
        searchBy: "ByName",
        query: tevo.API_URL +
            "events?q=" +
            event_title +
            "&page=" +
            page +
            "&per_page=" +
            per_page +
            // "&" +
            // only_with +
            "&order_by=events.occurs_at",
        queryReplace: tevo.API_URL +
            "events?q=" +
            event_title +
            "&page=" +
            "{{page}}" +
            "&per_page=" +
            "{{per_page}}" +
            "&" +
            only_with +
            "&order_by=events.occurs_at",
        queryPage: page,
        queryPerPage: per_page,
        messageTitle: 'Cool, I looked for "' + event_title + '" shows.  Book a ticket'
    }

    console.log(`Shark query ${query.query}`)
    nlp.tevoByQuery(sender, query, userPreferences).then(() => {

    })
}



module.exports = {
    start
}