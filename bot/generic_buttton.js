var request = require("request");
var Message = require("../bot/messages");
var callSendAPI = require("./me.send").callSendAPI;
var Messages = require("./messages");

/**
 *
 * @param {*} senderId
 * @param {*} messageText
 * @param {*} replies
 * @param {*} callback
 */
var quickReply = (senderId, messageText, replies, callback) => {
  return new Promise((resolve, reject) => {
    let messageData = {
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
        console.log(`error en genericButton ${error}`);
      });
  });
};

var genericTemplate = (
  senderId,
  gButtons,
  image_aspect_ratio = "horizontal" /*square*/
) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            image_aspect_ratio: image_aspect_ratio, //square
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
        console.log(`error en genericTemplate ${error}`);
      });
  });
};

var listButtons = (senderId, title, buttons) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: title,
            buttons: buttons
          }
        }
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en genericTemplate ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} gButtons
 * @param {*} messageText
 * @param {*} callback
 */
var genericButtonQuickReplay = (
  senderId,
  gButtons,
  messageText,
  track_artist
) => {
  return new Promise((resolve, reject) => {
    Message.genericButton(senderId, gButtons).then(response1 => {
      let replies = [];

      if (track_artist === true) {
        replies = [
          {
            content_type: "text",
            title: "Track Artist",
            payload: "ACCOUNT"
          },
          {
            content_type: "text",
            title: "Show me more",
            payload: "find_my_event_show_me_more"
          },
          {
            content_type: "text",
            title: "Search Event",
            payload: "find_my_event_search_event"
          }
         
        ];
      } else {
        replies = [
          {
            content_type: "text",
            title: "Show me more",
            payload: "find_my_event_show_me_more"
          },
          {
            content_type: "text",
            title: "Search Event",
            payload: "find_my_event_search_event"
          }
        ];
      }

      Message.quickReply(senderId, messageText, replies).then(response2 => {
        console.log(`quickReply response ${response2}`);
        resolve(response2);
      });
    });
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} senderId
 * @param {*} messageText
 */
function sendImageWithQuickReplay(senderId, senderId, messageText) {
  Message.sendImage(senderId, senderId).then(response => {
    var replies = [
      {
        content_type: "text",
        title: "Rigondeaux",
        payload: "Rigondeaux"
      },
      {
        content_type: "text",
        title: "Lomachenko",
        payload: "Lomachenko"
      }
    ];
    Message.quickReply(senderId, messageText, replies);
  });
}

module.exports = {
  genericButtonQuickReplay,
  sendImageWithQuickReplay,
  genericTemplate,
  listButtons
};
