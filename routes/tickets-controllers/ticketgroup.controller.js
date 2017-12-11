var tevo = require('../../config/config_vars').tevo;

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});



var ticketgroup = (req, res) => {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');
    var moment = require('moment');
    var format_number = require('format-number');




    var event_id = req.params.event_id;

    // var event_id = req.query.event_id;


    console.log('event_id >' + event_id);

    var searchTicketGroupByEventId = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'

    tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {
        var ticketGroups = ticketG.ticket_groups;

        for (var i = 0; i < ticketGroups.length; i++) {
            let flotante = parseFloat(ticketGroups[i].wholesale_price);
            let resultado = Math.round(flotante * 100) / 100;
            let resFormat = format({
                prefix: '$',
                //integerSeparator :'.'
            });
            conosole.log("resFormat" + resFormat);
            ticketGroups[i].wholesale_price_format = resFormat;
        }
        console.log("TicketGroup  Construida: >>> " + JSON.stringify(ticketG));
        console.log("TicketGroup  Construida.lenght: >>> " + ticketGroups.length);

        var searchById = tevo.API_URL + 'events/' + event_id

        tevoClient.getJSON(searchById).then((event) => {

            console.log("EVENT<<<  : >>> " + JSON.stringify(event));
            res.render(
                './layouts/tickets/ticketgroup', {
                    titulo: "Your tickets are on its way!",
                    ticketGroups: ticketGroups,
                    event_id: event.event_id,
                    event_name: event.name,
                    event_date: event.occurs_at,
                    seatsmap: event.configuration.seating_chart.large,
                    subtitulo: "Select your tickets",
                    //venue_name: event.venue.name + ' ' + event.venue.location,

                }
            );


        });



    });

}

module.exports = {
    ticketgroup


}