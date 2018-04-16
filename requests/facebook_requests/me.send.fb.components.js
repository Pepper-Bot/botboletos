var callSendAPI = require("./me.send").callSendAPI;

/**
 *
 * @param {*} url
 * @param {*} title
 */
var buildURLButton = (url, title, messenger_extensions =false,webview_height_ratio ="tall" ) => {
  button = {
    type: "web_url",
    url: url,
    title: title,
    messenger_extensions : messenger_extensions,
    webview_height_ratio: webview_height_ratio
  };
  return button;
};

/**
 *
 * @param {*} payload
 * @param {*} title
 */
var buildPayLoadButton = (payload, title) => {
  button = {
    type: "postback",
    payload: payload,
    title: title
  };
  return button;
};

var buildShareButton = () => {
  button = {
    type: "element_share"
  };
  return button;
};

/**
 *
 * @param {*} title
 * @param {*} image_url
 * @param {*} subtitle
 * @param {*} url
 * @param {*} buttons
 */
var buildElementForGenericTemplate = (
  title,
  image_url,
  subtitle,
  url,
  buttons = [],
  messenger_extensions= false
) => {
  var element = {
    title: title,
    image_url: image_url,
    subtitle: subtitle,
    //"item_url": boletos[i].url,
    default_action: {
      type: "web_url",
      url: url //,
      //"messenger_extensions": true//,
      // "webview_height_ratio": "tall",
      // "fallback_url": boletos[i].url
    },
    buttons: buttons
  };
  return element;
};

/**
 *
 * @param {*} senderId
 * @param {*} text
 */
function sendMessage(senderId, text) {
  return new Promise((resolve, reject) => {
    messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: text
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *
 * @param {*} senderId
 * @param {*} gButtons
 * @param {*} image_aspect_ratio
 */
function sendGenericTemplate(senderId, gButtons, image_aspect_ratio) {
  return new Promise((resolve, reject) => {
    messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            image_aspect_ratio: image_aspect_ratio, // "horizontal",//square
            elements: gButtons
          }
        }
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
/**
 *
 * @param {*} senderId
 * @param {*} messageText
 * @param {*} replies
 */
var sendQuickReplay = (senderId, messageText, replies) => {
  return new Promise((resolve, reject) => {
    var messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: messageText,
        quick_replies: replies
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  sendMessage,
  sendGenericTemplate,
  sendQuickReplay,
  buildElementForGenericTemplate,
  buildPayLoadButton,
  buildShareButton,
  buildURLButton
};
