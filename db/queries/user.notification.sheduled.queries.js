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
    startEndQueries.createUpdateStartEnd().then(() => {
      startEndQueries.searchToogle().then(toogle => {
        console.log(`toogle ${toogle}`);
      });
    });

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
            if (usersForNotification.length > 0) {
              for (let i = 0; i < usersForNotification.length; i++) {
                console.log(
                  `usersForNotification[i].nextNotificacion  ${
                    usersForNotification[i].nextNotificacion
                  }`
                );
                userArtists
                  .buildUserArtistGenericTemplate(usersForNotification[i].fbId)
                  .then(() => {
                    createUpdateUserNotificationSheduled(
                      usersForNotification[i].fbId
                    ).then(() => {
                      counter++;
                      if (counter === usersForNotification.length - 1) {
                        resolve({ messsge: "termine" });
                      }
                    });
                  });
              }
            } else {
              resolve({
                messsge:
                  "No encontré usuarios que tengan pendiente notificación"
              });
            }
          })
          .catch(error => {
            console.log(`Error ${error}`);
          });
      });
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
        console.log(`${JSON.stringify(usuario)}`);
        searchUserNotificationSheduledByFbId(usuario._id.fbId).then(
          userNotificationSheduled => {
            if (userNotificationSheduled === null) {
              /*=====================================================================
               Si el usuario no tiene notificación se envia el selector de artistas 
               y se guarda para enviar nueva notificación
              =======================================================================*/

              createUpdateUserNotificationSheduled(usuarios[i]._id.fbId)
                .then(() => {
                  fb_me_send_account
                    .sendMyAccount(usuarios[i]._id.fbId)
                    .then(response => {
                      counter++;
                      if (counter === usuarios.length - 1) {
                        resolve({
                          message: "termine  checkIfNewUsers "
                        });
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                })
                .catch(error => {
                  console.log(error);
                });
            } else {
              /*===================================================
              ------El usuario tiene registro en search update-----
              =====================================================*/
              counter++;
              if (counter === usuarios.length - 1) {
                resolve({
                  message: "termine  checkIfNewUsers "
                });
              }
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
 * @description función para insertar o modificar registro en usernotificationsheduleds
 * ====================================================================
 */
var createUpdateUserNotificationSheduled = (fbId = "") => {
  return new Promise((resolve, reject) => {
    UserNotificationSheduled.findOne(
      {
        fbId: fbId
      },
      {},
      {
        sort: {
          fbId: -1
        }
      },
      function(err, userNotificationSheduled) {
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

          switch (userNotificationSheduled.nextNotificacion) {
            case 1: {
              userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 7;
                1000 * 10;
              userNotificationSheduled.nextNotificacion = 2;

              break;
            }

            case 2: {
              userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 14;
                1000 * 10;
              userNotificationSheduled.nextNotificacion = 3;

              break;
            }
            case 3: {
              userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 30;
                1000 * 10;
              userNotificationSheduled.nextNotificacion = 4;
              break;
            }
            case 4: {
              userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 3;
                1000 * 10;
              userNotificationSheduled.numberOfNextDays = 2;
              break;
            }

            default: {
              userNotificationSheduled.nextNotificationDate =
                userNotificationSheduled.lastNotificationDate.getTime() +
                //1000 * 3600 * 24 * 3;
                1000 * 10;
              userNotificationSheduled.nextNotificacion = 2;
            }
          }

          userNotificationSheduled.save(function(
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
            }
          });
        } else {
          let userNotificationSheduled = new UserNotificationSheduled();
          userNotificationSheduled.fbId = fbId;

          /**======================
           *  Primer ciclo
           * ======================
           */
          userNotificationSheduled.nextNotificationDate = moment().add(
            6,
            "seconds"
          );
          userNotificationSheduled.numberOfNextSeconds = 3;
          userNotificationSheduled.nextNotificacion = 1;

          userNotificationSheduled.save(function(
            err,
            userNotificationSheduledS
          ) {
            if (!err) {
              console.log(
                "userNotificationSheduled Saved !!! " +
                  JSON.stringify(userNotificationSheduledS.fbId)
              );

              resolve(userNotificationSheduledS);
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
    UserNotificationSheduled.findOne(
      {
        fbId: fbId
      },
      {},
      {
        sort: {
          fbId: -1
        }
      },
      function(err, userNotificationSheduled) {
        if (null != userNotificationSheduled) {
          console.log(`UserNotificationSheduledByFbId  foun !! fbId: ${fbId}`);
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
    UserNotificationSheduled.find({ fbId: { $in: fbIds } })
      .sort({ fbId: -1 })
      .exec(function(err, userNotifications) {
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
    UserNotificationSheduled.find({
      $and: [
        { fbId: { $in: fbIds } },
        {
          nextNotificationDate: {
            $gt: startOfDay,
            $lt: endOfDay
          }
        }
      ]
    })
      .sort({ fbId: -1 })
      .exec(function(err, userNotifications) {
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

module.exports = {
  sendDailyNotification,
  createUpdateUserNotificationSheduled,
  searchUserNotificationSheduledByFbId,
  getUserNotificationsByFbIds,
  getUserNotificationsByFbIdsAndNextNotificationDate
};
