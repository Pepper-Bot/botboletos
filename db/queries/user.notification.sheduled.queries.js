var userQueries = require("./user.queries");
var UserData2 = require("../../schemas/userinfo");
var moment = require("moment");

var UserNotificationSheduled = require("../schemas/user.notification.sheduled.schema");
var eventsRequests = require("../../requests/tevo_requests/events");
var userArtists = require("../../requests/facebook_requests/me.send.fb.user.artists");
var fb_me_send_account = require("../../requests/facebook_requests/me.send.account");
var startEndQueries = require("../queries/start.end.queries");

/**
 *
 * @param {*} initDay
 * @param {*} finishDay
 * @description funtion to send notifications
 */
var sendDailyNotification = (initDay, finishDay) => {
  return new Promise((resolve, reject) => {
    /*======================================================================================
    | chequear si hay nuevos usuarios y insertar un registro en usernotificationsheduleds
     =======================================================================================*/
    startEndQueries.searchToogle().then(startend => {
      console.log(`toogle ${startend.toogle}`);
      if (startend.toogle === true) {
        checkIfNewUsers().then(() => {
          userQueries.getUsersGroupByFBId().then(usuarios => {

            let counter = 0;
            let senderIds = [];
            for (let i = 0; i < usuarios.length; i++) {
              senderIds.push(usuarios[i]._id.fbId);
            }

            /*==================================================================================
            | Buscar los usuarios que tengan notificación pendiente para el día que se desee |
            ===================================================================================*/
            //console.log(`senderIds.length ${JSON.stringify( senderIds)}`)
            getUserNotificationsByFbIdsAndNextNotificationDate(
                senderIds,
                initDay,
                finishDay
              )
              .then(usersForNotification => {
                console.log(
                  `UsersForNotification ${JSON.stringify(
                    usersForNotification.length
                  )}`
                );
                //Notificaciones según las preferencias del usuario   ----
                let counter = 0;
                let hasta = 1
                if (usersForNotification.length < 1) {
                  hasta = usersForNotification.length
                }
                if (usersForNotification.length > 0) {
                  for (let i = 0; i < hasta; i++) {
                    console.log(
                      `usersForNotification[i].nextNotificacion  ${
                        usersForNotification[i].nextNotificacion
                      }`
                    );

                    switch (usersForNotification[i].nextNotificacion) {
                      case 1:
                        {
                          /**
                           * ===================
                           * 3 días/72 horas
                           * ===================
                           */
                          console.log(`3 días`);
                          userArtists
                          .buildCategoriesToSend(
                            usersForNotification[i].fbId,
                            false,
                            1
                          )
                          .then(() => {
                            createUpdateUserNotificationSheduled(
                              usersForNotification[i].fbId
                            ).then(() => {

                              if (
                                counter ===
                                hasta - 1
                              ) {
                                resolve({
                                  messsge: "termine"
                                });
                              }

                              counter++;
                            });
                          });
                        }
                        break;
                      case 2:
                        {
                          /**
                           * ===================
                           * 7 días
                           * ===================
                           */

                          console.log(`7 días`);
                          userArtists
                          .buildCategoriesToSend(
                            usersForNotification[i].fbId,
                            true,
                            2
                          )
                          .then(() => {
                            createUpdateUserNotificationSheduled(
                              usersForNotification[i].fbId
                            ).then(() => {

                              if (
                                counter ===
                                hasta - 1
                              ) {
                                resolve({
                                  messsge: "termine"
                                });
                              }
                              counter++;
                            });
                          });
                        }
                        break;
                      case 3:
                        {
                          /**
                           * ===================
                           * 14 días
                           * ===================
                           */
                          console.log(`14 días`);
                          userArtists
                          .buildCategoriesToSend(
                            usersForNotification[i].fbId,
                            true,
                            3
                          )
                          .then(() => {
                            createUpdateUserNotificationSheduled(
                              usersForNotification[i].fbId
                            ).then(() => {

                              if (counter === hasta - 1) {
                                resolve({
                                  messsge: "termine"
                                });
                              }
                              counter++;
                            });
                          });
                          break;
                        }
                      case 4:
                        {
                          /**
                           * ===================
                           * 30 días
                           * ===================
                           */
                          console.log(`30 días`);

                          userArtists
                          .sendCategoryPickUp(usersForNotification[i].fbId)
                          .then(() => {
                            createUpdateUserNotificationSheduled(
                              usersForNotification[i].fbId
                            ).then(() => {

                              if (counter === hasta - 1) {
                                resolve({
                                  messsge: "termine"
                                });
                              }
                              counter++;
                            });
                          });

                          break;
                        }
                      default:
                        {
                          /**
                           * ===================
                           * 3 días
                           * ===================
                           */
                          /*console.log(`default`);
                          userArtists
                            .buildUserArtistGenericTemplate(
                              usersForNotification[i].fbId
                            )
                            .then(() => {
                              createUpdateUserNotificationSheduled(
                                usersForNotification[i].fbId
                              ).then(() => {
                                counter++;
                                if (
                                  counter ===
                                  usersForNotification.length - 1
                                ) {
                                  resolve({ messsge: "termine" });
                                }
                              });
                            });*/
                        }
                        break;
                    }
                  }
                } else {
                  resolve({
                    messsge: "No encontré usuarios que tengan pendiente notificación"
                  });
                }
              })
              .catch(error => {
                console.log(`Error ${error}`);
              });
          });
        });
      } else {
        console.log("startend:toogle:false");
        resolve({
          messsge: "termine"
        });
      }
    });
  });
};

