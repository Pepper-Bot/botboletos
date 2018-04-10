var artistQueries = require("../../db/queries/artist.queries");
var userQueries = require("../../db/queries/user.queries");
var fbComponents = require("./me.send.fb.components");
const pepperurl = "https://www.messenger.com/t/pepperSharks";
const Messsage = require("./messages");
const eventsRequests = require("../tevo_requests/events");
var fb_me_send_account = require("./me.send.account");

/**
 *
 * @param {*} senderId
 * ===================================================================================================
 * @description Función para consutruir y enviar  un generic template con artistas que tienen eventos
 * ===================================================================================================
 */
var buildUserArtistGenericTemplate = senderId => {
  return new Promise((resolve, reject) => {
    userQueries.getUserByFbId(senderId).then(foundUser => {
      let artistsSelected = foundUser.artistsSelected;
      if (artistsSelected.length > 0) {
        /**
         * ===============================🔆
         *  Faves added
         * ===============================
         */
        let lat = foundUser.location.coordinates[0];
        let lon = foundUser.location.coordinates[1];
        if (lat && lon) {
          artistsWithEventsInLocationNewArray(artistsSelected, lat, lon).then(
            artistsWithEvents => {
              if (artistsWithEvents.length > 0) {
                /**
                 * ===============================🔆
                 * Artistas Filtrados con eventos en la localización del usuario
                 * ===============================
                 */
                console.log(
                  `artistsWithEventsInLocationNewArray: Artistas Filtrados con eventos en la localización del usuario largo ${
                    artistsWithEvents.length
                  } `
                );

                userQueries
                  .createUpdateUserArtistHasEvent(senderId, true)
                  .then(() => {});

                let messageText =
                  "Cool, your favorite artists results near you";
                sendFbGenericTemplate(
                  senderId,
                  artistsWithEvents,
                  messageText
                ).then(response => {
                  resolve(response);
                });
              } else {
                console.log(
                  `artistsWithEventsInLocationNewArray: Ningun artista tiene eventos en la localización del usuario`
                );
                artistsWithEventsNewArray(artistsSelected).then(
                  artistsWithEvents => {
                    if (artistsWithEvents.length > 0) {
                      /**
                       * ===============================🔆
                       * Artistas seleccionados con eventos, sin tener en cuenta localización del usuario
                       * ===============================
                       */

                      userQueries
                        .createUpdateUserArtistHasEvent(senderId, false)
                        .then(() => {});

                      let messageText =
                        "Cool, your favorite artists results near you";
                      sendFbGenericTemplate(
                        senderId,
                        artistsWithEvents,
                        messageText
                      ).then(response => {
                        console.log(
                          `Artistas seleccionados con eventos, sin tener en cuenta localización`
                        );
                        resolve(response);
                      });
                    } else {
                      console.log(
                        "buildUserArtistGenericTemplate-artistsWithEventsNewArray: Ninguno de los artistas seleccionados tienen eventos"
                      );
                      resolve({
                        message:
                          "Ninguno de los artistas seleccionados tienen eventos"
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          /**
           * ===============================🔆
           * No tengo coordenadas del usuario Los artistas tienen evento
           * ===============================
           */
          artistsWithEventsNewArray(artistsSelected).then(artistsWithEvents => {
            if (artistsWithEvents.length > 0) {
              let messageText =
                "With your location I can give  you better recommendations. These are the most trending events";
              sendFbGenericTemplate(
                senderId,
                artistsWithEvents,
                messageText
              ).then(response => {
                resolve(response);
              });
            } else {
              console.log(
                "buildUserArtistGenericTemplate-artistsWithEventsNewArray: Ninguno de los artistas seleccionados tienen eventos"
              );
              /**
               * ===============================🔆
               * No tengo coordenadas del usuario y ninguno de los artistas tienen evento
               * ===============================
               */

              resolve({
                message: "Ninguno de los artistas seleccionados tienen eventos"
              });
            }
          });
        }
      } else {
        /**
         * ===============================🔆
         *  Faves Not Added
         * ===============================
         */
        let locationMesssage = "May be later. Would you like to  catch a show?";
        Messsage.getLocation(senderId, locationMesssage);

        console.log(`El usuario no tiene artistas asociados.`);
        resolve({
          messsage: `User doesn't have artists`
        });
      }
    });
  }).catch(error => {
    console.log(`Error en buildUserArtistGenericTemplate ${error}`);
  });
};

/**
 *
 * @param {*} lastArtistsSelected
 * @description función para enviar un generic Template de artistas seleccionados.
 */
var sendFbGenericTemplate = (senderId, lastArtistsSelected, messageText) => {
  return new Promise((resolve, reject) => {
    let counter = 0;
    let elements = [];
    let pepperurlref = `${pepperurl}?ref=`;
    for (let i = 0; i < lastArtistsSelected.length; i++) {
      artistQueries
        .getArtist(lastArtistsSelected[i].performer_id)
        .then(foundArtist => {
          console.log(`foundArtist.length  ${foundArtist.images.length}`);

          let buttons = [];
          buttons.push(
            fbComponents.buildPayLoadButton(foundArtist.name, foundArtist.name)
          );
          buttons.push(fbComponents.buildShareButton());

          console.log(`buttons  ${JSON.stringify(buttons)}`);

          elements.push(
            fbComponents.buildElementForGenericTemplate(
              foundArtist.name,
              foundArtist.images[0].url,
              foundArtist.name,
              `${pepperurlref}${foundArtist.name}`,
              buttons
            )
          );
          counter++;
          console.log(`elements.length  ${JSON.stringify(elements.length)}`);
          console.log(
            `lastArtistsSelected.length  ${JSON.stringify(
              lastArtistsSelected.length
            )}`
          );

          if (counter === lastArtistsSelected.length - 1) {
            elements.splice(9, lastArtistsSelected.length - 10);
            Messsage.sendMessage(messageText).then(() => {
              fbComponents
                .sendGenericTemplate(senderId, elements, "horizontal")
                .then(response => {
                  resolve(response);
                });
            });
          } else {
            console.log(`elements.length  ${elements.length}`);
          }
        });
    }
  });
};

/**
 *
 * @param {*} artistsSelected
 * @description Función para escoger los artistas que seleccionó el usuario y que tienen eventos.
 */
var artistsWithEventsNewArray = artistsSelected => {
  return new Promise((resolve, reject) => {
    let artistsWithEvents = [];
    let counter = 0;
    for (let i = 0; i < artistsSelected.length; i++) {
      eventsRequests
        .searchEventsByPerformerId(
          artistsSelected[i].performer_id,
          artistsSelected[i].name
        )
        .then(cantidad => {
          console.log(` Cantidad ${cantidad}`);

          if (cantidad > 0) {
            artistsWithEvents.push(artistsSelected[i]);
          }

          counter++;

          if (counter === artistsSelected.length - 1) {
            resolve(artistsWithEvents);
          }
        });
    }
  });
};

/**
 *
 * @param {*} artistsSelected
 * @description Función para escoger los artistas que seleccionó el usuario y que tienen eventos.
 */
var artistsWithEventsInLocationNewArray = (artistsSelected, lat, lon) => {
  return new Promise((resolve, reject) => {
    let artistsWithEvents = [];
    let counter = 0;
    for (let i = 0; i < artistsSelected.length; i++) {
      eventsRequests
        .searchEventsByPerformerIdAndLocation(
          artistsSelected[i].performer_id,
          artistsSelected[i].name,
          lat,
          lon
        )
        .then(cantidad => {
          console.log(` Cantidad ${cantidad}`);

          if (cantidad > 0) {
            artistsWithEvents.push(artistsSelected[i]);
          }

          counter++;

          if (counter === artistsSelected.length - 1) {
            resolve(artistsWithEvents);
          }
        });
    }
  });
};

/**
 * @description Función para enviar los 9 primeros artistas
 */
var sendFirst9Artists = () => {
  return new Promise((resolve, reject) => {
    artistQueries.getArtists(9, 1).then(lastArtistsSelected => {
      for (let i = 0; i < lastArtistsSelected.length; i++) {
        artistQueries
          .getArtist(lastArtistsSelected[i].performer_id)
          .then(foundArtist => {
            console.log(`foundArtist.length  ${foundArtist.images.length}`);

            let buttons = [];
            buttons.push(
              fbComponents.buildPayLoadButton(
                foundArtist.name,
                foundArtist.name
              )
            );
            buttons.push(fbComponents.buildShareButton());

            console.log(`buttons  ${JSON.stringify(buttons)}`);

            elements.push(
              fbComponents.buildElementForGenericTemplate(
                foundArtist.name,
                foundArtist.images[0].url,
                foundArtist.name,
                `${pepperurlref}${foundArtist.name}`,
                buttons
              )
            );
            counter++;
            console.log(`elements.length  ${JSON.stringify(elements.length)}`);
            console.log(
              `lastArtistsSelected.length  ${JSON.stringify(
                lastArtistsSelected.length
              )}`
            );

            if (counter === lastArtistsSelected.length - 1) {
              fbComponents
                .sendGenericTemplate(senderId, elements, "horizontal")
                .then(response => {
                  resolve(response);
                });
            } else {
              console.log(`elements.length  ${elements.length}`);
            }
          });
      }
    });
  });
};
module.exports = {
  buildUserArtistGenericTemplate
};
