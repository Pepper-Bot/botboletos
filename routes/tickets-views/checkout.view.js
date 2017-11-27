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

    if (req.session) {
        req.session.event_id = event_id;
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
        req.session.total = (parseFloat(price * quantity).toFixed(2));
        console.log("Yes !!!")
    } else {
        console.log("Verdes !!!")
    }

 
    var total =  (parseFloat(params.userticketsquantity * params.priceticket).toFixed(2));
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
    'client_id': process.env.P_CLIENT_ID,
    'client_secret': process.env.P_CLIENT_SECRET
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


    console.log(" req.session.fbId >" + req.session.fbId)
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
                "total": (parseFloat(price * quantity).toFixed(2))
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
                "total": req.session.total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));

            //res.send('Success');
            var finishModule = require('./finish.view');
            finishModule.finish(req, res, payment);

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