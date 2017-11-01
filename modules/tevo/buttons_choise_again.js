module.exports = function () {
    
        return {
    
            send: function (Message, senderId,greeting) {
               
    
                Message.typingOn(senderId);
                Message.markSeen(senderId);
                Message.typingOn(senderId);
    
                var buttons = [
                    
                    {
                        "type": "postback",
                        "title": "Search Event",
                        "payload": "find_my_event_search_event"
                    }
                ];
    
                Message.templateButton(senderId,  greeting + "!. You can find  your  artist, sport team or event, please choose a option:", buttons);
                Message.typingOff(senderId);
    
            }
        }
    
    }();