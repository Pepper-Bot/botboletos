const FBMESSAGESPAGE = "https://graph.facebook.com/v2.6/me/messages";
const PAGE_ACCESS_TOKEN = require("../config/config_vars").PAGE_ACCESS_TOKEN;
const dashbot = require("dashbot")("CJl7GFGWbmStQyF8dYjR6WxIBPwrcjaIWq057IOO")
  .facebook; //new

var request = require("request");

var callSendAPI = (messageData, action) => {
  // messageData.tag =  "NON_PROMOTIONAL_SUBSCRIPTION"
  //messageData.tag =  "FEATURE_FUNCTIONALITY_UPDATE"
  messageData.tag = "ISSUE_RESOLUTION";
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
      let senderId = "-";
      console.log(`fb-response  ${JSON.stringify(response.statusCode)}`);
      if (response.statusCode == 400) {
        if (response.body && response.body.error) {
          console.log(
            `fb-response response.body.error ${JSON.stringify(
              response.body.error
            )}`
          );
        }
      }
      if (requestData.json.recipient.id) {
        senderId = requestData.json.recipient.id;
      }
      if (response && response.body) {
        requestData.intent = {
          name: action
        };

        dashbot.logOutgoing(requestData, response.body);
      } else {
        console.log(`callSendAPI response undefined ${senderId}`);
      }

      if (error) {
        reject(error);
        console.log("No es posible enviar el mensaje");
      } else {
        resolve(response);

        console.log(`Mensaje enviado ${senderId}`);
      }
    });
  });
};

module.exports = {
  callSendAPI
};
