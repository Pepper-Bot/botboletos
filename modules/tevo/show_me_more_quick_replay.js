module.exports = function () {

    return {

        send: function (Message, senderId) {


            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [{
                    "content_type": "text",
                    "title": "Show me more",
                    "payload": "find_my_event_show_me_more"

                },
                {
                    "content_type": "text",
                    "title": "Search Event",
                    "payload": "find_my_event_search_event"
                }
            ];
            Message.quickReply(senderId, "Pleas choose...", replies);
            Message.typingOff(senderId);

        }
    }

}();