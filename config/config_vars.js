var APLICATION_URL_DOMAIN = process.env.APLICATION_URL_DOMAIN

/////////////////////tevo/////////////////////////////
var sandbox = true;

if (sandbox === true) {
  var API_SECRET_KEY = process.env.SANDBOX_API_SECRET_KEY
  var API_TOKEN = process.env.SANDBOX_API_TOKEN
  var API_URL = process.env.SANDBOX_API_URL
  var OFFICE_ID = process.env.SANDBOX_OFFICE_ID


  /////////////////////PP/////////////////////////////
  var P_CLIENT_ID = process.env.SANDBOX_P_CLIENT_ID
  var P_CLIENT_SECRET = process.env.SANDBOX_P_CLIENT_SECRET

} else {
  var API_SECRET_KEY = process.env.API_SECRET_KEY
  var API_TOKEN = process.env.API_TOKEN
  var API_URL = process.env.API_URL
  var OFFICE_ID = process.env.OFFICE_ID

  /////////////////////PP/////////////////////////////
  var P_CLIENT_ID = process.env.P_CLIENT_ID
  var P_CLIENT_SECRET = process.env.P_CLIENT_SECRET
}


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
  apiToken: API_TOKEN,
  apiSecretKey: API_SECRET_KEY
});







////////////////////REDIS////////////////////////////////

var REDIS_URL = process.env.REDIS_URL


module.exports = {
  APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
  API_SECRET_KEY: API_SECRET_KEY, //
  API_TOKEN: API_TOKEN,
  API_URL: API_TOKEN,
  OFFICE_ID: OFFICE_ID,
  P_CLIENT_ID: P_CLIENT_ID,
  P_CLIENT_SECRET: P_CLIENT_SECRET,
  REDIS_URL: REDIS_URL,
  tevoClient: tevoClient


};