/**
 * ==============================================
 * @description funtion to check if new users
 * ==============================================
 */
var checkIfNewUsers = () => {
  return new Promise((resolve, reject) => {
    userQueries.getUsersGroupByFBId().then(usuarios => {
      let counter = 0;
      for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        //console.log(`${JSON.stringify(usuario)}`);
        searchUserNotificationSheduledByFbId(usuario._id.fbId).then(
          userNotificationSheduled => {
            if (userNotificationSheduled === null) {
              /*=====================================================================
               Si el usuario no tiene notificación se envia el selector de artistas 
               y se guarda para enviar nueva notificación
              =======================================================================*/

              createUpdateUserNotificationSheduled(usuarios[i]._id.fbId)
                .then((userNotificaciones) => {

                  if (userNotificaciones.activated == true) {

                    fb_me_send_account
                      .sendMyAccount(usuarios[i]._id.fbId)
                      .then(response => {

                        if (counter === usuarios.length - 1) {
                          resolve({
                            message: "termine  checkIfNewUsers "
                          });
                        }
                        counter++;
                      })
                      .catch(error => {
                        console.log(error);
                      });


                  } else {

                    if (counter === usuarios.length - 1) {
                      resolve({
                        message: "termine  checkIfNewUsers "
                      });
                    }
                    counter++;


                  }


                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              /*===================================================
              ------El usuario tiene registro en search update-----
              =====================================================*/

              if (counter === usuarios.length - 1) {
                resolve({
                  message: "termine  checkIfNewUsers "
                });
              }
              counter++;
            }
          }
        );
      }
    });
  });
};

/**
 * ====================================================================
 * @param {*} fbId
 * @param {*} activated
 * @description función para insertar o modificar registro en usernotificationsheduleds
 * 
 * ====================================================================
 */
var createUpdateUserNotificationSheduled = (fbId = "") => {
  return new Promise((resolve, reject) => {
    UserNotificationSheduled.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, userNotificationSheduled) {
        if (null != userNotificationSheduled) {
          userNotificationSheduled.fbId = fbId;


          /**
           * =================================================⭐
           * | userNotificationSheduled.nextNotificacion:
           * | 1: 3   días  =  1000*3600*24*3   milisigundos--primer ciclo
           * | 2: 7   días  =  1000*3600*24*7   milisigundos
           * | 3: 14  días  =  1000*3600*24*14  milisigundos
           * | 4: 30  días  =  1000*3600*24*30  milisigundos
           * =================================================
           *
           */

          console.log(
            `userNotificationSheduled.nextNotificacion ${
              userNotificationSheduled.nextNotificacion
            }`
          );

          switch (userNotificationSheduled.nextNotificacion) {
            case 1:
              {
                userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.nextNotificationDate.getTime() +
                1000 * 3600 * 24 * 3;
                //1000 * 60 * 7;
                userNotificationSheduled.nextNotificacion = 2;

                break;
              }

            case 2:
              {
                userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.nextNotificationDate.getTime() +
                1000 * 3600 * 24 * 4;
                //1000 * 60 * 7;
                userNotificationSheduled.nextNotificacion = 3;
                console.log(
                  `userNotificationSheduled.nextNotificationDate  ${
                  userNotificationSheduled.nextNotificationDate
                }`
                );
                break;
              }
            case 3:
              {
                userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.nextNotificationDate.getTime() +
                1000 * 3600 * 24 * 8;
                //1000 * 60 * 7;
                userNotificationSheduled.nextNotificacion = 4;
                console.log(
                  `userNotificationSheduled.nextNotificationDate  ${
                  userNotificationSheduled.nextNotificationDate
                }`
                );
                break;
              }
            case 4:
              {
                userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.nextNotificationDate.getTime() +
                1000 * 3600 * 24 * 15;
                //1000 * 60 *7;
                userNotificationSheduled.nextNotificacion = 5;
                console.log(
                  `userNotificationSheduled.nextNotificationDate  ${
                  userNotificationSheduled.nextNotificationDate
                }`
                );
                break;
              }

            default:
              {
                userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 3;
                1000 * 60 * 7;
                userNotificationSheduled.nextNotificacion = 2;
                console.log(
                  `userNotificationSheduled.nextNotificationDate  ${
                  userNotificationSheduled.nextNotificationDate
                }`
                );
              }
          }

          userNotificationSheduled.save(function (
            err,
            userNotificationSheduledU
          ) {
            if (!err) {
              console.log(
                "userNotificationSheduled upated !!! " +
                JSON.stringify(userNotificationSheduledU.fbId)
              );

              resolve(userNotificationSheduledU);
            } else {
              console.log(
                "Error guardando en createUpdateUserNotificationSheduled " + err
              );
              resolve({});
            }
          });
        } else {
          let userNotificationSheduled = new UserNotificationSheduled();
          userNotificationSheduled.fbId = fbId;

          userNotificationSheduled.nextNotificationDate = moment().add(
            1,
            "day"
          );
          /**======================
           *  Primer ciclo
           * ======================
           */
          userNotificationSheduled.numberOfNextSeconds = 60;
          userNotificationSheduled.nextNotificacion = 1;

          userNotificationSheduled.save(function (
            err,
            userNotificationSheduledS
          ) {
            if (!err) {
              console.log(
                "userNotificationSheduled Saved !!! " +
                JSON.stringify(userNotificationSheduledS.fbId)
              );

              userQueries.getUserByFbId(userNotificationSheduledS.fbId).then((userFound) => {
                if (
                  userFound.timeZone == "-2" ||
                  userFound.timeZone == "-2" ||
                  userFound.timeZone == "-1" ||
                  userFound.timeZone == "0" ||
                  userFound.timeZone == "1" ||
                  userFound.timeZone == "2" ||
                  userFound.timeZone == "3" ||
                  userFound.timeZone == "4" ||
                  userFound.timeZone == "5" ||
                  userFound.timeZone == "6" ||
                  userFound.timeZone == "7" ||
                  userFound.timeZone == "8" ||
                  userFound.timeZone == "9" ||
                  userFound.timeZone == "10"
                ) {
                  updateUserActivated(userNotificationSheduledS.fbId, false).then((userNotificaciones) => {
                    resolve(userNotificaciones);
                  })
                } else {
                  resolve(userNotificationSheduledS);
                }
              })


            } else {
              console.log(
                "Error guardando en createUpdateUserNotificationSheduled " + err
              );
              resolve(null);
            }
          });
        }
      }
    );
  });
};

