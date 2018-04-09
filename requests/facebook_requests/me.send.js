const FBMESSAGESPAGE = "https://graph.facebook.com/v2.6/me/messages";
const PAGE_ACCESS_TOKEN =
  "EAASJN3kpCzkBAA7KGHeSOpjEGtgmac84jMjLFU1PKYCgaC1oVUptbwKg1JOyytZAerOpBgNiTcnBxBzTVDeX2Py4Kdb7DJz67ZCiKPeHUZA9hCp6jtVnQi319i404nUxOn41Stm21SZAl6lZAl6IZB7VJDRPDCGQW3VqWxmhzbJQZDZD";
const configVars = require("../../config/config_vars");
const DASHBOT_API_KEY = configVars.DASHBOT_API_KEY;
const dashbot = require("dashbot")(DASHBOT_API_KEY).facebook; //new

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
