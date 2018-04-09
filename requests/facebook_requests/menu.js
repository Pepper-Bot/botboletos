var request = require("request");





var createPersistentMenu2 = PAGE_ACCES_TOKEN => {
  return new Promise((resolve, reject) => {
    var requestData = {
      persistent_menu: [
        {
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: "postback",
              title: "Start again",
              payload: "Greetings_2",
              //messenger_extensions: true,
              webview_height_ratio: "tall"
            }

          ]
        }
      ]
    };

    request(
      {
        url: "https://graph.facebook.com/v2.6/me/messenger_profile",
        qs: {
          access_token: PAGE_ACCES_TOKEN
        },
        json: true,
        body: requestData,
        method: "POST"
      },
      function(error, response, body) {
        if (!error) {
          //console.log("Respuesta  Configurar Menu  : >>> " + JSON.stringify(response))
          console.log(" createPersistentMenu => Creamos  el menu OK!");
          resolve(response);
        } else {
          console.log("error !!" + error);
        }
      }
    );
  });
};


var createPersistentMenu = PAGE_ACCES_TOKEN => {
  return new Promise((resolve, reject) => {
    var requestData = {
      persistent_menu: [
        {
          locale: "default",
          composer_input_disabled: false,
          call_to_actions: [
            {
              type: "postback",
              title: "Start again",
              payload: "Greetings_2",
              //messenger_extensions: true,
              webview_height_ratio: "tall"
            },
            {
              type: "postback",
              title: "My Account",
              payload: "ACCOUNT",
               //messenger_extensions: true,
              webview_height_ratio: "tall"
            } 

          ]
        }
      ]
    };

    request(
      {
        url: "https://graph.facebook.com/v2.6/me/messenger_profile",
        qs: {
          access_token: PAGE_ACCES_TOKEN
        },
        json: true,
        body: requestData,
        method: "POST"
      },
      function(error, response, body) {
        if (!error) {
          //console.log("Respuesta  Configurar Menu  : >>> " + JSON.stringify(response))
          console.log(" createPersistentMenu => Creamos  el menu OK!");
          resolve(response);
        } else {
          console.log("error !!" + error);
        }
      }
    );
  });
};

var deleteAndCreatePersistentMenu = PAGE_ACCES_TOKEN => {
  return new Promise((resolve, reject) => {
    var requestData = {
      fields: ["persistent_menu"]
    };

    request(
      {
        url: "https://graph.facebook.com/v2.6/me/messenger_profile",
        qs: {
          access_token: PAGE_ACCES_TOKEN
        },
        json: true,
        body: requestData,
        method: "DELETE"
      },
      function(error, response, body) {
        //console.log("Respuesta AL BORRAR Configurar Menu  : >>> " + JSON.stringify(response));
        if (!error) {
          console.log(" deleteAndCreatePersistentMenu => Borramos el menu OK!");
          resolve(response);
        } else {
          console.log("error !!" + error);
        }
      }
    );
  });
};

var addWhitelistedDomains = PAGE_ACCES_TOKEN => {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: "https://graph.facebook.com/v2.6/me/messenger_profile",
      qs: {
        access_token: PAGE_ACCES_TOKEN
      },
      headers: {
        "content-type": "application/json"
      },
      body: {
        whitelisted_domains: [
          "https://pepperbussines.herokuapp.com/",
          "https://pepper-bussines.herokuapp.com/",
          "https://botboletos-test.herokuapp.com/",
          "https://ticketdelivery.herokuapp.com/",
          "http://localhost:8888/"
        ]
      },
      json: true
    };

    request(options, function(error, response, body) {
    
      if (error) {
        throw new Error(error);
      } else {
        console.log( 'addWhitelistedDomains '+ JSON.stringify(response))
        resolve(response);
      }
    });
  });
};

module.exports = {

  createPersistentMenu,
  createPersistentMenu2,
  deleteAndCreatePersistentMenu,
  addWhitelistedDomains
};

