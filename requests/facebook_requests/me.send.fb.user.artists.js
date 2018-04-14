var artistQueries = require("../../db/queries/artist.queries");
var userQueries = require("../../db/queries/user.queries");
var fbComponents = require("./me.send.fb.components");
const pepperurl = "https://www.messenger.com/t/pepperSharks";
const Message = require("./messages");
const eventsRequests = require("../tevo_requests/events");
var fb_me_send_account = require("./me.send.account");

var TevoClient = require("ticketevolution-node");
var only_with = require("../../config/config_vars").only_with;
var tevo = require("../../config/config_vars").tevo;
var nlp = require("../../bot/NLP/nlp");

const tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});

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

                let messageText = "Cool, your favorite artists results near you";
                let messageText = "Cool, Check out your artists events";

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
        let locationMessage = "May be later. Would you like to  catch a show?";
        Message.getLocation(senderId, locationMessage);

        console.log(`El usuario no tiene artistas asociados.`);
        resolve({
          message: `User doesn't have artists`
        });
      }
    });
  }).catch(error => {
    console.log(`Error en buildUserArtistGenericTemplate ${error}`);
  });
};

/**
 *
 * @param {*} senderId
 * @param {*} track_artist
 * @param {*} caso
 * @description función para 3,  7 y 14  días después
 */
var buildCategoriesToSend = (senderId, track_artist = false, caso = 1) => {
  return new Promise((resolve, reject) => {
    userQueries.getUserByFbId(senderId).then(foundUser => {
      let artistsSelected = foundUser.artistsSelected;
      if (artistsSelected.length > 0) {
        /**
         * ===============================🔆
         *  Faves added
         * ===============================
         */
        console.log(`Faves added`);
        let index = 0;
        index = Math.round(Math.random() * artistsSelected.length - 1);
        
        name = artistsSelected[index].name;



        startTevoModuleByCategoryPerformerName(
          senderId,
          name,
          track_artist,
          caso
        ).then(salida => {
          resolve(salida);
        });
      } else {
        /**
         * ===============================🔆
         *  Faves Not Added
         * ===============================
         */
        console.log(`Faves no added`);
        categoriasRandom = [61, 64, 84, 85, 59, 57];

        let index = 0;
        index = Math.round(Math.random() * categoriasRandom.length - 1);
        let category_id = categoriasRandom[index];

        startTevoModuleByCategoryPerformerId(
          senderId,
          category_id,
          track_artist,
          caso
        ).then(salida => {
          resolve(salida);
        });
      }
    });
  });
};

/**
 *
 * @param {*} sender
 * @param {*} category_id
 * @param {*} track_artist
 * @param {*} caso
 * @description Faves Not Added function
 */
