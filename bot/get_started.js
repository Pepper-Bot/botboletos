 var request = require('request');

 var createPersistentMenu = () => {
   var requestData = {
     "persistent_menu": [{
       "locale": "default",
       "composer_input_disabled": false,


       "call_to_actions": [{
           "type": "postback",
           "title": "Start again",
           "payload": "Greetings",
           "webview_height_ratio": "compact"
         },
         {
           "type": "web_url",
           "title": "View Website",
           "url": "https://pepperbussines.herokuapp.com/"
         }
       ]
     }]
   }

   request({
     url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
     qs: {
       access_token: process.env.PAGE_ACCES_TOKEN,
     },
     json: true,
     body: requestData,
     method: 'POST'
   }, function (error, response, body) {
     if (!error) {
       //console.log("Respuesta  Configurar Menu  : >>> " + JSON.stringify(response))
       console.log(" createPersistentMenu => Creamos  el menu OK!");
     } else {
       console.log('error !!' + error);
     }


   });
 }



 var deleteAndCreatePersistentMenu = () => {
   var requestData = {
     "fields": [
       "persistent_menu"
     ]
   }

   request({
     url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
     qs: {
       access_token: process.env.PAGE_ACCES_TOKEN,
     },
     json: true,
     body: requestData,
     method: 'DELETE'
   }, function (error, response, body) {
     //console.log("Respuesta AL BORRAR Configurar Menu  : >>> " + JSON.stringify(response));
     if (!error) {
       console.log(" deleteAndCreatePersistentMenu => Borramos el menu OK!");
       createPersistentMenu();
     } else {
       console.log('error !!' + error);
     }

   });
 }




 var addWhitelistedDomains = () => {
   var options = {
     method: 'POST',
     url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
     qs: {
       access_token: process.env.PAGE_ACCES_TOKEN,
     },
     headers: {
       'content-type': 'application/json'
     },
     body: {
       whitelisted_domains: [
         'https://pepperbussines.herokuapp.com/',

       ]
     },
     json: true
   };

   request(options, function (error, response, body) {
     if (error) throw new Error(error);

     console.log(body);
   });

 }


 module.exports = {
   deleteAndCreatePersistentMenu
 }