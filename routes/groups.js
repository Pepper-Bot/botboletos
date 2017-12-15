var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
/* GET home page. */
var tevo = require('../config/config_vars').tevo;
var APLICATION_URL_DOMAIN = require('../config/config_vars').APLICATION_URL_DOMAIN;
var format = require('format-number');

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
	apiToken: tevo.API_TOKEN,
	apiSecretKey: tevo.API_SECRET_KEY
});



router.get('/', function (req, res) {

	var event_id = req.query.event_id;
	var fbId = req.query.uid;
	/*var venue_id = req.query.venue_id;
	var event_name = req.query.event_name;
	var performer_id = req.query.performer_id;
	var seatsmap = req.query.seatsmap;
	var event_date = req.query.event_date;*/

	var urlApiTevo = '';


	urlApiTevo = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'
	console.log('Groups url api tevo>>>>>>>' + urlApiTevo);

	if (undefined == req.query.uid) {
		res.status(200);
		res.send('Error trying to access');
		res.end();
		return;
	}

	var searchTicketGroupByEventId = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'

	tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {

		var searchById = tevo.API_URL + 'events/' + event_id
		formatPrice(ticketG.ticket_groups).then((ticketGroups) => {

			///console.log("TicketGroup  Construida: >>> " + JSON.stringify(ticketGroups));

			tevoClient.getJSON(searchById).then((event) => {

				var occurs_at = event.occurs_at;
				occurs_at = occurs_at.substring(0, occurs_at.length - 4);
				occurs_at = moment(occurs_at).format('MMMM Do YYYY, h:mm a')

				//console.log("EVENT<<<  : >>> " + JSON.stringify(event));
				res.render(
					'./layouts/tickets/ticketgroup', {
						titulo: "Select your tickets",
						APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
						ticketGroups: ticketGroups,
						event_id: event.event_id,
						event_name: event.name,
						event_date: event.occurs_at,
						event_date_f: occurs_at,
						seatsmap: event.configuration.seating_chart.large,
						uid: fbId,
						subtitulo: "Select your tickets",
						venue_name: event.venue.name + ' ' + event.venue.location,
					}
				);
			});
		})
	});

});




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





module.exports = router;