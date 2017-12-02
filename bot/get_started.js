 var request = require('request');

 var createPersistentMenu = () => {
   var requestData = {
     "persistent_menu": [{
         "locale": "default",
         "composer_input_disabled": false,
         "call_to_actions": [{
             "title": "Info",
             "type": "nested",
             "call_to_actions": [{
                 "title": "Help",
                 "type": "postback",
                 "payload": "HELP_PAYLOAD"
               },
               {
                 "title": "Contact Me",
                 "type": "postback",
                 "payload": "CONTACT_INFO_PAYLOAD"
               }
             ]
           },
           {
             "type": "web_url",
             "title": "Visit website ",
             "url": "http://www.techiediaries.com",
             "webview_height_ratio": "full"
           }
         ]
       },
       {
         "locale": "zh_CN",
         "composer_input_disabled": false
       }
     ]
   }

   request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + process.env.PAGE_ACCESS_TOKEN,
     qs: {

     },
     json: true,
     body: requestData,
     method: 'POST'
   }, function (error, response, body) {
     console.log("Respuesta  Configurar Menu  : >>> " + JSON.stringify(response));

   });
 }



 var deletePersistentMenu = () => {
   var requestData = {
     "fields": [
       "persistent_menu"
     ]
   }

   request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings',
     qs: {
       access_token: process.env.PAGE_ACCESS_TOKEN,
     },
     json: true,
     body: requestData,
     method: 'DELETE'
   }, function (error, response, body) {
     console.log("Respuesta AL BORRAR Configurar Menu  : >>> " + JSON.stringify(response));
     if (!error) {
       createPersistentMenu();
     }

   });
 }

 module.exports = {
   deletePersistentMenu
 }