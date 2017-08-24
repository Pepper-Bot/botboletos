module.exports = function()
{
	
	return {

		send: function(Message,senderId)
		{


			Message.typingOn(senderId);
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
	        Message.quickReply(senderId, "Sorry, I didn't quite get that.", replies);
	        Message.typingOff(senderId);

		}
	}

}();

