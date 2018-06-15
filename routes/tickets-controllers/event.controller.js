var express = require('express');
var router = express.Router();

var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
var tevo = require('../../config/config_vars').tevo;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
var only_with = require('../../config/config_vars').only_with;

const dashbot = require("dashbot")("CJl7GFGWbmStQyF8dYjR6WxIBPwrcjaIWq057IOO").facebook; //new
var userQueries = require('../../schemas/queries/user_queries')


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});


var render_events = (req, res) => {
    var event_id = req.query.event_id;
    var fbId = req.query.uid;
    var venue_id = req.query.venue_id;
    var event_name = req.query.event_name;
    var performer_id = req.query.performer_id;


    let urlApiTevo = tevo.API_URL + 'events/?page=1&per_page=50&performer_id=' + performer_id + '&venue_id=' + venue_id + '&' + only_with + ''
    if (performer_id == "57088") {
        console.log(`57088`)
        urlApiTevo = tevo.API_URL + 'events/?page=1&per_page=50&performer_id=' + performer_id + '&venue_id=' + venue_id
    }




    if (undefined == req.query.uid) {
        res.status(200);
        res.send('Error trying to access');
        res.end();
        return;
    } else {
        if (req.query.event_id != undefined) {
            let searcEvent = `${tevo.API_URL}events/${req.query.event_id}`
            tevoClient.getJSON(searcEvent).then((json) => {
                console.log(`${JSON.stringify(json)}`)

                let evento = {
                    id: json.id,
                    name: json.name,
                    occurs_at: occurs_at
                }
                let category = json.category
                let performances = json.performances

                userQueries.upateEventClicked(req.query.event_id, evento, category, performances).then(() => {

                })


            }).catch(error => {
                console.log(`error consultando el evento- ${error}`)
            })
        }
    }

    tevoClient.getJSON(urlApiTevo).then((json) => {
        console.log(`urlApiTevo: ${urlApiTevo}`)
        if (json) {
            console.log(`json.events.length ---->  ${json.events.length}`)




            if (json.events.length > 0) {
                var events = json.events
                var counter = 0;
                setImagesToEvents(req, json.events, counter).then((events) => {
                    var event_name = events[0].name

                    var cadena = event_name,
                        separador = " ", // un espacio en blanco
                        arregloDeSubCadenas = cadena.split(separador);

                    console.log(arregloDeSubCadenas); // la consola devolverá: ["cadena", "de", "texto"]


                    for (let k = 0; k < arregloDeSubCadenas.length; k++) {
                        if (arregloDeSubCadenas[k] == "(Rescheduled") {
                            event_name = events[0].performances[0].performer.name
                            events[0].name = event_name
                        }
                    }


                    let dashBotEvent = {
                        type: 'customEvent',
                        name: 'view events details',
                        userId: req.query.uid,
                        extraInfo: {
                            eventId: req.query.event_id,
                            event_name: event_name,
                        }
                    }

                    dashbot.logEvent(dashBotEvent);

                    // gis(event_name, function (err, images) {
                    getGoogleImage(event_name).then((images) => {
                        if (performer_id == "57088") {
                            images[0].url = "https://ticketdelivery.herokuapp.com/images/sharkstank/sharks_anniversary_web.png";
                        }
                        res.render(
                            './layouts/tickets/event', {
                                titulo: "Book",
                                book: true,
                                APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
                                events: events,
                                uid: req.query.uid,
                                subtitulo: events[0].name,
                                image_url: images[0].url
                            }
                        );
                    });


                })

            } else {
                res.send('<h1>No tickets available.</h1>');
            }
        } else {

            res.send('<h1>No tickets available.</h1>');

        }

    }).catch((err) => {
        console.log('Error al Recuperar los eventos');
        console.log(err);
    });


}




var setImagesToEvents = (req, resultEvent, counter) => {
    var events = resultEvent;
    return new Promise((resolve, reject) => {

        for (let z = 0; z < events.length; z++) {
            var occurs_at = events[z].occurs_at
            occurs_at = occurs_at.substring(0, occurs_at.length - 4)
            occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')
            // occurs_at = moment(occurs_at).format('MMM Do YYYY, h:mm a')
            events[z].occurs_at_format = occurs_at
            events[z].button_href = APLICATION_URL_DOMAIN + "tickets/?event_id=" + events[z].id + "&uid=" + req.query.uid
            counter = counter + 1;
            if (z + 1 == events.length) {
                resolve(events)
            }
        }


    });
}




var getGoogleImage = (search, matriz = []) => {
    return new Promise((resolve, reject) => {

        var gis = require('g-i-s');

        var opts = {
            searchTerm: search,
            queryStringAddition: '&tbs=ic:trans',
            filterOutDomains: [
                'pinterest.com',
                'deviantart.com'
            ]
        };


        var opts = {
            searchTerm: search,


        };




        gis(opts, logResults);


        function logResults(error, results) {
            if (error) {
                reject(error);
            } else {
                console.log("Imagenes gis Respuesta >>> " + results.length);
                // console.log("Imagenes gis Respuesta >>> " + JSON.stringify(results));
                //resolve(results, matriz);
                var results1 = [];
                for (let i = 0; i < results.length; i++) {

                    if (results[i].width / results[i].height >= 1.91 && results[i].width / results[i].height <= 2 && results[i].height > 300) {

                        results1.push(results[i])

                        resolve(results1, matriz);
                    }

                    if (i + 1 == results.length) {
                        resolve(results, matriz);
                    }


                }

            }
        }

    });
}


module.exports = {

    render_events
};