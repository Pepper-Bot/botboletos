var express = require('express');
var router = express.Router();
var Message = require('../../bot/messages');
var UserData2 = require('../../schemas/userinfo');
var graph = require('fbgraph');



var welcome = (req, res) => {
    res.send('Im pepper Bot!!');
    res.end();
}


 






module.exports = {
    welcome
};