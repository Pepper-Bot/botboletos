function checkout(req, res) {
    var express = require('express');
    var router = express.Router();
    var UserData = require('../bot/userinfo');
    var UserData2 = require('../schemas/userinfo');
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

            res.send("Hola !!");



        }
    });

}

module.exports = {
    checkout
}