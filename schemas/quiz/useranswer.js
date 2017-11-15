var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var quiz = mongoose.model('quiz');
var question = mongoose.model('question');
var answer = mongoose.model('answer');
var userfb = mongoose.model('userfb');

var useranswer = new Schema({
    quiz: {
        type: Schema.ObjectId,
        ref: "quiz"
    },
    question: {
        type: Schema.ObjectId,
        ref: "question"
    },
    answer: {
        type: Schema.ObjectId,
        ref: "answer"
    },
    userfb: {
        type: Schema.ObjectId,
        ref: "userfb"
    }
});

module.exports = mongoose.model("useranswer", useranswer);