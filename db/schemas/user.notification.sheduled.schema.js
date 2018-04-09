var mongoose = require("mongoose");

var UserNotificationSheduled = mongoose.Schema({
  fbId: String,
 
  nextNotificationDate: {
    type: Date,
    default: Date.now
  },

  numberOfNextDays: {
    type: Number,
    default: 0
  },
  
  
  description: [
    
  ],

  lastNotificationDate: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model(
  "UserNotificationSheduled",
  UserNotificationSheduled
);
