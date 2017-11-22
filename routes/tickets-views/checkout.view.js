function checkout(req, res) {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');
    var moment = require('moment');
    var params = req.body;




    var event_id = params.event_id;
    var fbId = params.uid;
    var venue_id = params.venue_id;
    var event_name = params.event_name;
    var performer_id = params.performer_id;
    var event_date = params.event_date;
    var section = params.section;
    var row = params.row;
    var quantity = params.userticketsquantity;
    var price = params.priceticket;
    var format = params.format;
    var eticket = params.eticket;
    var groupticket_id = params.groupticket_id;

    var total = params.userticketsquantity * params.priceticket;
    var totals = "$" + total

    var noeticket = false;
    if (params.format != 'Eticket') {
        noeticket = true;
    }


    if (undefined == params.uid) {
        res.status(200);
        res.send('Error trying to access');
        res.end();
        return;
    }

    UserData2.findOne({
        fbId: fbId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        if (result) {


            res.render(
                './layouts/tickets/3_checkout', {
                    titulo: "Your tickets are on its way!",
                    event_id: params.event_id,
                    fbId: params.uid,
                    venue_id: params.venue_id,
                    event_name: params.event_name,
                    performer_id: params.performer_id,
                    event_date: moment(event_date).format('MMMM Do YYYY, h:mm:ss a'),
                    section: params.section,
                    row: params.row,
                    quantity: params.userticketsquantity,
                    price: params.priceticket,
                    total: totals,
                    format: params.format,
                    noeticket: noeticket,
                    eticket: params.eticket,
                    groupticket_id: params.groupticket_id,
                    firstName: result.firstName,
                    LastName: result.LastName,


                }
            );


        }
    });

}



const express = require('express');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYhqNuhxTFNV2H8IuWaG2mDc0-L_vvF5VxuqiRBs5w3U9cUHgxMsxlz__rqPY4CZhdVROflSLaOUbUca',
    'client_secret': 'EAJnONFiF0RsiCZRopKP2zdfT-vSwAxTO2tfg6Uk149zA8mCifoRMz0eMEeXhcpfRKZa5R-esCLhsvHZ'
});


function paypal_pay(req, res) {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../../bot/userinfo');
    var UserData2 = require('../../schemas/userinfo');
    var moment = require('moment');
    var params = req.body;



    var event_name = params.event_name;
    var quantity = params.quantity;
    var price = params.price;


    console.log("event_name" + event_name)
    console.log("quantity" + quantity)
    console.log("price" + price)


    var aplicationURL = "https://botboletos-test.herokuapp.com";


    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": aplicationURL + "/paypal_success",
            "cancel_url": aplicationURL + "/paypal_cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": event_name,
                    "sku": "001",
                    "price": price,
                    "currency": "USD",
                    "quantity": quantity
                }]
            },
            "amount": {
                "currency": "USD",
                "total": price
            },
            "description": event_name
        }]


    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log("error " + error)
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    console.log("payment.links[i].href <<  " + payment.links[i].href)
                    res.redirect(payment.links[i].href);

                }
            }
        }
    });
}



function paypal_success(req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });
}

function paypal_cancel(req, res) {
    res.send('Cancelled')
}



module.exports = {
    checkout,
    paypal_success,
    paypal_cancel,
    paypal_pay
}