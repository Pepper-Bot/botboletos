/////////////////////tevo/////////////////////////////
var APLICATION_URL_DOMAIN = process.env.APLICATION_URL_DOMAIN
var PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
var FBMESSAGESPAGE = 'https://graph.facebook.com/v2.6/me/messages'
var mlink = {
  shark: 'https://www.messenger.com/t/pepperSharks?ref=',
  pepper: 'https://www.messenger.com/t/mypepperbot?ref='

}


/////////////////////tevo//////////////////////////// 
var API_SECRET_KEY = process.env.SANDBOX_API_SECRET_KEY
var API_TOKEN = process.env.SANDBOX_API_TOKEN
var API_URL = process.env.SANDBOX_API_URL
var OFFICE_ID = process.env.SANDBOX_OFFICE_ID
/////////////////////PP////////////////////////////
var P_CLIENT_ID = process.env.SANDBOX_P_CLIENT_ID
var P_CLIENT_SECRET = process.env.SANDBOX_P_CLIENT_SECRET
/////////////////////PP//////////////////////////// 



/*
/////////////////////tevo/////////////////////////////
var API_SECRET_KEY = process.env.API_SECRET_KEY
var API_TOKEN = process.env.API_TOKEN
var API_URL = process.env.API_URL
var OFFICE_ID = process.env.OFFICE_ID
/////////////////////PP/////////////////////////////
var P_CLIENT_ID = process.env.P_CLIENT_ID
var P_CLIENT_SECRET = process.env.P_CLIENT_SECRET
*/



var tevo = {
  API_TOKEN,
  API_SECRET_KEY,
  API_URL,
  OFFICE_ID,
}









////////////////////REDIS////////////////////////////////

var REDIS_URL = process.env.REDIS_URL


module.exports = {
  APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
  API_SECRET_KEY: API_SECRET_KEY,
  API_TOKEN: API_TOKEN,
  API_URL: API_URL,
  OFFICE_ID: OFFICE_ID,
  P_CLIENT_ID: P_CLIENT_ID,
  P_CLIENT_SECRET: P_CLIENT_SECRET,
  REDIS_URL: REDIS_URL,
  tevo: tevo,
  PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
  FBMESSAGESPAGE,
  mlink
};