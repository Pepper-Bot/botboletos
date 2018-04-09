var request = require("request");
var sendButton = (senderId, PAGE_ACCES_TOKEN) => {
  return new Promise((resolve, reject) => {
    var requestData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Try the URL button!",
            buttons: [
              {
                type: "web_url",
                url: "https://www.messenger.com/",
                title: "URL Button",
                webview_height_ratio: "full",
                messenger_extensions: "false",
                fallback_url: "https://www.facebook.com/"
              }
            ]
          }
        }
      }
    };
    request(
      {
        url: "https://graph.facebook.com/v2.6/me/messages",
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
          console.log(" sendButton to " + senderId);
          resolve(response);
        } else {
          console.log("error !!" + error);
        }
      }
    );
  });
};

 

