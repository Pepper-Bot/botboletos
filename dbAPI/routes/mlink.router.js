'use strict'

var express = require('express');

var MLinkController = require("../controllers/mlink.controller");


var api = express.Router();
api.get("/saludar/:nombre?", MLinkController.saludar);
api.get("/mlink/:id?", MLinkController.getMlink);
api.get("/mlinks", MLinkController.getMlinks);
api.post("/mlink", MLinkController.createMlink);
api.put("/mlink/:id", MLinkController.updateMlink);
api.delete("/mlink/:id", MLinkController.deleteMlink);


module.exports = api;


