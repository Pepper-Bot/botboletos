var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var moment = require('moment');
var Client = require('../../schemas/clients');
var Orders = require('../../schemas/orders');
var tevo = require('../../config/config_vars').tevo;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;

var confirm_mail_html = require('../../config/html_mail_vars').confirm_mail_html;

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});



function finish(req, res, payment) {
    var urlApiTevo = tevo.API_URL;
    var searchByEventId = urlApiTevo + '/events/' + req.session.event_id;


    //getOrderData(req, payment);

    tevoClient.getJSON(searchByEventId).then((event) => {
        Client.findOne({
            client_id: req.session.client_id
        }, {}, {
            sort: {
                'client_id': -1
            }
        }, function (err, clienteSearch) {
            if (!err) {
                if (clienteSearch) {
                    createOrder(req, res, payment, event, clienteSearch)
                    //sendEmailSenGrid(req, payment, event, clienteSearch);

                    /*var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
                    res.render(
                        './layouts/tickets/finish', {
                            titulo: "Your tickets are on its way!",
                            buyer_name: pp_recipient_name,

                        }
                    );*/
                }
            }

        });
    });
}



function createOrder(req, res, payment, event, clienteSearch) {


    //pay pal vars
    var pp_email = payment.payer.payer_info.email;
    var pp_first_name = payment.payer.payer_info.first_name;
    var pp_last_name = payment.payer.payer_info.last_name;

    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    var pp_line1 = payment.payer.payer_info.shipping_address.line1;
    var pp_city = payment.payer.payer_info.shipping_address.city;
    var pp_state = payment.payer.payer_info.shipping_address.state;
    var pp_postal_code = payment.payer.payer_info.shipping_address.postal_code;
    var pp_country_code = payment.payer.payer_info.shipping_address.country_code;


    //Session vars
    /*req.session.event_id = event_id;
    req.session.fbId = fbId;
    req.session.venue_id = venue_id;
    req.session.event_name = event_name;
    req.session.performer_id = performer_id;
    req.session.event_date = event_date;
    req.session.section = section;
    req.session.row = row;
    req.session.quantity = quantity;
    req.session.price = price;
    req.session.format = format;
    req.session.eticket = eticket;
    req.session.groupticket_id = groupticket_id;
    req.session.total = price * quantity;
    
    req.session.ship_price
    req.session.provider 
    req.session.shiping_name  
    req.session.event_date
    req.session.address_id = address_id
    req.session.client_id = client_id
    */

    var ticket_group_id = req.session.groupticket_id;
    var price = req.session.price
    var quantity = req.session.quantity

    var email_address_id = clienteSearch.email_id;
    var billing_address_id = clienteSearch.billing_address_id[clienteSearch.billing_address_id.length - 1]; // es una respuesta cuando se guarda el cliente

    var seller_id = tevo.OFFICE_ID
    var client_id = clienteSearch.client_id; // es una respuesta cuando se guarda el cliente
    var created_by_ip_address = ''; // Required for brokerages who have enabled Minfraud
    var instructions = '';
    var shipping = 0.0
    if (req.session.ship_price) {
        var shipping = req.session.ship_price // Se obtine luego de hacer petición de shipping   Additional amount added to the order to be labeled as Shipping Cost
    }

    let amount = (parseFloat(price * quantity).toFixed(2))
    var type = 'offline'; //modo sugerido por tevo


    var service_fee = 0.00;
    var additional_expense = 0.00;
    var tax = 0.00;
    let discount = 0.00;
    if (req.session.discount && req.session.discount > 0) {
        discount = req.session.discount
        amount = parseFloat(amount - discount).toFixed(2)
    }

    var promo_code = req.session.promo_code;

    //
    var phone_number_id = clienteSearch.phone_id;
    var address_id = clienteSearch.address_id[clienteSearch.address_id.length - 1]; //se obtiene luego de la creacion del cliente
    var ship_to_name = clienteSearch.fullName; // nombre completo del cliente
    var address_attributes_name = clienteSearch.fullName; // nombre completo del cliente
    var street_address = clienteSearch.addresses[0].street_address
    var extendend_address = ''; //está enviado vacío 
    var locality = clienteSearch.addresses[0].locality;
    var region = clienteSearch.addresses[0].region;
    var country_code = clienteSearch.addresses[0].country_code;
    var postal_code = clienteSearch.addresses[0].postal_code;



    var created_by_ip_address = ''
    var shipping_address_name = '';
    var shipping_price = 0.00;

    var format = req.session.format;

    var format_type = req.session.format_type
    let orderData = {}
    if (format == 'Eticket') {
        orderData = {
            "orders": [{
                "shipped_items": [{
                    "items": [{
                        "ticket_group_id": ticket_group_id,
                        "price": price,
                        "quantity": quantity,
                    }],
                    "type": "Eticket",
                    "email_address_id": email_address_id
                }],
                "billing_address_id": billing_address_id,
                "payments": [{
                    "type": type,
                    "amount": amount
                }],
                "seller_id": seller_id,
                "client_id": client_id,
                "created_by_ip_address": created_by_ip_address,
                "instructions": instructions,
                "shipping": shipping,
                "service_fee": service_fee,
                "additional_expense": additional_expense,
                "tax": tax,
                "discount": discount,
                "promo_code": promo_code
            }]
        };
    } else {
        orderData = {
            "orders": [{
                "shipped_items": [{
                    "items": [{
                        "ticket_group_id": ticket_group_id,
                        "price": price,
                        "quantity": quantity,
                    }],
                    "phone_number_id": phone_number_id,
                    "service_type": "LEAST_EXPENSIVE",
                    "type": format_type,
                    "address_id": address_id,
                    "ship_to_name": ship_to_name,
                    "address_attributes": {
                        "name": address_attributes_name,
                        "street_address": street_address,
                        "extendend_address": extendend_address,
                        "locality": locality,
                        "region": region,
                        "country_code": country_code,
                        "postal_code": postal_code,
                        "label": "shipping"
                    }

                }],
                "billing_address_id": billing_address_id,
                "payments": [{
                    "type": type,
                    "amount": amount,

                }],
                "seller_id": seller_id,
                "client_id": client_id,
                "created_by_ip_address": created_by_ip_address,
                "instructions": instructions,
                "shipping_address": {
                    "name": shipping_address_name,
                    "street_address": street_address,
                    "extendend_address": req.body.extendend_address,
                    "locality": locality,
                    "region": region,
                    "country_code": country_code,
                    "postal_code": postal_code,
                    "label": "shipping"
                },
                "shipping": shipping_price,
                "service_fee": service_fee,
                "additional_expense": additional_expense,
                "tax": tax,
                "discount": discount,
                "promo_code": promo_code
            }]
        }
    }
    console.log("Orden Construida: >>> " + JSON.stringify(orderData));

    console.log("Inicio Orden Tevo >>> " + tevo.API_URL);
    //if (tevo.API_URL === "https://api.sandbox.ticketevolution.com/v9/") {
    tevoClient.postJSON(tevo.API_URL + 'orders', orderData).then((OrderRes) => {
        if (OrderRes.error != undefined) {

            console.log("Orden de TEVO Respuesta : >>> " + JSON.stringify(OrderRes));
            res.send('<b>' + OrderRes.error + '</b>');
            res.end();

        } else {


            console.log("Orden de TEVO Respuesta : >>> " + JSON.stringify(OrderRes));

            var Order = new Orders; {
                Order.order_id.push(OrderRes.orders[0].id);
                Order.order_tevo = OrderRes.orders[0]
                Order.save(function (err, orderSaved) {
                    if (err) {
                        console.log("Error al guardar la orden" + err)
                    } else {
                        if (orderSaved) {
                            console.log("Orden Guardada  : >>> " + JSON.stringify(orderSaved));
                        }

                    }


                });



            }


            sendEmailSenGrid(req, payment, event, clienteSearch, OrderRes, discount)

            var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
            res.render(
                './layouts/tickets/finish', {
                    titulo: "Your tickets are on its way!",
                    APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
                    buyer_name: pp_recipient_name,

                }
            );
        }



    });
    //}
}


