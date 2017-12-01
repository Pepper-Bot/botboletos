var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
/* GET home page. */
var tevo = require('../config/config_vars').tevo;


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});



router.get('/', function (req, res) {

	var event_id = req.query.event_id;
	var fbId = req.query.uid;
	var venue_id = req.query.venue_id;
	var event_name = req.query.event_name;
	var performer_id = req.query.performer_id;
	var seatsmap = req.query.seatsmap;
	var event_date = req.query.event_date;

	var urlApiTevo = '';


	urlApiTevo = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'
	console.log('Groups url api tevo>>>>>>>' + urlApiTevo);

	if (undefined == req.query.uid) {
		res.status(200);
		res.send('Error trying to access');
		res.end();
		return;
	}
	/*
	UserData2.findOne({fbId: fbId}, {}, { sort: { 'sessionStart' : -1 } }, function(err, result)
	{	*/

	tevoClient.getJSON(urlApiTevo).then((json) => {


		console.log(JSON.stringify(json));

		var headerTickets = '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no"> <base href="https://botboletos-test.herokuapp.com/"> <title>Select your Tickets</title> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script><link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/> <style>body{overflow-x:hidden;}</style> <script>$(function() {var $body = $(document);$body.bind("scroll", function() {if ($body.scrollLeft() !== 0) {$body.scrollLeft(0);}});});</script> </head> <body> <div> <div class="row"> <h3 class="header center blue-text">' + event_name + ' Tickets</h3> <img alt="Seat Map" class="responsive-img" src="' + seatsmap + '">';

		var tableOpen = ' <table id="tickets" class="display table table-condensed table-responsive"> <thead> <tr> <th>Section</th> <th>Row</th> <th>Qty</th> <th>Price</th> <th></th> </tr> </thead> <tbody>';


		var tableClose = '</tbody></table>';


		var footerTickets = ' </div> </div> </div>  <script type="text/javascript" src="js/materialize.min.js"></script> <script>$(document).ready(function() { $(\'select\').material_select(); $("#tickets").DataTable( { "order": [[ 3, "desc" ]] } );} );</script> </body></html>';
		var tableTicket = '';

		console.log(JSON.stringify(json));
		/*if(json.total_entries == 0)
		{

			res.send(headerTickets + '<h3>Sold out</h3>' + footerTickets);
			res.end();

		}
		else*/
		{

			var total = 0;
			if (json.ticket_groups.length < 350) {
				total = json.ticket_groups.length;
			} else {
				total = 350;

			}
			// limitamos el numero de tickets a 30 por materialize
			for (var i = 0, c = total; i < c; i++) {
				//	if(json.ticket_groups[i].format == 'Eticket' || json.ticket_groups[i].format == 'Physical')
				{

					console.log('-----------------------------------------------------');
					console.log(json.ticket_groups[i]);

					console.log('------------------------------------------------------');
					var split_tickets = '';
					for (var j = 0, d = json.ticket_groups[i].splits.length; j < d; j++) {
						console.log(json.ticket_groups[i].splits);
						var quantity_ = (json.ticket_groups[i].splits);
						split_tickets += '<option value="' + quantity_[j] + '">' + quantity_[j] + '</option>';
					}
					tableTicket += '<tr><td>' + json.ticket_groups[i].section + '</td><td>' + json.ticket_groups[i].row + '</td><td><form action="/checkout/" method="post"><input type="hidden" value="' + json.ticket_groups[i].in_hand_on + '" name="in_hand_on"><input type="hidden" value="' + json.ticket_groups[i].in_hand + '" name="in_hand"><input type="hidden" value="' + json.ticket_groups[i].eticket + '" name="eticket"><input type="hidden" value="' + event_name + '" name="event_name"><input type="hidden" value="' + event_date + '" name="event_date"><input type="hidden" value="' + fbId + '" name="uid" id="uid"><select name="userticketsquantity" id="ticketsquantity">' + split_tickets + '</select></td><td>$' + json.ticket_groups[i].wholesale_price + '</td><td><input type="hidden" value="' + event_id + '" name="event_id"><input type="hidden" value="' + json.ticket_groups[i].id + '" name="groupticket_id"><input type="hidden" value="' + venue_id + '" name="venue_id"><input type="hidden" value="' + json.ticket_groups[i].quantity + '" name="quantity"><input type="hidden" value="' + json.ticket_groups[i].instant_delivery + '" name="instant_delivery"><input type="hidden" value="' + json.ticket_groups[i].in_hand + '" name="in_hand"><input type="hidden" value="' + json.ticket_groups[i].format + '" name="format"><input type="hidden" value="' + json.ticket_groups[i].section + '" name="section"><input type="hidden" value="' + json.ticket_groups[i].row + '" name="row"><input type="hidden" value="' + json.ticket_groups[i].wholesale_price + '" name="priceticket"><input type="hidden" value="' + json.ticket_groups[i].quantity + '" name="quantity"><button type="submit" class="btn blue">BUY</button></form></td></tr>';
				}
			}
			res.status(200).send(headerTickets + tableOpen + tableTicket + tableClose + footerTickets);
			res.end();
		}



	}).catch((err) => {
		console.log('Error al Recuperar los eventos');
		console.log(err);
	});

	//});
});

module.exports = router;