module.exports = function () {

    return {

        send: function (Message, senderId) {


            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [
                
                {
                    "content_type": "text",
                    "title": "By name ",
                    "payload": "find_my_event_by_name"
                }
                ,
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
            Message.quickReply(senderId, "Choose options", replies);
            Message.typingOff(senderId);

        }
    }

}();