var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
/* GET home page. */

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var teClient = new TevoClient(
{
	apiToken: process.env.API_TOKEN,
	apiSecretKey: process.env.API_SECRET_KEY
});


router.get('/', function(req, res) {


 	 var event_id = req.query.event_id;
 	 var fbId = req.query.uid;
 	 var venue_id = req.query.venue_id;
 	 var event_name = req.query.event_name;
 	 var performer_id = req.query.performer_id;

     /* Prueba */

 	 // Si no hay session de facebook nos salimos.

	if(undefined == req.query.uid)
	{
		res.status(200);
		res.send('Error trying to access');
		res.end();
		return;
	}
	/*
	UserData2.findOne({fbId: fbId}, {}, { sort: { 'sessionStart' : -1 } }, function(err, result)
	{	*/
        console.log('requestttttttttttttttttttttttt>>>>>>>>>>>>>>>>>>>>>>>>@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
		// Llamos a la API de eventos y traemos un listado de fechas.
		teClient.getJSON(process.env.API_URL+'events/?page=1&per_page=50&performer_id='+performer_id+'&venue_id='+venue_id+'&only_with_tickets=all').then((json) => {
            console.log('ENTRE AL EVENTOO>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
			var htmlHeader = '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no"> <base href="https://ticketdelivery.herokuapp.com/"> <title>Book</title><!--Import Google Icon Font--> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <!--Import materialize.css--> <link type="text/css" rel="stylesheet" href="https://ticketdelivery.herokuapp.com/css/materialize.min.css" media="screen,projection"/> <!--Let browser know website is optimized for mobile--> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> </head> <body> <div class="container"> <div class="row left"> <h3 class="header left blue-text">{EVENT_NAME}</h3> <div class="section"> <div class="row">';
			var boxEvent = ' <div class="col m12 m4"> <div class="card"> <div class="card-image"> <img src="{IMAGE_EVENT}"> <span style="display:none;" class="card-title">{EVENT_NAME}</span> </div> <div class="card-content"> <p>{EVENT_DESCRIPTION} </p> <div class="card-action"> <p><a class="btn blue" href="{URL_PURCHASE_TICKET}">Purchase Ticket</a></p> </div> </div> </div> </div>';

			console.log(JSON.stringify(json));

			if(json)
			{
				if(json.events.length > 0)
				{
					var box = '';

					// remplazaos la informacion en la tarjeta.
					htmlHeader = htmlHeader.replace('{NAME_PERFORMER}',json.events[0].name);
					htmlHeader = htmlHeader.replace('{EVENT_NAME}',json.events[0].name);
					htmlHeader = htmlHeader.replace('{VENUE_NAME}',json.events[0].venue.name + ' ' + json.events[0].venue.location);

					for(var i = 0, c = json.events.length; i < c; i++)
					{
						// Creamos la tarjeta
						console.log('evento:'+json.events[i].name);
						console.log(boxEvent);
						console.log('-------------');
						console.log(boxEvent.replace('{EVENT_NAME}',json.events[i].name));
						box = boxEvent.replace('{EVENT_NAME}',json.events[i].name);
						box = box.replace('{URL_PURCHASE_TICKET}','https://ticketdelivery.herokuapp.com/tickets/?event_id='+json.events[i].id+'&uid='+fbId+'&venue_id='+venue_id+'&performer_id='+performer_id+'&event_name='+json.events[i].name+'&event_date='+json.events[i].occurs_at+'&seatsmap='+json.events[i].configuration.seating_chart.large);
						htmlHeader += box.replace('{EVENT_DESCRIPTION}',json.events[i].name + ' <br> <strong>'+moment(json.events[i].occurs_at).format('dddd')+', '+moment(json.events[i].occurs_at).format('MMMM Do YYYY, h:mm:ss a')+'</strong><br>'+json.events[i].venue.name + ' ' + json.events[i].venue.location);
						box = '';

					}

					htmlHeader += '</div> </div> </div> </div> </div> <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script> <script type="text/javascript" src="https://ticketdelivery.herokuapp.com/js/materialize.min.js"></script> </body></html>';


					// Obtenemos las imagenes de la tarjeta.
					gis(event_name, function(err, images){
						res.send(htmlHeader.replace(new RegExp('{IMAGE_EVENT}', 'g'),images[0].url));
					});
				}
				else
				{
					res.send('<h1>No tickets available.</h1>');
				}
			}
			else
			{

				res.send('<h1>No tickets available.</h1>');

			}

		}).catch((err) => {
			console.log('Error al Recuperar los eventos');
		    console.log(err);
		});

 	//});
});

module.exports = router;
