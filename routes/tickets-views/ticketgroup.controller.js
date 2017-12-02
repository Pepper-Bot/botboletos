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





    var event_id = req.params.event_id;

    // var event_id = req.query.event_id;


    console.log('event_id >'+ event_id);

    var searchTicketGroupByEventId = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'
   
    tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {
        var ticketGroups = ticketG.ticket_groups;
        //console.log("TicketGroup  Construida: >>> " + JSON.stringify(ticketG));
        console.log("TicketGroup  Construida.lenght: >>> " + ticketGroups.length);

        var searchById = tevo.API_URL + 'events?event_id=' + event_id

        tevoClient.getJSON(searchById).then((eventsRes) => {
            var event = eventsRes.events[0];
            console.log("EVENT<<<  : >>> " + JSON.stringify(event));
            res.render(
                './layouts/tickets/ticketgroup', {
                    titulo: "Your tickets are on its way!",
                    ticketGroups: ticketGroups,
                    event_id: event.event_id,
                    event_name: event.name,
                    event_date: event.occurs_at,
                    seatsmap: event.configuration.seating_chart.large,
                }
            );


        });



    });

}

module.exports = {
    ticketgroup


}