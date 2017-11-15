var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var quiz = mongoose.model('quiz');
var question = mongoose.model('question');

var answer = new Schema({
    title: String,
    subtitle: String,
    question: {
        type: Schema.ObjectId,
        ref: "question"
    },
    quiz: {
        type: Schema.ObjectId,
        ref: "quiz"
    }
});

module.exports = mongoose.model("answer", answer);