function sendEmailSenGrid(req, payment, event, clienteSearch, OrderRes, discount) {
    //pay pal vars
    var pp_email = payment.payer.payer_info.email;
    var pp_first_name = payment.payer.payer_info.first_name;
    var pp_last_name = payment.payer.payer_info.last_name;
    var pp_recipient_name = payment.payer.payer_info.shipping_address.recipient_name;
    var pp_line1 = payment.payer.payer_info.shipping_address.line1;
    var pp_city = payment.payer.payer_info.shipping_address.city;
    var pp_state = payment.payer.payer_info.shipping_address.state;
    var pp_postal_code = payment.payer.payer_info.shipping_address.postal_code;
    var pp_country_code = payment.payer.payer_info.shipping_address.country_code;




    var nombreCliente = OrderRes.orders[0].buyer.name;
    var eventoNombre = OrderRes.orders[0].items[0].ticket_group.event.name;
    var ciudadEvento = OrderRes.orders[0].items[0].ticket_group.event.venue.address.locality + ', ' + OrderRes.orders[0].items[0].ticket_group.event.venue.address.region;
    var fechaEvento = moment(OrderRes.orders[0].items[0].ticket_group.event.occurs_at).format('MMMM Do YYYY');
    var horaEvento = moment(OrderRes.orders[0].items[0].ticket_group.event.occurs_at).format('h:mm:ss a');
    var cantidadTickets = OrderRes.orders[0].items[0].quantity;
    var tipoTickets = OrderRes.orders[0].items[0].ticket_group.format;
    var precio = OrderRes.orders[0].items[0].price;
    var costoTotal = OrderRes.orders[0].items[0].cost;


    var ordenNumber = ""
    var fechaOrden = ""
    var clienteId = ""
    var venueEvento = ""
    if (OrderRes) {
        ordenNumber = OrderRes.orders[0].id;
        fechaOrden = moment(OrderRes.orders[0].created_at).format('MMMM Do YYYY, h:mm a');
        clienteId = OrderRes.orders[0].buyer.id;
        venueEvento = OrderRes.orders[0].items[0].ticket_group.event.venue.name;
    }



    var format = req.session.format;

    var emailsArray = [];
    var correo = {
        "email": 'armandorussi@gmail.com'
    }
    emailsArray.push(correo)


    var correo = {
        "email": 'thepepperbot@gmail.com'
    }
    emailsArray.push(correo)

    var correo = {
        "email": "leo777jaimes@gmail.com"
    }
    emailsArray.push(correo);



    correo = {
        "email": pp_email
    }
    emailsArray.push(correo);
    console.log("correo 1 >" + pp_email)

    correo = {
        "email": clienteSearch.email_address[0].address
    }

    emailsArray.push(correo);
    console.log("correo 2  >" + clienteSearch.email_address[0].address)




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


    if (discount > 0) {
        templateHTML = templateHTML.replace("{{PayDescription}}", `${cantidadTickets} ${tipoTickets} ${precio} - Discount ${discount} = $ ${costoTotal}`);
    } else {
        templateHTML = templateHTML.replace("{{PayDescription}}", `${cantidadTickets} ${tipoTickets} ${precio} = $ ${costoTotal}`);
    }




    if (format == 'Eticket') {
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


function removeDuplicates(originalArray, prop) {
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
    finish
}