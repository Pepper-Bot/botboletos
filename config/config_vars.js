var APLICATION_URL_DOMAIN = proccess.env.APLICATION_URL_DOMAIN

/////////////////////tevo/////////////////////////////
var sandbox = true;

if (sandbox === true) {
  var API_SECRET_KEY = proccess.env.SANDBOX_API_SECRET_KEY
  var API_TOKEN = proccess.env.SANDBOX_API_TOKEN
  var API_URL = proccess.env.SANDBOX_API_URL
  var OFFICE_ID = proccess.env.SANDBOX_OFFICE_ID


  /////////////////////PP/////////////////////////////
  var P_CLIENT_ID = proccess.env.SANDBOX_P_CLIENT_ID
  var P_CLIENT_SECRET = proccess.env.SANDBOX_P_CLIENT_SECRET

} else {
  var API_SECRET_KEY = proccess.env.API_SECRET_KEY
  var API_TOKEN = proccess.env.API_TOKEN
  var API_URL = proccess.env.API_URL
  var OFFICE_ID = proccess.env.OFFICE_ID

  /////////////////////PP/////////////////////////////
  var P_CLIENT_ID = proccess.env.P_CLIENT_ID
  var P_CLIENT_SECRET = proccess.env.P_CLIENT_SECRET
}


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
  apiToken: API_TOKEN,
  apiSecretKey: API_SECRET_KEY
});







////////////////////REDIS////////////////////////////////

var REDIS_URL = proccess.env.REDIS_URL


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