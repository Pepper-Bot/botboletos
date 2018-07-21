var mongoose = require("mongoose");

var UserNotificationSheduled = mongoose.Schema({
  fbId: String,

  nextNotificationDate: {
    type: Date,
    default: Date.now
  },

  numberOfNextSeconds: {
    type: Number,
    default: 0
  },


  lastNotificationDate: {
    type: Date,
    default: Date.now
  },




  nextNotificacion: {
    type: Number,
    default: 0
  }

  ,

  activated: {
    type: Boolean,
    default: true
  },


});

module.exports = mongoose.model(
  "UserNotificationSheduled",
  UserNotificationSheduled
);