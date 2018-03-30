const FBMESSAGESPAGE = "https://graph.facebook.com/v2.6/me/messages";
const PAGE_ACCESS_TOKEN = require("../config/config_vars").PAGE_ACCESS_TOKEN;
const dashbot = require("dashbot");

var request = require("request");


var callSendAPI = messageData => {
  return new Promise((resolve, reject) => {
    let requestData = {
      uri: FBMESSAGESPAGE,
      qs: {
        access_token: PAGE_ACCESS_TOKEN
      },
      method: "POST",
      json: messageData
    };

    request(requestData, (error, response, data) => {
      dashbot.logOutgoing(requestData, response.body);
      if (error) {
        reject(error);
        console.log("No es posible enviar el mensaje");
      } else {
        resolve(response);

        console.log("Mensaje enviado");
      }
    });
  });
};

module.exports = {
  callSendAPI
};
