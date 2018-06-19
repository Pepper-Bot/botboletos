var express = require('express');
var router = express.Router();
var UserData = require('../../bot/userinfo');
var UserData2 = require('../../schemas/userinfo');
var P_CLIENT_ID = require('../../config/config_vars').P_CLIENT_ID;
var P_CLIENT_SECRET = require('../../config/config_vars').P_CLIENT_SECRET;
var P_MODE = require('../../config/config_vars').P_MODE;
var APLICATION_URL_DOMAIN = require('../../config/config_vars').APLICATION_URL_DOMAIN;


const dashbot = require("dashbot")("CJl7GFGWbmStQyF8dYjR6WxIBPwrcjaIWq057IOO").facebook; //new
var moment = require('moment');

var tevo = require('../../config/config_vars').tevo;

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
    apiToken: tevo.API_TOKEN,
    apiSecretKey: tevo.API_SECRET_KEY
});


var checkout = (req, res) => {
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


    var total = (parseFloat(params.userticketsquantity * params.priceticket).toFixed(2));




    var noeticket = false;
    if (params.format != 'Eticket') {
        noeticket = true;
    }



    UserData2.findOne({
        fbId: fbId
    }, {}, {
        sort: {
            'sessionStart': -1
        }
    }, function (err, result) {

        var firstName = ""
        var LastName = ""
        if (result) {
            firstName = result.firstName;
            LastName = result.LastName;
        }

        var searchTicketGroupByEventId = tevo.API_URL + 'ticket_groups?event_id=' + event_id + '&lightweight=true&show_past=false'
        tevoClient.getJSON(searchTicketGroupByEventId).then((ticketG) => {
            req.session.format_type = ticketG.format


            let dashBotEvent = {
                type: 'customEvent',
                name: 'view check out details',
                userId: fbId,
                extraInfo: {
                    eventId: event_id,
                    groupticket_id: params.groupticket_id,
                    event_date: moment(event_date).format('MMMM Do YYYY, h:mm a'),
                }
            }

            dashbot.logEvent(dashBotEvent);

            res.render(
                './layouts/tickets/checkout', {
                    titulo: "Your tickets are on its way!",
                    APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
                    event_id: params.event_id,
                    fbId: params.uid,
                    form_buy: true,
                    venue_id: params.venue_id,
                    event_name: params.event_name,
                    performer_id: params.performer_id,
                    event_date: moment(event_date).format('MMMM Do YYYY, h:mm a'),
                    section: params.section,
                    row: params.row,
                    quantity: params.userticketsquantity,
                    price: params.priceticket,
                    wholesale_price: params.wholesale_price,
                    total: total,
                    format: params.format,
                    noeticket: noeticket,
                    eticket: params.eticket,
                    groupticket_id: params.groupticket_id,
                    firstName: firstName,
                    LastName: LastName,
                    subtitulo: "Checkout"

                }
            );


        });


    });

}




const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': P_MODE, //sandbox or live
    'client_id': P_CLIENT_ID,
    'client_secret': P_CLIENT_SECRET
});


