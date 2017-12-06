 var express = require('express');
 var Message = require('../../bot/messages');
 var UserData2 = require('../../schemas/userinfo');
 var Client = require('../../schemas/clients');
 var moment = require('moment');

 var confirm_mail_html = require('../../config/html_mail_vars').confirm_mail_html;
 var OFFICE_ID = require('../../config/config_vars').OFFICE_ID;

 var Orders = require('../../schemas/orders');

 var tevo = require('../../config/config_vars').tevo;


 var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
 var tevoClient = new TevoClient({
 	apiToken: tevo.API_TOKEN,
 	apiSecretKey: tevo.API_SECRET_KEY
 });

 var finishCC = (req, res) => {
	console.log('Entré al finish finishCC' + client_id)
 	if (undefined == req.session.client_id) {
 		res.status(200);
 		res.send('Error trying to access');
 		res.end();
 		return;
 	}


 	/* Obtenemos la session guardada en mongo db */

 	console.log('client_id' + client_id)
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
 							"seller_id": OFFICE_ID,
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
 							"seller_id": OFFICE_ID,
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
 						res.send('<b>' + OrderRes.error + '</b>');
 						res.end();
 						return;
 					}





 					var Order = new Orders; {
 						Order.order_id.push(OrderRes.orders[0].id);
 						Order.save();
 					}





 					sendEmailSenGrid(clienteSearch, OrderRes)


 					res.render(
 						'./layouts/tickets/finish', {
 							titulo: "Your tickets are on its way!",
 							buyer_name: clienteSearch.fullName,

 						}
 					);





 				});
			 }
			 else{
				res.send('No encontré el cliente  '+  req.session.client_id)
			 }
 		}else{
			 res.send('error '+ error)
		 }
 	});

 }

 var sendEmailSenGrid = (clienteSearch, OrderRes) => {

 	var nombreCliente = OrderRes.orders[0].buyer.name;
 	var eventoNombre = OrderRes.orders[0].items[0].ticket_group.event.name;
 	var ciudadEvento = OrderRes.orders[0].items[0].ticket_group.event.venue.address.locality + ', ' + json.orders[0].items[0].ticket_group.event.venue.address.region;
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
 	var emailsArray = [];
 	var correo = {
 		"email": "leo777jaimes@gmail.com"
 	}
 	emailsArray.push(correo);

 	/*correo = {
 		"email": 'armandorussi@gmail.com'
 	}
 	emailsArray.push(correo)


	 correo = {
		"email": 'thepepperbot@gmail.com'
	}
	emailsArray.push(correo)*/


 	var agregar = false;
 	for (let i = 0; i < emailsArray.length; i++) {
 		if (emailsArray[i].correo == clienteSearch.email_address[0].address) {
 			agregar = true;
 		}
 	}
 	if (agregar === true) {
 		correo = {
 			"email": clienteSearch.email_address[0].address
 		}
 		emailsArray.push(correo);

 	}



 	const sgMail = require('@sendgrid/mail');
 	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 	var msg = {
 		to: emailsArray,
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


 module.exports = {
	finishCC
 };