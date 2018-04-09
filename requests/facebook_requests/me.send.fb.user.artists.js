var artistQueries = require("../../db/queries/artist.queries");
var userQueries = require("../../db/queries/user.queries");
var fbComponents = require("./me.send.fb.components");
const pepperurl = "https://www.messenger.com/t/pepperSharks";

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
  let counter = 0;
  return new Promise((resolve, reject) => {
    userQueries.getUserByFbId(senderId).then(foundUser => {
      let artistsSelected = foundUser.artistsSelected;
      if (artistsSelected.length > 0) {
        
        artistsWithEventsNewArray(artistsSelected).then(artistsWithEvents => {
          let lastArtistsSelected = artistsWithEvents;
          console.log(
            `lastArtistsSelected.length  ${lastArtistsSelected.length}`
          );
          //resolve({ message: lastArtistsSelected });
          let elements = [];
          let pepperurlref = `${pepperurl}?ref=`;

          if (lastArtistsSelected) {
            for (let i = 0; i < lastArtistsSelected.length; i++) {
              artistQueries
                .getArtist(lastArtistsSelected[i].performer_id)
                .then(foundArtist => {
                  console.log(
                    `foundArtist.length  ${foundArtist.images.length}`
                  );

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
                  console.log(
                    `elements.length  ${JSON.stringify(elements.length)}`
                  );
                  console.log(
                    `lastArtistsSelected.length  ${JSON.stringify(
                      lastArtistsSelected.length
                    )}`
                  );

                  if (counter === lastArtistsSelected.length - 1) {
                    fbComponents
                      .sendGenericTemplate(senderId, elements, "horizontal")
                      .then(response => {
                        resolve(counter);
                      });
                  } else {
                    console.log(`elements.length  ${elements.length}`);
                  }
                });
            }
          } else {
            console.log(`Ninguno de los artistas seleccionados tiene evento.`); //🔆
            resolve(counter);
          }
        });
      } else {
        console.log(`El usuario no tiene artistas asociados.`); //🔆
        resolve(counter);
      }
    });
  }).catch(error => {
    console.log(`Error en buildUserArtistGenericTemplate ${error}`);
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