function paypal_pay(req, res) {

    var searchTicketGroupbyId = tevo.API_URL + 'ticket_groups/' + req.session.groupticket_id + "?ticket_list=true"

    console.log("searchTicketGroupbyId " + searchTicketGroupbyId);

    tevoClient.getJSON(searchTicketGroupbyId).then((ticketGroupRes) => {

        if (ticketGroupRes.error) {
            console.log("json.error" + ticketGroupRes.error);
        }
        //console.log("ticketGroupRes >>" + JSON.stringify(ticketGroupRes));

        if (ticketGroupRes.available_quantity >= req.session.quantity) {

            var express = require('express');
            var router = express.Router();
            var UserData = require('../../bot/userinfo');
            var UserData2 = require('../../schemas/userinfo');
            var moment = require('moment');
            var params = req.body;



            var event_name = req.session.event_name;
            var quantity = req.session.quantity;
            var price = req.session.price;
            var items = [];
            var ship_price = 0;
            items.push({
                "name": event_name,
                "sku": "001",
                "price": price,
                "currency": "USD",
                "quantity": quantity
            })

            if (req.session.ship_price) {
                if (req.session.ship_price > 0) {
                    ship_price = req.session.ship_price

                    items.push({
                        "name": req.session.shiping_name,
                        "sku": "001",
                        "price": req.session.ship_price,
                        "currency": "USD",
                        "quantity": 1
                    })
                }
            }


            console.log(" req.session.fbId >" + req.session.fbId)
            console.log("quantity" + quantity)
            console.log("price" + price)



            if (req.session.promo_code && req.session.promo_code != "") {
                console.log(`req.session.promo_code ${req.session.promo_code}`)
                checkout_promo_calculate(req.session.promo_code, req.session.groupticket_id, quantity).then((calculated) => {
                    if (calculated.discount && calculated.discount > 0) {

                        items.push({
                            "name": "Discount",
                            "sku": "001",
                            "price": calculated.discount * -1,
                            "currency": "USD",
                            "quantity": 1
                        })

                        let total = (parseFloat(price * quantity + ship_price - calculated.discount).toFixed(2))

                        req.session.total = total
                        req.session.discount = calculated.discount

                        console.log(`pay-pal-items-con-discount  ${JSON.stringify(items)}`)
                        paypal_orden(req, res, items, total, event_name)



                    } else {
                        console.log(`pay-pal-items-discount-menor-zero ${JSON.stringify(items)}`)
                        let total = (parseFloat(price * quantity + ship_price).toFixed(2))
                        req.session.total = total
                        paypal_orden(req, res, items, total, event_name)
                    }

                })

            } else {
                console.log(`pay-pal-items-sin-discount ${JSON.stringify(items)}`)
                let total = (parseFloat(price * quantity + ship_price).toFixed(2))
                req.session.total = total
                paypal_orden(req, res, items, total, event_name)

            }








        } else {

            res.status(200);
            res.send('Tickets are no longer available. Please select tickets again ');
            res.end();
            return;

        }
    });

}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} items 
 * @param {*} total 
 * @param {*} event_name 
 * 
 * 
 */
function paypal_orden(req, res, items, total, event_name) {

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": APLICATION_URL_DOMAIN + "paypal_success",
            "cancel_url": APLICATION_URL_DOMAIN + "paypal_cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "currency": "USD",
                "total": total
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






/**
 * 
 * @param {*} promo_code 
 * @param {*} ticket_group_id 
 * @param {*} quantity 
 * @description función usada para calcular el descuento
 * 
 */
var checkout_promo_calculate = (promo_code, ticket_group_id, quantity) => {
    return new Promise((resolve, reject) => {
        let searchPromoCode = `${tevo.API_URL}promotion_codes?code=${promo_code}`
        console.log(`${JSON.stringify(searchPromoCode)}`)
        tevoClient.getJSON(searchPromoCode).then((promoCodeResponse) => {
            if (promoCodeResponse.total_entries > 0) {
                if (promoCodeResponse.promotion_codes[0].active === true && promoCodeResponse.promotion_codes[0].value > 0) {
                    let code = promoCodeResponse.promotion_codes[0].code
                    let discountValue = promoCodeResponse.promotion_codes[0].value
                    let isPercentage = promoCodeResponse.promotion_codes[0].percentage
                    console.log(`isPercentage- ${JSON.stringify(isPercentage)}`)

                    let searchTicketGroup = `${tevo.API_URL}ticket_groups/${ticket_group_id}?ticket_list=true`


                    tevoClient.getJSON(searchTicketGroup).then((ticketGroupRes) => {

                        console.log(`ticketGroupRes- ${JSON.stringify(ticketGroupRes)}`)


                        let retail_price = ticketGroupRes.retail_price

                        let amount = retail_price * quantity
                        let discount = 0

                        if (isPercentage === true) {
                            discount = parseFloat(amount * discountValue / 100).toFixed(2)
                        } else {
                            discount = discountValue
                        }

                        let total = parseFloat(amount - discount).toFixed(2)

                        let response = {
                            code,
                            retail_price,
                            quantity,
                            amount,
                            discount,
                            total
                        }
                        resolve(response)


                    }).catch((error) => {
                        console.log(`error-searchTicketGroup ${error}`)
                        reject({
                            error: `error-searchTicketGroup ${error}`
                        })
                    })
                } else {
                    resolve({})
                }
            } else {
                resolve({})
            }

        }).catch((error) => {
            console.log(`error-searchPromoCode ${error}`)
            reject({
                error: `error-searchPromoCode ${error}`
            })
        })
    })
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
            res.send(error.response)
        } else {
            console.log(JSON.stringify(payment));

            //res.send('Success');
            var finishModule = require('./finish.controller');
            finishModule.finish(req, res, payment);

        }
    });
}