var startTevoModuleByCategoryPerformerId = (
  sender,
  category_id,
  track_artist,
  caso = 1
) => {
  return new Promise((resolve, reject) => {
    let query = `${tevo.API_URL}categories/${category_id}`;
    tevoClient
      .getJSON(query)
      .then(json => {
        let salir = false;
        if (json.error) {
          resolve(false);
        } else {
          if (json.id) {
            let category_id = json.id;
            let category_name = json.name;

            let page = 0;
            let per_page = 9;

            userQueries
              .searchUserByFacebookId(sender)
              .then(foundUser => {
                let query = {};

                let lat = foundUser.location.coordinates[0];
                let lon = foundUser.location.coordinates[1];

                let messageTitle = "";
                switch (caso) {
                  case 1:
                    {
                      messageTitle = `:) Been a while! here are some ( ${category_name} ) events near you?`;
                    }
                    break;

                  case 2:
                    {
                      messageTitle = `:) What a week! Check out these ${category_name} events near you?`;
                    }
                    break;
                  case 3:
                    {
                      messageTitle = `Hey ${
                        foundUser.firstName
                      } Check out these   ${category_name} events near you?`;
                    }
                    break;
                }

                if (lat && lon) {
                  query = {
                    prioridad: 1,
                    searchBy: "ByCategoryId",
                    query: `${
                      tevo.API_URL
                    }events?category_id=${category_id}&lat=${lat}&lon=${lon}&page=${page}&per_page=${per_page}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                    queryReplace: `${
                      tevo.API_URL
                    }events?category_id=${category_id}&lat=${lat}&lon=${lon}&page="{{page}}&per_page={{per_page}}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                    queryPage: page,
                    queryPerPage: per_page,
                    messageTitle: messageTitle
                  };
                } else {
                  if (caso == 1) {
                    query = {
                      prioridad: 1,
                      searchBy: "ByPerformerId",
                      query: `${
                        tevo.API_URL
                      }events?page=${page}&per_page=${per_page}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                      queryReplace: `${
                        tevo.API_URL
                      }events?page="{{page}}&per_page={{per_page}}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                      queryPage: page,
                      queryPerPage: per_page,
                      messageTitle: `Hi ${
                        foundUser.firstName
                      } these are the most trending events`
                    };
                  } else {
                    query = {
                      prioridad: 1,
                      searchBy: "ByPerformerId",
                      query: `${
                        tevo.API_URL
                      }events?category_id=${category_id}&page=${page}&per_page=${per_page}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                      queryReplace: `${
                        tevo.API_URL
                      }events?category_id=${category_id}&page="{{page}}&per_page={{per_page}}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                      queryPage: page,
                      queryPerPage: per_page,
                      messageTitle: messageTitle
                    };
                  }
                }

                if (caso == 1) {
                  let Account = require("../../modules/account/account");
                  Account.startAccount(senderId)
                }
                
                let userPreferences = {
                  event_title: "",
                  city: "",
                  artist: "",
                  team: "",
                  event_type: "",
                  music_genre: ""
                };
 
                nlp
                  .tevoByQuery(sender, query, userPreferences, track_artist)
                  .then(cantidad => {
                    if (cantidad == 0) {
                      //find_my_event(sender, 1, "");
                    }
                  });
              })
              .catch(error => {
                console.log(
                  `Error al consultar startTevoModuleByPerformerName - searchUserByFacebookId`
                );
              });

            resolve(true);
          } else {
            console.log(
              `El payload  ${payload} no coincide con ningun performer`
            );
            resolve(false);
          }
        }
      })
      .catch(error => {
        resolve(false);
        console.log(`error-startTevoModuleByCategoryPerformerId ${error}`);
      });
  });
};

/**
 *
 * @param {*} sender
 * @param {*} name
 * @param {*} track_artist
 * @param {*} caso
 * @description Faves  Added function
 */
