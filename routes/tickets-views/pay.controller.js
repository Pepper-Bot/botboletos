var express = require('express');
var router = express.Router();
var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var Client = require('../../schemas/clients');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
var nodemailer = require('nodemailer');
var countries = require('../../lib/config_vars').COUNTRIES;
/* GET home page. */

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var teClient = new TevoClient({
    apiToken: process.env.API_TOKEN,
    apiSecretKey: process.env.API_SECRET_KEY
});


var init_pay = function (req, res) {

    switch (req.body.payment_type) {
        case "cc":
            {
                pay_with_cc(req, res);
            }
            break;
        case "pp":
            {
                pay_with_pp(req, res);
            }
            break;
        default:
            {

            }
            break;
    }

}

//########################################################
//  render_paypal_form función que  renderiza el formuario
//########################################################
var render_paypal_form = (req, res, direccionEnvio, shiping) => {
    var ship_price = 0;
    var with_ship = false;
    var uid = req.query.uid
    var firstname = req.body.firstname
    var lastname = req.body.lastname

    if (direccionEnvio) {
        var street_address = direccionEnvio.street_address
        var locality = direccionEnvio.locality
        var region = direccionEnvio.region
        var country_code = direccionEnvio.country_code
        var postal_code = direccionEnvio.postal_code
    } else {

        var street_address = ""
        var locality = ""
        var region = ""
        var country = ""
        var postal_code = ""
    }


    var email = req.body.email
    var format = req.body.format
    var groupticket_id = req.body.groupticket_id
    var price = req.body.price
    var quantity = req.body.quantity
    var address_id = ""

    if (shiping) {
        var service_type = shiping.service_type
        var provider = shiping.provider
        var shiping_name = shiping.name
        ship_price = shiping.price
        with_ship = true;
    } else {
        var service_type = ""
        var provider = ""
        var shiping_name = ""
        ship_price = 0
    }

    var event_name = req.body.event_name
    console.log("event_date >>" + req.session.event_date);
    var event_date = moment(req.session.event_date).format('MMMM Do YYYY, h:mm a')
    var section = req.body.section
    var row = req.body.row
    var quantity = req.body.quantity
    var price = req.body.price
    var format = req.body.format

    var subtotal = (req.body.price * req.body.quantity);
    var total = ((req.body.price * req.body.quantity) + ship_price)
    var provider = ""
    var address_id = ""

    res.render(
        './layouts/tickets/pay', {
            titulo: "Your tickets are on its way!",
            ship_price: ship_price,
            uid: uid,
            firstname: firstname,
            lastname: lastname,
            street_address: street_address,
            locality: locality,
            region: region,
            country_code: country_code,
            postal_code: postal_code,
            email: email,
            format: format,
            groupticket_id: groupticket_id,
            price: price,
            quantity: quantity,
            address_id: address_id,
            service_type: service_type,
            provider: provider,
            shiping_name: shiping_name,
            ship_price: price,
            event_name: event_name,
            event_date: event_date,
            section: section,
            row: row,
            subtotal: subtotal,
            total: total,
            with_ship: with_ship,
            provider: provider

        }
    );
}

