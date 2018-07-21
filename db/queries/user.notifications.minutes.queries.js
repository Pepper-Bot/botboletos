var userQueries = require("./user.queries");
var UserData2 = require("../schemas/userinfo");
var moment = require("moment");
var UserNotificationMinutesSchema = require("../schemas/user.notifications.minutes");
var eventsRequests = require("../../requests/tevo_requests/events");
var userArtists = require("../../requests/facebook_requests/me.send.fb.user.artists");
/**
 * ====================================================================
 * @param {*} fbId
 * @param {*} numberOfNextMinutes
 * @param {*} description insert/update in UserNotificationMinutess
 * ====================================================================
 */
var createUpdateUserNotificationMinutes = (
  fbId = "",
  numberOfNextMinutes = 10,
  description = {}
) => {
  return new Promise((resolve, reject) => {
    UserNotificationMinutesSchema.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, UserNotificationMinutes) {
        if (null != UserNotificationMinutes) {
          UserNotificationMinutes.fbId = fbId;

          UserNotificationMinutes.nextNotificationDate = moment().add(
            numberOfNextMinutes,
            "minutes"
          );
          UserNotificationMinutes.lastNotificationDate = moment();

          UserNotificationMinutes.numberOfNextMinutes = numberOfNextMinutes;
          UserNotificationMinutes.description.concat([description]);

          UserNotificationMinutes.save(function (err, UserNotificationMinutesU) {
            if (!err) {
              console.log(
                "UserNotificationMinutes upated !!! " +
                JSON.stringify(UserNotificationMinutesU.fbId)
              );

              resolve(UserNotificationMinutesU);
            } else {
              console.log(
                "Error guardando en createUpdateUserNotificationMinutes " + err
              );
            }
          });
        } else {
          let UserNotificationMinutes = new UserNotificationMinutesSchema();
          UserNotificationMinutes.fbId = fbId;

          UserNotificationMinutes.nextNotificationDate = moment().add(
            numberOfNextMinutes,
            "minutes"
          );
          UserNotificationMinutes.lastNotificationDate = moment();
          UserNotificationMinutes.numberOfNextMinutes = numberOfNextMinutes;
          UserNotificationMinutes.description.concat([description]);

          UserNotificationMinutes.save(function (err, UserNotificationMinutesS) {
            if (!err) {
              console.log(
                "UserNotificationMinutes Saved !!! " +
                JSON.stringify(UserNotificationMinutesS.fbId)
              );

              resolve(UserNotificationMinutesS);
            } else {
              console.log(
                "Error guardando en createUpdateUserNotificationMinutes " + err
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
 * 
 * @param {*} fbId 
 * @param {*} numberOfNextMinutes 
 */
var updateUserNotificationMinuteslastNotificationDate = (
  fbId = "",
  numberOfNextMinutes = 1
) => {

  return new Promise((resolve, reject) => {
    UserNotificationMinutesSchema.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, UserNotificationMinutes) {
        if (null != UserNotificationMinutes) {
          UserNotificationMinutes.fbId = fbId;

          UserNotificationMinutes.lastNotificationDate = moment().add(
            numberOfNextMinutes,
            "minutes"
          );

          UserNotificationMinutes.save(function (err, UserNotificationMinutesU) {
            if (!err) {
              console.log(
                "UserNotificationMinutes upated !!! " +
                JSON.stringify(UserNotificationMinutesU.fbId)
              );

              resolve(UserNotificationMinutesU);
            } else {
              console.log(
                "Error guardando en createUpdateUserNotificationMinutes " + err
              );
            }
          });
        }
      }
    );
  });
};




/**
 * 
 * @param {*} fbId 
 */
var userNotificationMinutesFinish = (
  fbId = "",
) => {
  return new Promise((resolve, reject) => {
    UserNotificationMinutesSchema.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, UserNotificationMinutes) {
        if (null != UserNotificationMinutes) {
          UserNotificationMinutes.fbId = fbId;

          UserNotificationMinutes.finished = true

          UserNotificationMinutes.save(function (err, UserNotificationMinutesU) {
            if (!err) {
              console.log(
                "UserNotificationMinutes finish upated !!! " +
                JSON.stringify(UserNotificationMinutesU.fbId)
              );

              resolve(UserNotificationMinutesU);
            } else {
              console.log(
                "Error guardando en finish " + err
              );
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
 * @description search by fbId in UserNotificationMinutess
 * ===========================================================
 */
var searchUserNotificationMinutesByFbId = (fbId = "") => {

  return new Promise((resolve, reject) => {
    UserNotificationMinutesSchema.findOne({
        fbId: fbId
      }, {}, {
        sort: {
          fbId: -1
        }
      },
      function (err, UserNotificationMinutes) {
        if (null != UserNotificationMinutes) {
          console.log(`UserNotificationMinutesByFbId  foun !! fbId: ${fbId}`);
          resolve(UserNotificationMinutes);
        } else {
          console.log(
            `no encontré registro en searchUserNotificationMinutesByFbId !!`
          );
          resolve(null);
        }
      }
    );
  });
};

/**
 * ====================================================================================
 * @param {*} fbIds
 * @param {*} startOfMinute
 * @param {*} endOfOfMinute
 * @description search by fbIds and  nextNotificationDate of usernotificationsheduleds
 * ====================================================================================
 */
var getUserNotificationsByFbIdsAndNextNotificationDate = (
  fbIds = [],
  startOfDay = new Date(),
  endOfDay = new Date()
) => {
  return new Promise((resolve, reject) => {
    UserNotificationMinutesSchema.find({
        $and: [{
            fbId: {
              $in: fbIds
            }
          },
          {
            nextNotificationDate: {
              $gt: startOfMinute,
              $lt: endOfOfMinute
            }
          }
        ]
      })
      .sort({
        fbId: -1
      })
      .exec(function (err, userNotifications) {
        if (err) {
          console.log(
            "error en getUserNotificationsByFbIdsAndNextNotificationDate " + err
          );
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
  createUpdateUserNotificationMinutes,
  searchUserNotificationMinutesByFbId,
  updateUserNotificationMinuteslastNotificationDate,
  userNotificationMinutesFinish
};