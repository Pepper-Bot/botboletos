var mongoose = require("mongoose");

var UserNotificationMinute = mongoose.Schema({
  fbId: String,
 
  nextNotificationDate: {
    type: Date,
    default: Date.now
  },

  numberOfNextMinutes: {
    type: Number,
    default: 0
  },
  
  
  description: [
    
  ],

  lastNotificationDate: {
    type: Date,
    default: Date.now
  },

  finished: {
    type: Boolean,
    defalut: false
  }
});

module.exports = mongoose.model(
  "UserNotificationMinute",
  UserNotificationMinute
);
