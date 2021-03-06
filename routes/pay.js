var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var Client = require('../schemas/clients');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
var nodemailer = require('nodemailer');
var countries = {
    "United States": 'US',
    "Afghanistan": 'AF',
    "Albania": 'AL',
    "Algeria": 'DZ',
    "American Samoa": 'AS',
    "Andorra": 'AD',
    "Angola": 'AO',
    "Anguilla": 'AI',
    "Antarctica": 'AQ',
    "Antigua And Barbuda": 'AG',
    "Argentina": 'AR',
    "Armenia": 'AM',
    "Aruba": 'AW',
    "Australia": 'AU',
    "Austria": 'AT',
    "Azerbaijan": 'AZ',
    "Bahamas": 'BS',
    "Bahrain": 'BH',
    "Bangladesh": 'BD',
    "Barbados": 'BB',
    "Belarus": 'BY',
    "Belgium": 'BE',
    "Belize": 'BZ',
    "Benin": 'BJ',
    "Bermuda": 'BM',
    "Bhutan": 'BT',
    "Bolivia": 'BO',
    "Bosnia And Herzegovina": 'BA',
    "Botswana": 'BW',
    "Bouvet Island": 'BV',
    "Brazil": 'BR',
    "British Indian Ocean Territory": 'IO',
    "Brunei Darussalam": 'BN',
    "Bulgaria": 'BG',
    "Burkina Faso": 'BF',
    "Burundi": 'BI',
    "Cambodia": 'KH',
    "Cameroon": 'CM',
    "Canada": 'CA',
    "Cape Verde": 'CV',
    "Cayman Islands": 'KY',
    "Central African Republic": 'CF',
    "Chad": 'TD',
    "Chile": 'CL',
    "China": 'CN',
    "Christmas Island": 'CX',
    "Cocos (Keeling) Islands": 'CC',
    "Colombia": 'CO',
    "Comoros": 'KM',
    "Congo": 'CG',
    "The Democratic Republic Of The Congo": 'CD',
    "Cook Islands": 'CK',
    "Costa Rica": 'CR',
    "Cote D Ivoire": 'CI',
    "Croatia": 'HR',
    "Cuba": 'CU',
    "Cyprus": 'CY',
    "Czech Republic": 'CZ',
    "Denmark": 'DK',
    "Djibouti": 'DJ',
    "Dominica": 'DM',
    "Dominican Republic": 'DO',
    "East Timor": 'TP',
    "Ecuador": 'EC',
    "Egypt": 'EG',
    "El Salvador": 'SV',
    "Equatorial Guinea": 'GQ',
    "Eritrea": 'ER',
    "Estonia": 'EE',
    "Ethiopia": 'ET',
    "Falkland Islands (Malvinas)": 'FK',
    "Faroe Islands": 'FO',
    "Fiji": 'FJ',
    "Finland": 'FI',
    "France": 'FR',
    "French Guiana": 'GF',
    "French Polynesia": 'PF',
    "French Southern Territories": 'TF',
    "Gabon": 'GA',
    "Gambia": 'GM',
    "Georgia": 'GE',
    "Germany": 'DE',
    "Ghana": 'GH',
    "Gibraltar": 'GI',
    "Greece": 'GR',
    "Greenland": 'GL',
    "Grenada": 'GD',
    "Guadeloupe": 'GP',
    "Guam": 'GU',
    "Guatemala": 'GT',
    "Guinea": 'GN',
    "Guinea-Bissau": 'GW',
    "Guyana": 'GY',
    "Haiti": 'HT',
    "Heard Island And Mcdonald Islands": 'HM',
    "Holy See (Vatican City State)": 'VA',
    "Honduras": 'HN',
    "Hong Kong": 'HK',
    "Hungary": 'HU',
    "Iceland": 'IS',
    "India": 'IN',
    "Indonesia": 'ID',
    "Islamic Republic Of Iran": 'IR',
    "Iraq": 'IQ',
    "Ireland": 'IE',
    "Israel": 'IL',
    "Italy": 'IT',
    "Jamaica": 'JM',
    "Japan": 'JP',
    "Jordan": 'JO',
    "Kazakstan": 'KZ',
    "Kenya": 'KE',
    "Kiribati": 'KI',
    "Democratic Peoples Republic Of Korea": 'KP',
    "Korean Republic": 'KR',
    "Kuwait": 'KW',
    "Kyrgyzstan": 'KG',
    "Lao Peoples Democratic Republic": 'LA',
    "Latvia": 'LV',
    "Lebanon": 'LB',
    "Lesotho": 'LS',
    "Liberia": 'LR',
    "Libyan Arab Jamahiriya": 'LY',
    "Liechtenstein": 'LI',
    "Lithuania": 'LT',
    "Luxembourg": 'LU',
    "Macau": 'MO',
    "The Former Yugoslav Republic Of Macedonia": 'MK',
    "Madagascar": 'MG',
    "Malawi": 'MW',
    "Malaysia": 'MY',
    "Maldives": 'MV',
    "Mali": 'ML',
    "Malta": 'MT',
    "Marshall Islands": 'MH',
    "Martinique": 'MQ',
    "Mauritania": 'MR',
    "Mauritius": 'MU',
    "Mayotte": 'YT',
    "Mexico": 'MX',
    "Federated States Of Micronesia": 'FM',
    "Republic of Moldova": 'MD',
    "Monaco": 'MC',
    "Mongolia": 'MN',
    "Montserrat": 'MS',
    "Morocco": 'MA',
    "Mozambique": 'MZ',
    "Myanmar": 'MM',
    "Namibia": 'NA',
    "Nauru": 'NR',
    "Nepal": 'NP',
    "Netherlands": 'NL',
    "Netherlands Antilles": 'AN',
    "New Caledonia": 'NC',
    "New Zealand": 'NZ',
    "Nicaragua": 'NI',
    "Niger": 'NE',
    "Nigeria": 'NG',
    "Niue": 'NU',
    "Norfolk Island": 'NF',
    "Northern Mariana Islands": 'MP',
    "Norway": 'NO',
    "Oman": 'OM',
    "Pakistan": 'PK',
    "Palau": 'PW',
    "Palestinian Territory": 'PS',
    "Panama": 'PA',
    "Papua New Guinea": 'PG',
    "Paraguay": 'PY',
    "Peru": 'PE',
    "Philippines": 'PH',
    "Pitcairn": 'PN',
    "Poland": 'PL',
    "Portugal": 'PT',
    "Puerto Rico": 'PR',
    "Qatar": 'QA',
    "Reunion": 'RE',
    "Romania": 'RO',
    "Russian Federation": 'RU',
    "Rwanda": 'RW',
    "Saint Helena": 'SH',
    "Saint Kitts And Nevis": 'KN',
    "Saint Lucia": 'LC',
    "Saint Pierre And Miquelon": 'PM',
    "Saint Vincent And The Grenadines": 'VC',
    "Samoa": 'WS',
    "San Marino": 'SM',
    "Sao Tome And Principe": 'ST',
    "Saudi Arabia": 'SA',
    "Senegal": 'SN',
    "Seychelles": 'SC',
    "Sierra Leone": 'SL',
    "Singapore": 'SG',
    "Slovakia": 'SK',
    "Slovenia": 'SI',
    "Solomon Islands": 'SB',
    "Somalia": 'SO',
    "South Africa": 'ZA',
    "South Georgia And The South Sandwich Islands": 'GS',
    "Spain": 'ES',
    "Sri Lanka": 'LK',
    "Sudan": 'SD',
    "Suriname": 'SR',
    "Svalbard And Jan Mayen": 'SJ',
    "Swaziland": 'SZ',
    "Sweden": 'SE',
    "Switzerland": 'CH',
    "Syrian Arab Republic": 'SY',
    "Province Of China Taiwan": 'TW',
    "Tajikistan": 'TJ',
    "United Republic Of Tanzania": 'TZ',
    "Thailand": 'TH',
    "Togo": 'TG',
    "Tokelau": 'TK',
    "Tonga": 'TO',
    "Trinidad And Tobago": 'TT',
    "Tunisia": 'TN',
    "Turkey": 'TR',
    "Turkmenistan": 'TM',
    "Turks And Caicos Islands": 'TC',
    "Tuvalu": 'TV',
    "Uganda": 'UG',
    "Ukraine": 'UA',
    "United Arab Emirates": 'AE',
    "United Kingdom": 'GB',
    "United States Minor Outlying Islands": 'UM',
    "Uruguay": 'UY',
    "Uzbekistan": 'UZ',
    "Vanuatu": 'VU',
    "Venezuela": 'VE',
    "Viet Nam": 'VN',
    "Virgin Islands, British": 'VG',
    "Virgin Islands, U.S.": 'VI',
    "Wallis And Futuna": 'WF',
    "Western Sahara": 'EH',
    "Yemen": 'YE',
    "Yugoslavia": 'YU',
    "Zambia": 'ZM',
    "Zimbabwe": 'ZW'
};
/* GET home page. */


var tevo = require('../config/config_vars').tevo;


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});




router.post('/', function (req, res) {


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

        var createCreditoCard = tevo.API_URL + 'offices/' + process.env.OFFICE_ID + '/credit_cards';


        tevoClient.postJSON(createCreditoCard, cc).then((json) => {
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

                //var createShipping = process.env.API_URL + 'shipments/suggestion';
                var createShipping = tevo.API_URL + 'shipments/suggestion';


                tevoClient.postJSON(createShipping, dataShip).then((json) => {
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



            var createClient = tevo.API_URL + 'clients'




            tevoClient.postJSON(createClient, clientData).then((json) => {



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
});



module.exports = router;