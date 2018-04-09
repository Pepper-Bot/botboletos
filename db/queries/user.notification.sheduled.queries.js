var userQueries = require("./user.queries");
var UserData2 = require("../schemas/userinfo");
var moment = require("moment");
var UserNotificationSheduled = require("../schemas/user.notification.sheduled.schema");
var eventsRequests = require("../../requests/tevo_requests/events");
var userArtists = require("../../requests/facebook_requests/me.send.fb.user.artists");

/**
 * ===========================================
 * @description funtion to send notifications
 * ===========================================
 */
var sendDailyNotification = () => {
  return new Promise((resolve, reject) => {
    /*======================================================================================
    | chequear si hay nuevos usuarios y insertar un registro en usernotificationsheduleds
     =======================================================================================*/
    checkIfNewUsers().then(() => {
      userQueries.getUsersGroupByFBId().then(usuarios => {
        let counter = 0;
        let senderIds = [];
        for (let i = 0; i < usuarios.length; i++) {
          senderIds.push(usuarios[i]._id.fbId);
        }

        let today_start = moment().startOf("day");
        let today_end = moment().endOf("day");

        console.log(`INICIO DEL DIA  ${today_start}`);
        console.log(`FINAL DEL DIA  ${today_end}`);

        let today_plus_7_days_start = moment()
          .add(-2, "days")
          .startOf("day");
        let today_plus_7_days_end = moment()
          .add(-2, "days")
          .endOf("day");

        console.log(`HOY MAS 7 DIAS START  ${today_plus_7_days_start}`);
        console.log(`HOY MAS 7 DIAS  FINAL  ${today_plus_7_days_end}`);

        /*==================================================================================
        | Buscar los usuarios que tengan notificación pendiente para el día que se desee |
        ===================================================================================*/
        getUserNotificationsByFbIdsAndNextNotificationDate(
          senderIds,
          today_plus_7_days_start,
          today_plus_7_days_end
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

                userArtists
                  .buildUserArtistGenericTemplate(usersForNotification[i].fbId)
                  .then(() => {
                    counter++;
                    if (counter === usersForNotification.length - 1) {
                      resolve({ messsge: "termine" });
                    }
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

              //TODO: COLOCAR EL  ENVIO DEL SELECTOR DE ARTISTAS AQUI ��----
              createUpdateUserNotificationSheduled(
                usuarios[i]._id.fbId,
                moment().add(7, "days"),
                7,
                { description: "Send Artist Selector", date: moment() }
              )
                .then(() => {
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
 * @param {*} nextNotificationDate
 * @param {*} numberOfNextDays
 * @param {*} description insert/update in usernotificationsheduleds
 * ====================================================================
 */
var createUpdateUserNotificationSheduled = (
  fbId = "",
  nextNotificationDate,
  numberOfNextDays = 7,
  description = {}
) => {
  var dbObj = require("../DB");
  dbObj.getConnection();

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

          switch (userNotificationSheduled.numberOfNextDays) {
            case 7: {
              userNotificationSheduled.numberOfNextDays = 15;
              break;
            }

            case 15: {
              userNotificationSheduled.numberOfNextDays = 30;
              break;
            }
            case 30: {
              userNotificationSheduled.numberOfNextDays = 7;
              break;
            }

            default: {
              userNotificationSheduled.numberOfNextDays = numberOfNextDays;
            }
          }

          userNotificationSheduled.nextNotificationDate =
            userNotificationSheduled.nextNotificationDate.getTime() +
            1000 * 3600 * 24 * userNotificationSheduled.numberOfNextDays;

          userNotificationSheduled.description.push(description);

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

          userNotificationSheduled.nextNotificationDate = nextNotificationDate;
          userNotificationSheduled.numberOfNextDays = numberOfNextDays;
          userNotificationSheduled.description.push(description);

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
  var dbObj = require("../DB");
  dbObj.getConnection();

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
