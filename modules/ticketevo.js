/********************************************************************
 * @module Ticket Evolutions Module.
 * @author Amir Canto
 * @version 1
 */


module.exports = function()
{
	var gButtons = null;
	var counter = 0;
	var eventButtons_ = [];
	var callsGis = 0;
	var events_ = []; // Listado de eventos con la informacion completa almacenada.
	var events_name = []; // nombres de eventos
	var calls = 0;	  // contador de llamadas (consultas).
	var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
	var imageCards = require('../modules/imageCards'); // Google images

	var session_, locationData_, fbMessage_;
	// Constructor ;-]
	var teClient = new TevoClient(
	{
		apiToken: process.env.API_TOKEN,
		apiSecretKey: process.env.API_SECRET_KEY
	});

	function getEventInfo(events, callback){

		console.log(events);
		if(events)
		{

			for(var i = 0, c = events.length; i < c; i++)
			{

				teClient.getJSON(process.env.API_URL+'events/'+ events[i]).then((json) => {
					calls++;
					console.log('Obteniendo informacion de evento:');

					console.log('Nombre del evento:'+JSON.stringify(json.name));
					console.log('Indice del EVENTO DENTRO DEL ARRAY:'+events_name.indexOf(JSON.stringify(json.name)));
					if(events_name.indexOf(JSON.stringify(json.name)) == -1 )
					{
                        console.log('No está dentro del array events_name');
						console.log(JSON.stringify(json.name))
						events_name.push(JSON.stringify(json.name));
						events_.push(json);


					}


                    console.log('Llamadas (calls):' + calls);
                    console.log('Events length:'+ events.length);

					if(calls == events.length)
					{
                        console.log('Calls y events son iguales: calls == events.length');
                        console.log('Ponemos events_name a 0');
						events_name = [];

                        console.log('LLAMAMOS al callback para regresar con events_:');

						callback(null, events_);
						events_ = [];
                        calls = 0;
					}
				}).catch((err) => {
					console.log('Error al Recuperar los eventos');
				    console.log(err);
				});



			}


		} else {

			callback(true, null);

		}
	}

	function getEventsId(data, callback){


		console.log('Dentro de getEventsId');
		var events_id = [];
		teClient.getJSON(process.env.API_URL+'events?lat='+data.lat+'&lon='+data.lon+'&page=1&per_page=50&only_with_tickets=all').then((json) => {

			console.log('Obtenemos respuesta');
//			var json = JSON.parse(json);
			//console.log(JSON.stringify(json));
			console.log('llamamos al lciente de eventos');

			console.log('Resultados:'+json.events.length);

			// Si no obtenemos resultados pasamos la información al modulo de ticket master.
			if(json.events.length < 1)
			{
					   var Events = require('./events');
                       Events.get(fbMessage_, session_, locationData_);
			}
			else
			{
				// tenemos resultados, vamos a agregar los ids a un array.
				for(var i = 0, c = json.events.length; i < c; i++)
				{

					console.log('Dandole vueltas para obtener los IDs de los eventos:');
					console.log(JSON.stringify(json.events[i]));
					console.log('/////////////////////////////////////////////////////////////');
					events_id.push(json.events[i].id);
					if( (i+1) == json.events.length)
					{
						callback(null, events_id);
					}
				}
			}

		}).catch((err) => {
			console.log('Error al Recuperar los eventos');
		    console.log(err);
		});
	}


	return {
		// get es la funcion principal que se le pasan tres parametros
		// fbMessage, modulo de fb.
		// result, base de datos (session de chat)
		// locationData, datos de localización proporcionados por Facebook.

		get: function(fbMessage, session, locationData)
		{




			fbMessage_ = fbMessage;
			session_ = session;
			locationData_ = locationData;
			console.log('Iniciando TicketEvolution');
			console.log('API Token:'+ process.env.API_TOKEN);
			console.log('API SECRET KEY:'+ process.env.API_SECRET_KEY);

			var data = {
				lat: locationData.payload.coordinates.lat,
				lon: locationData.payload.coordinates.long
			};
			var eventButtons = [];

			console.log('Datos de localizacion:'+ JSON.stringify(data));
			console.log('Entramos a getEventsId');

			var eventosPorListar = [];

			// Colocamos un typing
			fbMessage.typingOn(session.fbId);
			// Primero obtenemos los id's de los eventos dentro de Ticket Evolution
			 getEventsId(data, function(err, ids){

				// Obtenemos toda su información.
				getEventInfo(ids, function(err, resultEvent){

					fbMessage.typingOff(session.fbId);
					console.log('Dentro de getEventInfo');
					console.log('Datos:');

					var events2 = resultEvent;
					console.log('------------------------------------------------------');
					fbMessage.typingOn(session.fbId);


					console.log(JSON.stringify(resultEvent));

                    eventButtons_ = [];
					for(var j = 0, c = resultEvent.length; j < c; j++)
					{
						console.log('1');

						console.log('#####################################################');
						console.log(resultEvent[j].name);
					/*	if(eventosPorListar.indexOf(resultEvent[j].name) == -1)
						{
						*/

						console.log('2');

						eventosPorListar.push(resultEvent[j].name);
						console.log('3');

						console.log('#####################################################');
                        if(eventButtons_.length < 10)
                        {
							eventButtons_.push({
                                "title": resultEvent[j].name,
                                "image_url": '',
                                "subtitle": resultEvent[j].performances[0].performer.name,
                                "default_action": {
                                  "type": "web_url",
                                  "url":  'https://ticketdelivery.herokuapp.com/event/?event_id='+resultEvent[j].id+'&uid='+session.fbId+'&venue_id='+ resultEvent[j].venue.id+'&performer_id='+resultEvent[j].performances[0].performer.id+'&event_name='+resultEvent[j].name,
                                  "messenger_extensions": true,
                                  "webview_height_ratio": "tall",
                                  "fallback_url": 'https://ticketdelivery.herokuapp.com/event/?event_id='+resultEvent[j].id+'&uid='+session.fbId+'&venue_id='+ resultEvent[j].venue.id+'&performer_id='+resultEvent[j].performances[0].performer.id+'&event_name='+resultEvent[j].name
                                },
                                "buttons":[
                                  {
                                    "type":"web_url",
                                    "url": 'https://ticketdelivery.herokuapp.com/event/?event_id='+resultEvent[j].id+'&uid='+session.fbId+'&venue_id='+ resultEvent[j].venue.id+'&performer_id='+resultEvent[j].performances[0].performer.id+'&event_name='+resultEvent[j].name,
                                    "title":"Book"
                                  }
                                ]
                            });
                        }
                            console.log('4');
                            callsGis++;
                            console.log('callsGist: '+  callsGis);
                            console.log('resultEvent length:' + resultEvent.length);
                            if(callsGis == resultEvent.length)
                            {
                                console.log('son iguales callgis y resultevent')
                                console.log('callGis == resultEvent.length ');
                            	console.log('5');
                                gButtons = null;
                                gButtons = eventButtons_;
                            	console.log('6');
                                counter = 0;
                            	for(var z = 0, k = gButtons.length; z < k; z++)
                            	{


	                            		imageCards(gButtons[z].title, z, function(err, images,index){

	                            			console.log('8');

	                            			console.log('Indice:'+index);

	                            			gButtons[index].image_url = images[0].url;
	                            			counter++;
	                            			console.log('9');
                                            console.log('Contador:'+counter);
                                            console.log('GbUTTONS len:'+ gButtons.length);
	                            			if(counter == gButtons.length)
	                            			{
	                            				console.log('10');
												fbMessage.genericButton(session.fbId, gButtons);
	                            			}
                                            else if(counter == 10)
                                            {

                                                fbMessage.genericButton(session.fbId, gButtons);
                                            }

		                            	});


                            	}


                                callsGis = 0;
                                events_name = null;
                                events_name = [];



                            }
                            else
                            {




                            }

						//}
					}

            //        events_name = null;
              //      events_name = [];
				});





			});




		}

	}

}();

