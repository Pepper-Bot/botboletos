var gis = require("../../util/gis");
var google_images = require("../../util/google.images");
var artistQueries = require("../../db/queries/artist.queries");

var tevo = require("../../config/config_vars").tevo; 

var TevoClient = require("ticketevolution-node");


var tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});



module.exports = {
    tevoClient,
    tevo,
    artistQueries,
    gis

}