/**
 * ===========================================================
 * @param {*} fbId
 * @description search by fbId in usernotificationsheduleds
 * ===========================================================
 */
var searchUserNotificationSheduledByFbId = (fbId = "") => {
  return new Promise((resolve, reject) => {
    UserNotificationSheduled.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, userNotificationSheduled) {
        if (null != userNotificationSheduled) {
          //console.log(`UserNotificationSheduledByFbId  foun !! fbId: ${fbId}`);
          resolve(userNotificationSheduled);
        } else {
          console.log(
            `no encontré registro en searchUserNotificationSheduledByFbId !!`
          );
          resolve(null);
        }
      }
    );
  });
};

/**
 * ===============================================================
 * @param {*} fbIds
 * @description search severak fbIds in usernotificationsheduleds
 * ===============================================================
 */
var getUserNotificationsByFbIds = (fbIds = []) => {
  return new Promise((resolve, reject) => {
    UserNotificationSheduled.find({
        fbId: {
          $in: fbIds
        }
      })
      .sort({
        fbId: -1
      })
      .exec(function (err, userNotifications) {
        if (err) {
          console.log("error en userNotifications " + err);
          resolve([]);
        }
        if (!userNotifications) {
          resolve([]);
        }
        if (userNotifications) {
          resolve(userNotifications);
        }
      });
  });
};

