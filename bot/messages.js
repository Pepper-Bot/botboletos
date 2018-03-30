var request = require("request");
var callSendAPI = require("./me.send").callSendAPI;

/**
 *
 * @param {*} senderId
 * @param {*} elements
 */
var genericButton = (senderId, elements) => {
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
            elements: elements
          }
        }
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

/**
 *
 * @param {*} senderId
 * @param {*} title_template
 * @param {*} buttons
 */
var templateButton = (senderId, title_template, buttons) => {
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
            text: title_template,
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
        console.log(`error en templateButton ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} texto
 */
var getLocation = (senderId, texto) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: texto,
        quick_replies: [
          {
            content_type: "location"
          }
        ]
      }
    };

    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en getLocation ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} texto
 * @param {*} quick_replies
 */
var quickReply = (senderId, texto, quick_replies) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: texto,
        quick_replies: quick_replies
      }
    };

    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en quickReply ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 */
var markSeen = senderId => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      sender_action: "mark_seen"
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en markSeen ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 */
var typingOff = senderId => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      sender_action: "typing_off"
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en typingOff ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 */
var typingOn2 = senderId => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },

      sender_action: "typing_on"
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en typingOn2 ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 */
var typingOn = senderId => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      sender_action: "typing_on"
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en typingOn ${error}`);
      });
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} message
 */
var sendMessage = (senderId, message) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en typingOn ${error}`);
      });
  });
};


/**
 * 
 * @param {*} senderId 
 * @param {*} urlVideo 
 */
var sendVideoMessage = (senderId, urlVideo) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "video",
          payload: {
            url: urlVideo //  "https://botboletos-test.herokuapp.com/videos/transformer.mp4"
          }
        }
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en sendVideoMessage ${error}`);
      });
  });
};

/**
 * 
 * @param {*} senderId 
 * @param {*} urlImage 
 */
var sendImage = (senderId, urlImage) => {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: urlImage,
            is_reusable: true
          }
        }
      }
    };
    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en sendImage ${error}`);
      });
  });
};



function sendYoutubeVideo(senderId, urlVideoYoutube) {
  return new Promise((resolve, reject) => {
    let messageData = {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "open_graph",
            elements: [
              {
                url: urlVideoYoutube //"https://www.youtube.com/watch?v=y9A1MEbgLyA"
              }
            ]
          }
        }
      }
    };

    callSendAPI(messageData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        console.log(`error en sendImage ${error}`);
      });
  });
}
/**
 * 
 * @param {*} senderId 
 * @param {*} title 
 * @param {*} buttons 
 */
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



module.exports = {
  genericButton,
  templateButton,
  getLocation,
  quickReply,
  markSeen,
  typingOff,
  typingOn2,
  typingOn,
  sendMessage,
  sendImage,
  sendVideoMessage,
  sendYoutubeVideo,
  listButtons
};
