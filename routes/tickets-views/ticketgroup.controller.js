var tevoClient = require('../../config/config_vars').tevoClient;
var API_URL = require('../../config/config_vars').API_URL;

var ticketgroup = (req, res) => {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');
    var moment = require('moment');
    var params = req.body;
    //req.params.event_id;



    var event_id = req.query.event_id;
    var fbId = req.query.uid;
    var venue_id = req.query.venue_id;
    var event_name = req.query.event_name;
    var performer_id = req.query.performer_id;
    var seatsmap = req.query.seatsmap;
    var event_date = req.query.event_date;


    var searchTicketGroupByEventId = API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'

    tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {
        var ticketGroups = ticketG.ticket_groups;




        res.render(
            './layouts/tickets/ticketgroup', {
                titulo: "Your tickets are on its way!",
                ticketGroups: ticketGroups


            }
        );
    });

}

module.exports = {
    ticketgroup


}