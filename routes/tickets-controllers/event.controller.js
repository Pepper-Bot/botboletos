var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
var tevo = require('../../config/config_vars').tevo;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;

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


    urlApiTevo = tevo.API_URL + 'events/?page=1&per_page=50&performer_id=' + performer_id + '&venue_id=' + venue_id + '&only_with_available_tickets=true'



    if (undefined == req.query.uid) {
        res.status(200);
        res.send('Error trying to access');
        res.end();
        return;
    }

    tevoClient.getJSON(urlApiTevo).then((json) => {
        if (json) {
            if (json.events.length > 0) {
                var events = json.events
                var counter = 0;
                setImagesToEvents(req, json.events, counter).then((events) => {
                    res.render(
                        './layouts/tickets/event', {
                            titulo: "Book",
                            APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
                            events: events,
                            uid = req.query.uid
                        }
                    );
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

    //});
}


var setImagesToEvents = (req, resultEvent, counter) => {
    var events = resultEvent;
    return new Promise((resolve, reject) => {
        for (let z = 0; z < events.length; z++) {
            let search = 'event ' + events[z].title + ' ' + events[z].image_url;
            getGoogleImage(search, events).then((images) => {

                events[z].image_url = images[0].url;
                var occurs_at = events[z].occurs_at
                occurs_at = occurs_at.substring(0, occurs_at.length - 4)
                occurs_at = moment(occurs_at).format('dddd') + ', ' + moment(occurs_at).format('MMMM Do YYYY, h:mm a')
                // occurs_at = moment(occurs_at).format('MMM Do YYYY, h:mm a')
                events[z].occurs_at_format = occurs_at
                events[z].button_href = APLICATION_URL_DOMAIN + "tickets/?event_id=" + events[z] + "&uid=" + req.query.uid

                if (counter + 1 == events.length) {
                    resolve(events)
                }

            }).then(() => {
                counter = counter + 1;

            });
        }
    });
}

var getGoogleImage = (search, matriz = []) => {
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


module.exports = {

    render_events
};