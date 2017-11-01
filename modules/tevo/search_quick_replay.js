module.exports = function () {

    return {

        send: function (Message, senderId, title = "Choose options") {


            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [

                {
                    "content_type": "text",
                    "title": "By name ",
                    "payload": "find_my_event_by_name"
                },
                {
                    "content_type": "text",
                    "title": "By Category",
                    "payload": "find_my_event_by_category"

                },

                {
                    "content_type": "text",
                    "title": "By Location ",
                    "payload": "find_my_event_by_location"
                }
            ];
            Message.quickReply(senderId, title, replies);
            Message.typingOff(senderId);

        }
    }

}();