var startTevoModuleByCategoryPerformerName = (
  sender,
  name,
  track_artist = false,
  caso = 1
) => {
  return new Promise((resolve, reject) => {
    let query = `${tevo.API_URL}performers?name=${name}`;
    tevoClient
      .getJSON(query)
      .then(json => {
        let salir = false;
        if (json.error) {
          resolve(false);
        } else {
          if (json.performers.length > 0) {
            let category_id = json.performers[0].category.id;
            let category_name = json.performers[0].category.name;

            let page = 0;
            let per_page = 9;

            userQueries
              .searchUserByFacebookId(sender)
              .then(foundUser => {
                console.log(`search events by performer and location ===>`);

                let lat = foundUser.location.coordinates[0];
                let lon = foundUser.location.coordinates[1];

                let messageTitle = "";
                switch (caso) {
                  case 1:
                    {
                      messageTitle = `:) Been a while! here are some ( ${category_name} ) events near you?`;
                    }
                    break;

                  case 2:
                    {
                      messageTitle = `:) What a week! Check out these ${category_name} events near you?`;
                    }
                    break;
                  case 3:
                    {
                      messageTitle = `Hey ${
                        foundUser.firstName
                      } Check out these   ${category_name} events near you?`;
                    }
                    break;
                }

                if (lat && lon) {
                  let query = {
                    prioridad: 1,
                    searchBy: "ByPerformerId",
                    query: `${
                      tevo.API_URL
                    }events?category_id=${category_id}&lat=${lat}&lon=${lon}&page=${page}&per_page=${per_page}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                    queryReplace: `${
                      tevo.API_URL
                    }events?category_id=${category_id}&lat=${lat}&lon=${lon}&page="{{page}}&per_page={{per_page}}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                    queryPage: page,
                    queryPerPage: per_page,
                    messageTitle: messageTitle
                  };

                  let userPreferences = {
                    event_title: "",
                    city: "",
                    artist: "",
                    team: "",
                    event_type: "",
                    music_genre: ""
                  };

                  nlp
                    .tevoByQuery(sender, query, userPreferences, track_artist)
                    .then(cantidad => {
                      if (cantidad == 0) {
                        //find_my_event(sender, 1, "");

                        let query = {
                          prioridad: 1,
                          searchBy: "ByPerformerId",
                          query: `${
                            tevo.API_URL
                          }events?category_id=${category_id}&page=${page}&per_page=${per_page}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                          queryReplace: `${
                            tevo.API_URL
                          }events?category_id=${category_id}&page="{{page}}&per_page={{per_page}}&${only_with}&events.popularity_score DESC&order_by=events.occurs_at`,
                          queryPage: page,
                          queryPerPage: per_page,
                          messageTitle: messageTitle
                        };

                        let userPreferences = {
                          event_title: "",
                          city: "",
                          artist: "",
                          team: "",
                          event_type: "",
                          music_genre: ""
                        };

                        nlp
                          .tevoByQuery(sender, query, userPreferences)
                          .then(cantidad => {
                            if (cantidad == 0) {
                              console.log(
                                "me.send.fb.user.artists - startTevoModuleByCategoryPerformerName, no tengo eventos"
                              );
                            }
                          });
                      }
                    });
                } else {
                  /**
                   * ===============================🔆
                   *  El usuario no ha proporcionado la ubicación se la solicito para
                   *  enviarle en el webhook processLocation buildUserArtistGenericTemplate
                   * ===============================
                   */
                  userQueries
                    .createUpdateUserDatas(sender, "notification1")
                    .then(() => {
                      Message.getLocation(
                        sender,
                        ":) Been a while! wanna check out events near you?"
                      );
                    });
                }
              })
              .catch(error => {
                console.log(
                  `Error al consultar startTevoModuleByPerformerName - searchUserByFacebookId`
                );
              });

            resolve(true);
          } else {
            console.log(
              `El payload  ${payload} no coincide con ningun performer`
            );
            resolve(false);
          }
        }
      })
      .catch(error => {
        resolve(false);
        console.log(`error ${error}`);
      });
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
            fbComponents.buildPayLoadButton(foundArtist.name, "View" /*foundArtist.name*/)
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

            console.log(`sendFbGenericTemplate - messageText ${messageText}`);

            Message.sendMessage(senderId, messageText).then(response => {
              console.log("sendFbGenericTemplate - sendMessage");
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

/**
 *
 * @param {*} senderId
 *
 * @description función que se envia a los 30 días
 */
var sendCategoryPickUp = senderId => {
  return new Promise((resolve, reject) => {
    userQueries.searchUserByFacebookId(senderId).then(foundUser => {
      var CategoriesQuickReplay = require("../../modules/tevo/tevo_categories_quick_replay");
      //var ButtonsEventsQuery = require('../modules/buttons_event_query');
      CategoriesQuickReplay.send(
        Message,
        senderId,
        `Hi ${
          foundUser.firstName
        }  Let me get to know you better.  What type of events do you like?`,
        true
      );
      resolve(true);
    });
  });
};

module.exports = {
  buildUserArtistGenericTemplate,
  buildCategoriesToSend,
  sendCategoryPickUp
};
