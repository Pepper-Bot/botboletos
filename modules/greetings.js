module.exports = function()
{
	
	return {

		send: function(Message,senderId, messagetxt)
		{

            Message.markSeen(senderId);
            Message.typingOn(senderId);
         
            var replies = [{
                "content_type":"text",
                "title":"Food",
                "payload":"GET_LOCATION_FOOD"
               
            },
            {
                "content_type":"text",
                "title":"Drinks",
                "payload":"GET_LOCATION_DRINKS"
            },
            {
                "content_type":"text",
                "title":"Event",
                "payload":"GET_LOCATION_EVENTS"
            }];
            var menu = require('../bot/get_started');
            menu.deleteAndCreatePersistentMenu(); 
            
            Message.quickReply(senderId, messagetxt, replies);
            Message.typingOff(senderId);
		}
	}

}();