/**
 * ====================================================================================
 * @param {*} fbIds
 * @param {*} startOfDay
 * @param {*} endOfDay
 * @description search by fbIds and  nextNotificationDate of usernotificationsheduleds
 * ====================================================================================
 */
var getUserNotificationsByFbIdsAndNextNotificationDate = (
  fbIds = [],
  startOfDay = new Date(),
  endOfDay = new Date()
) => {
  return new Promise((resolve, reject) => {
    console.log(`startOfDay--> ${startOfDay}`)
    console.log(`endOfDay--> ${endOfDay}`)
    UserNotificationSheduled.find({
        $and: [{
            fbId: {
              $in: fbIds
            }
          },
          {
            nextNotificationDate: {
              $gt: startOfDay,
              $lt: endOfDay
            }
          },
          {
            activated: true
          }

        ]
      })
      .sort({
        fbId: -1
      })
      .limit(1)
      .exec(function (err, userNotifications) {
        if (err) {
          console.log("error en userNotifications " + err);
          resolve([]);
        }
        if (!userNotifications) {
          resolve([]);
        }
        if (userNotifications) {
          resolve(userNotifications);
        }
      });
  });
};





/**
 * ====================================================================
 * @param {*} fbId
 * @param {*} activated
 * @description función para insertar o modificar registro en usernotificationsheduleds
 * ====================================================================
 */
var updateUserActivated = (fbId = "", activated = true) => {
  return new Promise((resolve, reject) => {
    UserNotificationSheduled.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, userNotificationSheduled) {
        if (null != userNotificationSheduled) {
          userNotificationSheduled.activated = activated
          userNotificationSheduled.save(function (
            err,
            userNotificationSheduledU
          ) {
            if (!err) {
              console.log(
                "updateUserActivated upated activated " +

                JSON.stringify(userNotificationSheduledU.fbId)
              );

              resolve(userNotificationSheduledU);
            } else {
              console.log(
                "Error guardando en updateUserActivated   " + err
              );
              resolve({});
            }
          });
        }
      }
    );
  });
};

module.exports = {
  sendDailyNotification,
  createUpdateUserNotificationSheduled,
  searchUserNotificationSheduledByFbId,
  getUserNotificationsByFbIds,
  getUserNotificationsByFbIdsAndNextNotificationDate,
  updateUserActivated
};