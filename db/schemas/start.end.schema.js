var mongoose = require("mongoose");

var StartEnd = mongoose.Schema({
   toogle: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("StartEnd", StartEnd);
