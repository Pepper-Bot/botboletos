module.exports = function () {

    return {

        send: function (Message, senderId, title = "Now!.  Do you Want to go to the battle?") {

            Message.typingOn(senderId);
            Message.markSeen(senderId);
            Message.typingOn(senderId);

            var replies = [

                {
                    "content_type": "text",
                    "title": "GET TICKETS",
                    "payload": "find_my_event_rigo_vs_loma"
                }
            ];
            Message.quickReply(senderId, title, replies);
            Message.typingOff(senderId);

        }
    }

}();