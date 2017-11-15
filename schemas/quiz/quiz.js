var mongoose = require('mongoose');

var quiz = mongoose.Schema({
    dateStart: {
        type: Date,
        default: Date.now
    },
    dateEnd: {
        type: Date,
        default: Date.now
    },

});
module.exports = mongoose.model('quiz', quiz);