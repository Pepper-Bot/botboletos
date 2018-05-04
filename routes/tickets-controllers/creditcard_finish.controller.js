 var express = require('express');
 var router = express.Router();
 var Message = require('../../bot/messages');
 var UserData2 = require('../../schemas/userinfo');
 var Client = require('../../schemas/clients');
 var moment = require('moment');

 var confirm_mail_html = require('../../config/html_mail_vars').confirm_mail_html;
 var Orders = require('../../schemas/orders');
 var tevo = require('../../config/config_vars').tevo;
 var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;
 var FINISH_SESSION_URL_REDIRECT = require('../../config/config_vars').FINISH_SESSION_URL_REDIRECT;



 var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
 var tevoClient = new TevoClient({
 	apiToken: tevo.API_TOKEN,
 	apiSecretKey: tevo.API_SECRET_KEY
 });

 var finishCC = function (req, res) {


 	if (undefined == req.session.client_id) {
 		res.status(200);
 		res.send('Error trying to access');
 		//res.redirect(FINISH_SESSION_URL_REDIRECT)
 		res.end();
 		return;
 	}


 	/*Obtenemos la session guardada en mongo db */

 	console.log('client_id' + req.session.client_id)
 	Client.findOne({
 		client_id: req.session.client_id
 	}, {}, {
 		sort: {
 			'sessionStart': -1
 		}
 	}, function (error, clienteSearch) {
 		if (!error) {
 			if (clienteSearch) {
 				// Verificamoas el tipo de ticket.
 				// Si es Eticket o Fisco para planear el request.
 				if (req.body.format == 'Eticket') {
 					var orderData = {
 						"orders": [{
 							"shipped_items": [{
 								"items": [{
 									"ticket_group_id": req.body.ticket_group_id,
 									"price": req.body.price_per_ticket,
 									"quantity": req.body.quantity,
 								}],
 								"type": "Eticket",
 								"email_address_id": clienteSearch.email_id
 							}],
 							"billing_address_id": clienteSearch.billing_address_id[clienteSearch.billing_address_id.length - 1],
 							"payments": [{

 								"type": "credit_card",
 								"amount": (parseFloat(req.body.price_per_ticket * req.body.quantity).toFixed(2)),
 								"credit_card_id": clienteSearch.creditcard_id[clienteSearch.creditcard_id.length - 1]
 							}],
 							"seller_id": tevo.OFFICE_ID,
 							"client_id": clienteSearch.client_id,
 							"created_by_ip_address": '',
 							"instructions": "",
 							"shipping": req.body.shipping_price,
 							"service_fee": 0.00,
 							"additional_expense": 0.00,
 							"tax": 0.00,
 							"discount": 0.00,
 							"promo_code": ""
 						}]
 					};
 				} else {
 					var orderData = {
 						"orders": [{
 							"shipped_items": [{
 								"items": [{
 									"ticket_group_id": req.body.ticket_group_id,
 									"price": req.body.price_per_ticket,
 									"quantity": req.body.quantity,
 								}],
 								"phone_number_id": clienteSearch.phone_id,
 								"service_type": "LEAST_EXPENSIVE",
 								"type": "FedEx",
 								"address_id": clienteSearch.address_id[clienteSearch.address_id.length - 1],
 								"ship_to_name": clienteSearch.fullName,
 								"address_attributes": {
 									"name": clienteSearch.fullName,
 									"street_address": req.body.street_address,
 									"extendend_address": req.body.extendend_address,
 									"locality": req.body.locality,
 									"region": req.body.region,
 									"country_code": req.body.country_code,
 									"postal_code": req.body.postal_code,
 									"label": "shipping"
 								}

 							}],
 							"billing_address_id": clienteSearch.billing_address_id[clienteSearch.billing_address_id.length - 1],
 							"payments": [{

 								"type": "credit_card",
 								"amount": (parseFloat(req.body.price_per_ticket * req.body.quantity).toFixed(2)),
 								"credit_card_id": clienteSearch.creditcard_id[clienteSearch.creditcard_id.length - 1]
 							}],
 							"seller_id": tevo.OFFICE_ID,
 							"client_id": clienteSearch.client_id,
 							"created_by_ip_address": "",
 							"instructions": "",
 							"shipping_address": {
 								"name": req.body.name2,
 								"street_address": req.body.street_address,
 								"extendend_address": req.body.extendend_address,
 								"locality": req.body.locality,
 								"region": req.body.region,
 								"country_code": req.body.country_code,
 								"postal_code": req.body.postal_code,
 								"label": "shipping"
 							},
 							"shipping": req.body.shipping_price,
 							"service_fee": 0.00,
 							"additional_expense": 0.00,
 							"tax": 0.00,
 							"discount": 0.00,
 							"promo_code": ""
 						}]
 					}
 				}
 				console.log(JSON.stringify(orderData));


 				// Realizamos la orden.
 				var createOrder = tevo.API_URL + 'orders'


 				tevoClient.postJSON(createOrder, orderData).then((OrderRes) => {
 					if (OrderRes.error != undefined) {
 						res.send('<b>Error Order:' + OrderRes.error + '</b>');
 						res.end();
 						return;
 					}



 					console.log("<OrderResmsg>" + JSON.stringify(OrderRes));

 					var Order = new Orders; {
 						Order.order_id.push(OrderRes.orders[0].id);
 						Order.order_tevo = OrderRes.orders[0]
 						Order.save(function (err, orderSaved) {
 							if (err) {
 								console.log("Error al guardar la orden" + err)
 							} else {
 								if (orderSaved) {
 									//console.log("Orden Guardada Bien : >>> " + JSON.stringify(orderSaved));
 									console.log("Orden Guardada Bien : >>> ");
 								}

 							}


 						});



 					}





 					sendEmailSenGrid(req, res, clienteSearch, OrderRes)

 					//req.session.destroy();

 

 					res.render(
 						'./layouts/tickets/finish', {
 							titulo: "Your tickets are on its way!",
 							APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
 							buyer_name: clienteSearch.fullName,

 						}
 					);




 				});
 			} else {
 				res.send('No encontré el cliente  ' + req.session.client_id)
 			}
 		} else {
 			res.send('error ' + error)
 		}
 	});

 }

 var sendEmailSenGrid = (req, res, clienteSearch, OrderRes) => {

 	var nombreCliente = OrderRes.orders[0].buyer.name;
 	var eventoNombre = OrderRes.orders[0].items[0].ticket_group.event.name;
 	var ciudadEvento = OrderRes.orders[0].items[0].ticket_group.event.venue.address.locality + ', ' + OrderRes.orders[0].items[0].ticket_group.event.venue.address.region;
 	var fechaEvento = moment(OrderRes.orders[0].items[0].ticket_group.event.occurs_at).format('MMMM Do YYYY');
 	var horaEvento = moment(OrderRes.orders[0].items[0].ticket_group.event.occurs_at).format('h:mm:ss a');
 	var cantidadTickets = OrderRes.orders[0].items[0].quantity;
 	var tipoTickets = OrderRes.orders[0].items[0].ticket_group.format;
 	var precio = OrderRes.orders[0].items[0].price;
 	var costoTotal = OrderRes.orders[0].items[0].cost;
 	var ordenNumber = OrderRes.orders[0].id;
 	var fechaOrden = moment(OrderRes.orders[0].created_at).format('MMMM Do YYYY, h:mm:ss a');
 	var clienteId = OrderRes.orders[0].buyer.id;
 	var venueEvento = OrderRes.orders[0].items[0].ticket_group.event.venue.name;



 	var emailsArray = [];
 	var correo = {
 		"email": "leo777jaimes@gmail.com"
 	}
 	emailsArray.push(correo);

 	correo = {
 		"email": 'armandorussi@gmail.com'
 	}
 	emailsArray.push(correo)


 	correo = {
 		"email": 'thepepperbot@gmail.com'
 	}
 	emailsArray.push(correo)

 	console.log("correo 1" + clienteSearch.email_address[0].address)

 	correo = {
 		"email": clienteSearch.email_address[0].address
 	}

 	emailsArray.push(correo);

 	var emailsArrays = removeDuplicates(emailsArray, "email");
 	console.log("uniqueArray is: " + JSON.stringify(emailsArrays));

 	var templateHTML = confirm_mail_html
 	templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
 	templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
 	templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
 	templateHTML = templateHTML.replace('{EVENT_NAME}', eventoNombre);
 	templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
 	templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
 	templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
 	templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
 	templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
 	templateHTML = templateHTML.replace('&lt;Time&gt;', horaEvento);
 	templateHTML = templateHTML.replace('&lt;Start Time&gt;', horaEvento);
 	templateHTML = templateHTML.replace('&lt;Quantity&gt;', cantidadTickets);
 	templateHTML = templateHTML.replace('&lt;Number of Tickets&gt;', cantidadTickets);
 	templateHTML = templateHTML.replace('&lt;type of ticket&gt;', tipoTickets);
 	templateHTML = templateHTML.replace('&lt;Price&gt;', precio);
 	templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
 	templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
 	templateHTML = templateHTML.replace('&lt;Order&gt;', ordenNumber);
 	templateHTML = templateHTML.replace('&lt;orderDate&gt;', fechaOrden);
 	templateHTML = templateHTML.replace('&lt;Customer&gt;', clienteId);
 	templateHTML = templateHTML.replace('&lt;Location&gt;', venueEvento);

 	if (req.body.format == 'Eticket') {
 		templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'Eticket - Email with PDF');

 	} else {

 		templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'FedEx');

 	}

 	const sgMail = require('@sendgrid/mail');
 	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 	var msg = {
 		to: emailsArrays,
 		from: 'PepperBot Tickets <thepepperbot@gmail.com>',
 		subject: 'Your Event tickets!',
 		html: templateHTML,
 	};
 	//console.log("<msg>" + JSON.stringify(msg));

 	sgMail.send(msg, function (err, body) {
 		console.log("<correo>" + JSON.stringify(err));
 		console.log("<correo>" + JSON.stringify(body));

 	});




 }


 var removeDuplicates = (originalArray, prop) => {
 	var newArray = [];
 	var lookupObject = {};

 	for (var i in originalArray) {
 		lookupObject[originalArray[i][prop]] = originalArray[i];
 	}

 	for (i in lookupObject) {
 		newArray.push(lookupObject[i]);
 	}
 	return newArray;
 }


 module.exports = {
 	finishCC
 };