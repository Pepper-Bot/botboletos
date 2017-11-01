module.exports = function () {
    
        return {
    
            send: function (Message, senderId, lookingFor) {
    
    
                Message.typingOn(senderId);
                Message.markSeen(senderId);
                Message.typingOn(senderId);
    
                var replies = [{
                        "content_type": "text",
                        "title": "Yes",
                        "payload": "find_my_event_yes"
    
                    },
                    {
                        "content_type": "text",
                        "title": "No ",
                        "payload": "find_my_event_no"
                    }
                    
                ];
                Message.quickReply(senderId, "Are you looking for " + lookingFor +" event ?" , replies);
                Message.typingOff(senderId);
    
            }
        }
    
    }();