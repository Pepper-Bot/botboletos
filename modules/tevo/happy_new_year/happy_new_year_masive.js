var UserQueries = require('../../../schemas/queries/user_queries')
var happy_new_year = require('./happy_new_year')
var APLICATION_URL_DOMAIN = require('../../../config/config_vars').APLICATION_URL_DOMAIN;
var usuarios = [{
    "_id": {
        "fbId": "1552706148141481",
        "lastName": "Silver",
        "firstName": "Mike"
    },
    "cantidad": 9
}, {
    "_id": {
        "fbId": "1185145998253428",
        "lastName": "Russi",
        "firstName": "Arjumand"
    },
    "cantidad": 7
}, {
    "_id": {
        "fbId": "1392174490831537",
        "lastName": "Martinez",
        "firstName": "Laura"
    },
    "cantidad": 2
}, {
    "_id": {
        "fbId": "1705877032758862",
        "lastName": "Jaimes Estévez",
        "firstName": "Leo"
    },
    "cantidad": 898
}, {
    "_id": {
        "fbId": "1461377663955819",
        "lastName": "Hernández Silveira",
        "firstName": "Mariel"
    },
    "cantidad": 28
}]

var sendHappyNewYerToUsers = () => {
    /*UserQueries.getUsersGroupByFBId((error, usuarios) => {
        console.log("Users >>> " + JSON.stringify(usuarios));
    })*/
    var urlVideo = APLICATION_URL_DOMAIN + "videos/happy_new_year/happy_new_year_480.mp4"
    for (let i = 0; i < usuarios.length; i++) {
        var message = 'Seasson´s Greetings! And best wishes for the New Year 😄'
        happy_new_year.sendVideoMessage(usuarios[i]._id.fbId, message, urlVideo)
    }
}

module.exports = {
    sendHappyNewYerToUsers
}