module.exports = function () {

    return {

        send: function (Message, senderId) {
            console.log('Entre al SEND DE BUTTONS QUERY EVENTSS!!!! -......... ----->>>>>');

            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var buttons = [{
                    "type": "postback",
                    "title": "Location",
                    "payload": "find_my_event_query_location"
                },
                {
                    "type": "postback",
                    "title": "event_name",
                    "payload": "find_my_event_query_name"
                },
                {
                    "content_type": "text",
                    "title": "Date",
                    "payload": "find_my_event_query_date"
                }
            ];
            console.log('Esta es mi  template de bottones !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1'+ buttons);
            Message.templateButton(senderId, "You can make your query with:", buttons);
            Message.typingOff(senderId);

        }
    }

}();