//########################################################
//  pago con pay pal creación de cliente y shipping 
//########################################################
var pay_with_pp = (req, res) => {

    if (undefined == req.query.uid) {
        res.status(200);
        res.send('Error trying to access');
        res.end();
        return;
    }


    var direccionEnvio = {};
    if (req.body.format != 'Eticket') {
        if (req.body.same_as_ship != undefined && req.body.same_as_ship == '1') {
            direccionEnvio = {
                label: 'Shipping',
                region: req.body.billing_state,
                country_code: countries[req.body.billing_country],
                postal_code: req.body.billing_zipcode,
                street_address: req.body.billing_address,
                extendend_address: '',
                locality: req.body.billing_city
            };
        } else {
            direccionEnvio = {
                label: 'Shipping',
                region: req.body.state,
                country_code: countries[req.body.country],
                postal_code: req.body.zipcode,
                street_address: req.body.ship_address,
                extendend_address: '',
                locality: req.body.city
            };
        }
    }


    var addresses = [];
    if (req.body.format != 'Eticket') {
        if (req.body.same_as_ship != undefined && req.body.same_as_ship == '1') {
            addresses.push({
                "region": req.body.billing_state,
                "country_code": countries[req.body.billing_country],
                "postal_code": req.body.billing_zipcode,
                "street_address": req.body.billing_address,
                "locality": req.body.billing_city
            });

        } else {
            addresses.push({
                "label": "Shipping",
                "region": req.body.state,
                "country_code": countries[req.body.country],
                "postal_code": req.body.zipcode,
                "street_address": req.body.ship_address,
                "locality": req.body.city
            });
            addresses.push({
                "label": "Billing",
                "region": req.body.billing_state,
                "country_code": countries[req.body.billing_country],
                "postal_code": req.body.billing_zipcode,
                "street_address": req.body.billing_address,
                "locality": req.body.billing_city
            });
        }
    } else {
        addresses.push({
            "label": "Billing",
            "region": req.body.billing_state,
            "country_code": countries[req.body.billing_country],
            "postal_code": req.body.billing_zipcode,
            "street_address": req.body.billing_address,
            "locality": req.body.billing_city
        });

    }


    console.log(addresses);
    var clientData = {
        "clients": [{
            "name": req.body.firstname + ' ' + req.body.lastname,
            "email_addresses": [{
                "address": req.body.email
            }],
            addresses,
            "phone_numbers": [{
                "number": req.body.phone
            }],
            "office_id": process.env.OFFICE_ID,
            "tags": ""
        }]
    };

    teClient.postJSON(process.env.API_URL + 'clients', clientData).then((clientTevoRes) => {
        console.log("cliente devuelto por tevo >>" + JSON.stringify(clientTevoRes));
        var bill_address = '';
        var shipp_address = '';
        Client.findOne({
            fbId: req.query.uid
        }, {}, {
            sort: {
                'sessionStart': -1
            }
        }, function (err, clienteSearch) {
            if (clienteSearch == null) {
                var ClientData = new Client;

                ClientData.fbId = req.query.uid;
                ClientData.fullName = clientTevoRes.clients[0].name;
                ClientData.client_id = clientTevoRes.clients[0].id;
                ClientData.email_id = clientTevoRes.clients[0].email_addresses[0].id;
                ClientData.phone_id = clientTevoRes.clients[0].phone_numbers[0].id;
                if (clientTevoRes.clients[0].addresses.length > 1) {
                    // Si hay dos direcciones
                    // una es la billing address y la otra la shipping.
                    for (var i = 0, c = clientTevoRes.clients[0].addresses.length; i < c; i++) {
                        if (clientTevoRes.clients[0].addresses[i].label == 'Billing') {
                            ClientData.billing_address_id.push(clientTevoRes.clients[0].addresses[i].id);
                        } else {
                            ClientData.address_id.push(clientTevoRes.clients[0].addresses[i].id);

                        }
                    }

                } else {
                    ClientData.address_id.push(clientTevoRes.clients[0].addresses[0].id);
                    ClientData.billing_address_id.push(clientTevoRes.clients[0].addresses[0].id);

                }
                ClientData.save();


                var dataShip = {
                    "ticket_group_id": req.body.groupticket_id,
                    "address_id": ClientData.address_id[ClientData.address_id.length - 1],
                    "address_attributes": direccionEnvio
                };

                teClient.postJSON(process.env.API_URL + 'shipments/suggestion', dataShip).then((shiping) => {
                    console.log("shiping de tevo >>" + JSON.stringify(shiping));
                    //renderizamos el formulario
                    if (!shipping.error) {
                        render_paypal_form(req, res, direccionEnvio, shiping)
                    } else {
                        res.send(" shipping ERROR   " + shipping.error)
                    }



                }).catch((err) => {
                    console.log('Error shipments');
                    console.log(err);
                });


            } else {
                clienteSearch.fbId = req.query.uid;
                clienteSearch.fullName = clientTevoRes.clients[0].name;
                clienteSearch.client_id = clientTevoRes.clients[0].id;
                clienteSearch.email_id = clientTevoRes.clients[0].email_addresses[0].id;
                clienteSearch.phone_id = clientTevoRes.clients[0].phone_numbers[0].id;
                if (clientTevoRes.clients[0].addresses.length > 1) {

                    for (var i = 0, c = clientTevoRes.clients[0].addresses.length; i < c; i++) {
                        if (clientTevoRes.clients[0].addresses[i].label == 'Billing') {
                            clienteSearch.billing_address_id.push(clientTevoRes.clients[0].addresses[i].id);

                        } else {
                            clienteSearch.address_id.push(clientTevoRes.clients[0].addresses[i].id);
                        
                        }
                    }

                } else {

                    clienteSearch.address_id.push(clientTevoRes.clients[0].addresses[0].id);
                    clienteSearch.billing_address_id.push(clientTevoRes.clients[0].addresses[0].id);
                   
                }
                clienteSearch.save();


                var dataShip = {
                    "ticket_group_id": req.body.groupticket_id,
                    "address_id": clienteSearch.address_id[clienteSearch.address_id.length - 1],
                    "address_attributes": direccionEnvio
                };

                teClient.postJSON(process.env.API_URL + 'shipments/suggestion', dataShip).then((shiping) => {
                    console.log("shiping de tevo >>" + JSON.stringify(shiping));
                    //renderizamos el formulario
                    if (!shipping.error) {
                        render_paypal_form(req, res, direccionEnvio, shiping)
                    } else {
                        res.send(" shipping ERROR   " + shipping.error)
                    }
                }).catch((err) => {
                    console.log('Error shipments');
                    console.log(err);
                });
            }

        });


    }).catch((err) => {
        console.log('Error al Recuperar los eventos');
        console.log(err);
    });

}







