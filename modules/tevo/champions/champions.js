var Message = require("../../../bot/messages");
var APLICATION_URL_DOMAIN = require("../../../config/config_vars")
  .APLICATION_URL_DOMAIN;
var PAGE_ACCESS_TOKEN = require("../../../config/config_vars")
  .PAGE_ACCESS_TOKEN;
var FBMESSAGESPAGE = require("../../../config/config_vars").FBMESSAGESPAGE;
var Message2 = require("../../../bot/generic_buttton");
var request = require("request");
var UserData = require("../../../bot/userinfo");

var startChampionsLeagueFrame = senderId => {
  var replies = [
    {
      content_type: "text",
      title: "Real Madrid",
      payload: "REAL_MADRID"
    },
    {
      content_type: "text",
      title: "París Saint-Germain",
      payload: "PARIS_SAINT_GERMAN"
    }
  ];
  Message.quickReply(senderId, "Which is your favorite? ", replies);
};

var startBarcaVsRoma = senderId => {
  var replies = [
    {
      content_type: "text",
      title: "Barcelona",
      payload: "BARCELONA"
    },
    {
      content_type: "text",
      title: "Roma",
      payload: "ROMA"
    }
  ];
  Message.quickReply(senderId, "Which is your favorite? ", replies);
};

var startBarcaVsChelsea = senderId => {
  var replies = [
    {
      content_type: "text",
      title: "Barcelona",
      payload: "BARCELONA"
    },
    {
      content_type: "text",
      title: "Chelsea",
      payload: "CHELSEA"
    }
  ];
  Message.quickReply(senderId, "Which is your favorite? ", replies);
};

var startBayerSevilla = senderId => {
  var replies = [
    {
      content_type: "text",
      title: "Sevilla",
      payload: "SEVILLA"
    },

    {
      content_type: "text",
      title: "Bayer",
      payload: "BAYER"
    }
  ];
  Message.quickReply(senderId, "Which is your favorite? ", replies);
};

 

module.exports = {
  startChampionsLeagueFrame,
  startBarcaVsChelsea,
  startBayerSevilla,
  startBarcaVsRoma
};