function paypal_cancel(req, res) {
    res.send('Cancelled')
}

/**
 * 
 * =======================================================
 * @description ruta para consultar el codigo de promoción 
 * https://botboletos-test.herokuapp.com/checkout/promo 
 * =======================================================
 * 
 */
function promo(req, res) {
    let promo_code = req.body.promo_code
    let ticket_group_id = req.body.ticket_group_id
    let quantity = req.body.quantity


    if (!promo_code || !ticket_group_id || !quantity) {
        res.status(500).json({
            message: `incomplete vars`
        })
        return
    }

    checkout_promo_calculate(promo_code, ticket_group_id, quantity).then((response) => {
        res.status(200).json(
            response
        )
    }).catch(error => {
        res.status(500).json(
            error
        )
    })




    /*let searchPromoCode = `${tevo.API_URL}promotion_codes?code=${promo_code}`

    console.log(`${JSON.stringify(searchPromoCode)}`)


    tevoClient.getJSON(searchPromoCode).then((promoCodeResponse) => {
        if (promoCodeResponse.total_entries > 0) {

            if (promoCodeResponse.promotion_codes[0].active === true && promoCodeResponse.promotion_codes[0].value > 0) {
                let code = promoCodeResponse.promotion_codes[0].code
                let discountValue = promoCodeResponse.promotion_codes[0].value
                let isPercentage = promoCodeResponse.promotion_codes[0].percentage
                console.log(`isPercentage- ${JSON.stringify(isPercentage)}`)


                let searchTicketGroup = `${tevo.API_URL}ticket_groups/${ticket_group_id}?ticket_list=true`


                tevoClient.getJSON(searchTicketGroup).then((ticketGroupRes) => {

                    console.log(`ticketGroupRes- ${JSON.stringify(ticketGroupRes)}`)


                    let retail_price = ticketGroupRes.retail_price

                    let amount = retail_price * quantity
                    let discount = 0

                    if (isPercentage === true) {
                        discount = amount * discountValue / 100
                    } else {
                        discount = discountValue
                    }

                    let total = amount - discount

                    let response = {
                        code,
                        retail_price,
                        quantity,
                        amount,
                        discount,
                        total
                    }

                    res.status(200).json(
                        response
                    )

                }).catch((error) => {
                    console.log(`error-searchTicketGroup ${error}`)
                    res.status(500).json({
                        error
                    })
                })

            } else {
                res.status(500).json({
                    message: 'bad-code-inactive-zero'
                })
            }
        } else {
            res.status(500).json({
                message: 'bad-code'
            })
        }

    }).catch((error) => {
        console.log(`error-searchPromoCode ${error}`)
        res.status(500).json({
            error
        })
    })*/

}






module.exports = {
    checkout,
    paypal_success,
    paypal_cancel,
    paypal_pay,
    promo,

}