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
    var aplicationURL = "https://botboletos-test.herokuapp.com";


    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": aplicationURL + "/success",
            "cancel_url": aplicationURL + "/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever"
        }]


    }

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}