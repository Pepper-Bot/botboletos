module.exports = function () {
    
        return {
    
            start: function (senderId) {
    
    
                var Message = require('../bot/messages');
                // llamamos al modulo de mensajes
                var eventResults = [];
                Message.typingOn(senderId);
                // simulamos el tipeado
                // enviamos el mensaje    
                Message.sendMessage(senderId, "Event Brite ");
                Message.typingOff(senderId);
    
                // tipeado off
                
     
    
     
    
    
    
    
            }
    
        };
    
    }();
    
     