//########################################################
//  pago con CRÉDIT CARDS  creación de cliente y shipping 
//########################################################
var pay_with_cc = (req, res) => {
    var direccionEnvio = {};
    if (req.body.format != 'Eticket') {
        if (req.body.same_as_ship != undefined && req.body.same_as_ship == '1') {
            direccionEnvio = {
                label: 'Shipping',
                region: req.body.billing_state,
                country_code: countries[req.body.billing_country],
                postal_code: req.body.billing_zipcode,
                street_address: req.body.billing_address,
                extendend_address: '',
                locality: req.body.billing_city
            };
        } else {
            direccionEnvio = {
                label: 'Shipping',
                region: req.body.state,
                country_code: countries[req.body.country],
                postal_code: req.body.zipcode,
                street_address: req.body.ship_address,
                extendend_address: '',
                locality: req.body.city
            };
        }
    }



    if (undefined == req.query.uid) {
        res.status(200);
        res.send('Error trying to access');
        res.end();
        return;
    }
    console.log('Dentro de payjs');
    console.log('---------------------------------------------------');
    console.log(req.body);
    console.log('---------------------------------------------------');


    var endOrder = function (data, res, data) {

        console.log('######################################################################');

        console.log('Datos tirados de data:');
        console.log(data);
        console.log('######################################################################');
        /*
        	{
        	 	format: 'Eticket',
        	 	groupticket_id: '332555022',
        	 	firstname: 'Amir',
        	 	lastname: 'Canto',
        	 	billing_address: 'Calle falsa #123',
        		billing_city: 'merida',
        		billing_zipcode: '92393',
        		billing_country: 'MX',
        		billing_state: 'Outside the U.S.',
        		same_as_ship: '1',
        	 	ship_address: 'Calle falsa #123',
        	 	city: 'merida',
        	 	country: 'MX',
        	 	zipcode: '92393',
        	 	state: 'Outside the U.S.',
        	 	email: 'amir@aptem.mx',
        	 	phone: '9993221869',
        	 	cc: '5584266307300186',
        	 	exp_month: '10',
        	 	exp_year: '2020',
        	 	cvv: '845',
        	 	checkout: ''
        	}
        */


        console.log('------------------Tarjeta de crédito');
        console.log(req.body);
        console.log('------------------------------------');
        var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
        console.log('IP Address:' + ip);


        var cc = {
            "credit_cards": [{
                "name": req.body.firstname + ' ' + req.body.lastname,
                "number": req.body.cc, //"4111111111111111",
                "verification_code": req.body.cvv, //"666" ,
                "expiration_month": req.body.exp_month, //,"12"
                "expiration_year": req.body.exp_year, //,"2013"
                "address_id": data.billaddress_id,
                "phone_number_id": data.phone_id
            }]
        };
        console.log(cc);

        console.log('Empezando a crear tarjeta');
        teClient.postJSON(process.env.API_URL + 'offices/' + process.env.OFFICE_ID + '/credit_cards', cc).then((json) => {
            console.log('Creada');
            console.log(json);


            console.log('1');
            if (json.error != undefined) {
                console.log('1.1.');
                res.send('<strong>Error on your credit card.</strong> Error:' + json.error);
                res.end();
                return;
            }

            console.log('2');
            console.log('######################');
            console.log('Tarjeta de crédito creada exitosamente');
            console.log('3');
            Client.findOne({
                fbId: req.query.uid
            }, {}, {
                sort: {
                    'sessionStart': -1
                }
            }, function (err, result) {


                // Empujamos tarjeta de credito a la base de datos
                result.creditcard_id.push(json.credit_cards[0].id);
                result.save(function (err) {
                    if (!err) {




                    }
                });

                var address_id = result.address_id[result.address_id.length - 1];
                var dataShip = {
                    "ticket_group_id": req.body.groupticket_id,
                    "address_id": address_id,
                    "address_attributes": direccionEnvio
                };

                console.log('Datos enviados:' + JSON.stringify(dataShip));

                teClient.postJSON(process.env.API_URL + 'shipments/suggestion', dataShip).then((json) => {
                    console.log('JSON:' + JSON.stringify(json));
                    console.log('-----------------------------------');
                    var shipPrice = 0;
                    var shippingTable = '';
                    var dataHTML = '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <base href="https://ticketdelivery.herokuapp.com/"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Review order</title> <base href="https://ticketdelivery.herokuapp.com"> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/> </head> <body> <div class="container"> <div class="row"> <div class="col m12 m4"> <h4 class="header left blue-text">Review Order.</h4> <form action="/finish?uid=' + req.query.uid + '" method="post">';
                    var dataForms = '<input type="hidden" name="name2" value="' + req.body.firstname + ' ' + req.body.lastname + '"><input type="hidden" name="street_address" value="' + direccionEnvio.street_address + '"><input type="hidden" name="extended_address" value=""><input type="hidden" name="locality" value="' + direccionEnvio.locality + '"><input type="hidden" name="region" value="' + direccionEnvio.region + '"><input type="hidden" name="country_code" value="' + direccionEnvio.country_code + '"><input type="hidden" name="postal_code" value="' + direccionEnvio.postal_code + '"><input type="hidden" name="label" value="shipping"><input type="hidden" value="' + req.body.email + '" name="email_id"> <input type="hidden" value="' + req.body.format + '" name="format"> <input type="hidden" value="' + req.body.groupticket_id + '" name="ticket_group_id"> <input type="hidden" value="' + req.body.price + '" name="price_per_ticket"> <input type="hidden" value="' + req.body.quantity + '" name="quantity"> <input type="hidden" value="0" name="fee"> <input type="hidden" value="' + address_id + '" name="address_id"> <input type="hidden" value="' + req.body.firstname + ' ' + req.body.lastname + '" name="name"> ';


                    if (json.error == undefined) {
                        var shippingInfo = '<input type="hidden" value="' + json.service_type + '" name="service_type"> <input type="hidden" value="' + json.provider + '" name="provider"><input type="hidden" value="' + json.price + '" name="shipping_price">';
                    } else {
                        var shippingInfo = '';
                    }
                    var dataHTML1 = '<table class="table-responsive"> <thead> <tr> <th>Event</th> <th>Date</th> <th>Seats</th> <th> Quantity</th> <th>Price Each</th> </tr> </thead> <tbody> <tr> <td>' + req.body.event_name + '</td> <td> ' + moment(req.body.event_date).format('MMMM Do YYYY, h:mm:ss a') + ' </td> <td><b>Section:</b> ' + req.body.section + ' <br> <b>Row:</b> ' + req.body.row + '<br> </td> <td>' + req.body.quantity + '</td> <td>$' + req.body.price + '</td> </tr> <tr> <td> <b>Ticket Type: </b><span class="new badge green">' + req.body.format + '</span></td> <td colspan="2"></td> <td><strong>Subtotal</strong></td> <td>$	' + (req.body.price * req.body.quantity) + '</td> </tr>';
                    if (json.error == undefined) {
                        var shippingTable = '<tr> <td colspan="3"></td> <td><strong>Shipping</strong><br><span style="">' + json.name + '</span></td> <td>$' + json.price + '</td> </tr>';
                        shipPrice = json.price;
                    }
                    var dataHTML2 = '<tr> <td colspan="3"></td> <td><strong>Total</strong></td> <td>$' + ((req.body.price * req.body.quantity) + shipPrice) + '</td> </tr> </tbody> </table> <button type="submit" style="width:100%" class="btn green">Finish Checkout</button> </form> </div> </div> </div> <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script> <script type="text/javascript" src="js/materialize.min.js"></script> </body></html>';


                    res.send(dataHTML + dataForms + shippingInfo + dataHTML1 + shippingTable + dataHTML2);
                    res.end();

                }).catch((err) => {
                    console.log('Error shipments');
                    console.log(err);
                });
            });


        }).catch((err) => {
            console.log('Error al crear los eventos');
            console.log(err);
        });
        ///v9/shipments/suggestion



    };

    Client.findOne({
        fbId: req.query.uid
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {
        if (result == null) {

            console.log('#####################################################################');
            console.log('Creando cliente');
            console.log('#####################################################################');

            var addresses = [];

            if (req.body.format != 'Eticket') {
                if (req.body.same_as_ship != undefined && req.body.same_as_ship == '1') {

                    addresses.push({

                        "region": req.body.billing_state,
                        "country_code": countries[req.body.billing_country],
                        "postal_code": req.body.billing_zipcode,
                        "street_address": req.body.billing_address,
                        "locality": req.body.billing_city
                    });




                } else {
                    addresses.push({
                        "label": "Shipping",
                        "region": req.body.state,
                        "country_code": countries[req.body.country],
                        "postal_code": req.body.zipcode,
                        "street_address": req.body.ship_address,
                        "locality": req.body.city
                    });
                    addresses.push({
                        "label": "Billing",
                        "region": req.body.billing_state,
                        "country_code": countries[req.body.billing_country],
                        "postal_code": req.body.billing_zipcode,
                        "street_address": req.body.billing_address,
                        "locality": req.body.billing_city
                    });



                }
            } else {
                addresses.push({
                    "label": "Billing",
                    "region": req.body.billing_state,
                    "country_code": countries[req.body.billing_country],
                    "postal_code": req.body.billing_zipcode,
                    "street_address": req.body.billing_address,
                    "locality": req.body.billing_city
                });

            }


            console.log(addresses);
            var clientData = {
                "clients": [{
                    "name": req.body.firstname + ' ' + req.body.lastname,
                    "email_addresses": [{
                        "address": req.body.email
                    }],
                    addresses,
                    "phone_numbers": [{
                        "number": req.body.phone
                    }],
                    "office_id": process.env.OFFICE_ID,
                    "tags": ""
                }]
            };
            console.log('------------------------------------------------------------');
            console.log('Client Data:');
            console.log(JSON.stringify(clientData));




            teClient.postJSON(process.env.API_URL + 'clients', clientData).then((json) => {



                console.log('------------------------------------------------------------');
                console.log('Data from clients:');
                console.log(JSON.stringify(json));
                var bill_address = '';
                var shipp_address = '';
                var ClientData = new Client; {

                    ClientData.fbId = req.query.uid;
                    ClientData.fullName = json.clients[0].name;
                    ClientData.client_id = json.clients[0].id;
                    ClientData.email_id = json.clients[0].email_addresses[0].id;
                    ClientData.phone_id = json.clients[0].phone_numbers[0].id;

                    if (json.clients[0].addresses.length > 1) {
                        // Si hay dos direcciones
                        // una es la billing address y la otra la shipping.
                        for (var i = 0, c = json.clients[0].addresses.length; i < c; i++) {
                            if (json.clients[0].addresses[i].label == 'Billing') {
                                ClientData.billing_address_id.push(json.clients[0].addresses[i].id);
                                bill_address = json.clients[0].addresses[i].id;
                            } else {
                                ClientData.address_id.push(json.clients[0].addresses[i].id);
                                shipp_address = json.clients[0].addresses[i].id;
                            }
                        }

                    } else {
                        // Es un boleto electrónico o la dirección es la misma.
                        //
                        ClientData.address_id.push(json.clients[0].addresses[0].id);
                        ClientData.billing_address_id.push(json.clients[0].addresses[0].id);
                        shipp_address = json.clients[0].addresses[0].id;
                        bill_address = json.clients[0].addresses[0].id;
                    }
                    ClientData.save();
                }



                var dataId = {
                    uid: req.query.uid,
                    name: json.clients[0].name,
                    client_id: json.clients[0].id,
                    email_id: json.clients[0].email_addresses[0].id,
                    phone_id: json.clients[0].phone_numbers[0].id,
                    address_id: shipp_address,
                    billaddress_id: bill_address
                };


                endOrder(dataId, res, dataId);
            }).catch((err) => {
                console.log('Error al Recuperar los eventos');
                console.log(err);
            });
        } else {

            var dataId = {
                uid: result.fbId,
                name: result.fullName,
                client_id: result.client_id,
                email_id: result.email_id,
                phone_id: result.phone_id,
                address_id: result.address_id[result.address_id.length - 1],
                billaddress_id: result.billing_address_id[result.billing_address_id.length - 1]
            };

            //
            endOrder(dataId, res, dataId);
        }

    });



    /*	UserData2.findOne({fbId: fbId}, {}, { sort: { 'sessionStart' : -1 } }, function(err, result)
    	{
    */
    //	});
}









module.exports = {
    init_pay
};