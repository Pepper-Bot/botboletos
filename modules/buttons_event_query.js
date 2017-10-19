module.exports = function () {

    return {

        send: function (Message, senderId) {


            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var buttons = [{
                    "type": "postback",
                    "title": "Location",
                    "payload":"find_my_event_query_location"
                },
                {
                    "type": "postback",
                    "title": "event_name",
                    "payload":"find_my_event_query_name"
                },
                {
                    "content_type": "text",
                    "title": "Date",
                    "payload": "find_my_event_query_date"
                }
            ];

            Message.templateButton(senderId, "You can make your query with:", buttons);
            Message.typingOff(senderId);

        }
    }

}();