module.exports = function () {
    
        return {
    
            send: function (Message, senderId,greeting) {
               
    
                Message.typingOn(senderId);
                Message.markSeen(senderId);
                Message.typingOn(senderId);
    
                var buttons = [
                    {
                        "type":"web_url",
                        "url":"https://extencion-bot.herokuapp.com/",
                        "title":"Select date",
                        "messenger_extensions": true,  
                        "webview_height_ratio": "compact"
                      }
    
                ];
    
                Message.templateButton(senderId,  greeting + "!. You can find  your  artist, sport team or event, please choose a option:", buttons);
                Message.typingOff(senderId);
    
            }
        }
    
    }();