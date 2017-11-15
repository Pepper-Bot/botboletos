var mongoose = require('mongoose');  
var Schema = mongoose.Schema;  
var quiz = mongoose.model('quiz');

var question = new Schema({  
    title: String,
    subtitle: String,
    quiz: { type: Schema.ObjectId, ref: "quiz" } 
});

module.exports = mongoose.model("question", question);  
