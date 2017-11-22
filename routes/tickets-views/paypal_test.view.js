var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
/* GET home page. */

var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var teClient = new TevoClient({
    apiToken: '9853014b1eff3bbf8cb205f60ab1b177',
    apiSecretKey: 'UjFcR/nPkgiFchBYjLOMTAeDRCliwyhU8mlaQni2'
});


router.get('/', function (req, res) {
    res.render(
        './layouts/tickets/paypal_test', {
            titulo: "Prueba de paypal!",
        }
    );

});


module.exports = router;