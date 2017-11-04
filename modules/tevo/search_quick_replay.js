module.exports = function () {

    return {

        send: function (Message, senderId, title = "Choose options") {


            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [

                {
                    "content_type": "text",
                    "title": "Performer Name",
                    "payload": "find_my_event_by_name"
                },
                {
                    "content_type": "text",
                    "title": "Event Categories",
                    "payload": "find_my_event_by_category"

                }
            ];
            Message.quickReply(senderId, title, replies);
            Message.typingOff(senderId);

        }
    }

}();