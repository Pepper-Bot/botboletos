var tevo = require('../../config/config_vars').tevo;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
var format_tickets = require('../../config/config_vars').format_tickets;
var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});
var format = require('format-number');


var ticketgroup = (req, res) => {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');
    var moment = require('moment');





    var event_id = req.params.event_id;

    // var event_id = req.query.event_id;


    console.log('event_id >' + event_id);

    var searchTicketGroupByEventId = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false&' + format_tickets + '&type=event'

    tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {



        // var ticketGroups = processFormatPrice(ticketG.ticket_groups)
        if (ticketG.ticket_groups.length > 0) {
            formatPrice(ticketG.ticket_groups).then((ticketGroups) => {
                //console.log("TicketGroup  Construida: >>> " + JSON.stringify(ticketGroups));
                console.log("TicketGroup  Construida.lenght: >>> " + ticketGroups.length);

                var searchById = tevo.API_URL + 'events/' + event_id

                tevoClient.getJSON(searchById).then((event) => {

                    var occurs_at = event.occurs_at;
                    occurs_at = occurs_at.substring(0, occurs_at.length - 4);
                    occurs_at = moment(occurs_at).format('MMMM Do YYYY, h:mm a')

                    // console.log("EVENT<<<  : >>> " + JSON.stringify(event));   


                    if (event_id == 1104021) {
                        event.name = "FIFA World Cup Soccer Finals Francia Vs Croatia"
                    } else if (event_id == 1104026) {
                        event.name = "FIFA World Cup Soccer Third Place Belgica Vs Inglaterra"
                    }



                    res.render(
                        './layouts/tickets/ticketgroup', {
                            titulo: "Your tickets are on its way!",
                            APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
                            ticketGroups: ticketGroups,
                            event_id: event.event_id,
                            event_name: event.name,
                            event_date: event.occurs_at,
                            event_date_f: occurs_at,
                            seatsmap: event.configuration.seating_chart.large,
                            subtitulo: "Select your tickets",
                            venue_name: event.venue.name + ' ' + event.venue.location,
                        }
                    );





                });
            })
        } else {
            res.send('<h1> No  tickets available.</h1>');
        }
    }).catch((err) => {
        console.log('Error al Recuperar los eventos');
        console.log(err);
    });

}


async function processFormatPrice(ticketGroups) {
    try {
        return result = await formatPrice(ticketGroups);

    } catch (err) {
        return console.log(err.message);
    }
}



function formatPrice(ticketGroups) {
    let ticketGF = [];
    ticketGF = ticketGroups;
    const promise = new Promise(function (resolve, reject) {
        for (let i = 0; i < ticketGF.length; i++) {
            let flotante = parseFloat(ticketGF[i].wholesale_price);
            var resultado = Math.round(flotante * Math.pow(10, 0)) / Math.pow(10, 0);
            let resFormat = format({
                prefix: '$ ',
                //integerSeparator :'.'
            })(resultado, {
                noSeparator: false
            });;

            ticketGF[i].wholesale_price_format = resFormat;

            if (i == ticketGF.length - 1) {
                resolve(ticketGF);
            }
        }
        if (!ticketGF) {
            reject(new Error('No existe un array'));
        }
    })

    return promise;
}



module.exports = {
    ticketgroup


}