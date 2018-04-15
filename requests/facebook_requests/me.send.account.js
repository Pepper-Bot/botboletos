var APLICATION_URL_DOMAIN = require("../../config/config_vars")
  .APLICATION_URL_DOMAIN;
var fbComponents = require("./me.send.fb.components");
var user_queries = require("../../schemas/queries/user_queries");
var Message = require("../../bot/messages");

var sendMyAccount = senderId => {
  console.log(
    `imagen  ${APLICATION_URL_DOMAIN}images/account/select_artist_v1.jpg`
  );
  return new Promise((resolve, reject) => {
    console.log("Entré a sendMyAccount");
    let URLAplication = APLICATION_URL_DOMAIN + "redirect/?u=";
    let urlExtension = `https://pepper-bussines.herokuapp.com/profile?senderId=${senderId}`;

    let eventResults = [];
    let boletos = [
      {
        titulo: "Track your favorite artist",
        imagen: `${APLICATION_URL_DOMAIN}images/account/select_artist_v1.jpg`,
        subtitulo: "Get notified of upcoming concerts",
        url: `${urlExtension}`
      }
    ];

    let elements = [];
    for (let i = 0; i < boletos.length; i++) {
      let buttons = [];
      console.log("i " + i);
      buttons.push(
        fbComponents.buildURLButton(boletos[i].url, "Track artists")
      );
      buttons.push(fbComponents.buildShareButton());
      console.log(`buttons  ${JSON.stringify(buttons)}`);
      elements.push(
        fbComponents.buildElementForGenericTemplate(
          boletos[i].titulo,
          boletos[i].imagen,
          boletos[i].subtitulo,
          boletos[i].url,
          buttons
        )
      );
    }
    user_queries.getUserByFbId(senderId).then((foundUser) => {
      let messageTitle = `Hi ${
        foundUser.firstName
      }, follow your favorite artist.`;
      Message.sendMessage(senderId, messageTitle).then(() => {
        fbComponents
          .sendGenericTemplate(senderId, elements, "horizontal")
          .then(response => {
            resolve(response);
          });
      });
    });
  });
};

module.exports = {
  sendMyAccount
};
