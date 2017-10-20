module.exports = function () {

    return {

        send: function (Message, senderId,greeting) {
           

            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var buttons = [
                {
                    "type": "postback",
                    "title": "Event Name",
                    "payload": "find_my_event_by_name"
                },
                {
                    "type": "postback",
                    "title": "Location",
                    "payload": "find_my_event_by_location"
                },
                {
                    "type": "postback",
                    "title": "Date",
                    "payload": "find_my_event_by_date"
                },
                {
                    "type":"web_url",
                    "url":"https://extencion-bot.herokuapp.com/",
                    "title":"Select date",
                    
                  }
            ];

            Message.templateButton(senderId,  greeting + "!. You can find  your  artist, sport team or event, please choose a option:", buttons);
            Message.typingOff(senderId);

        }
    }

}();