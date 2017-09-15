 function getMensajeTemplate(senderID, elementTemplateArray) {
    return messageData = {
        recipient: {
            id: senderID
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: 'generic',
                    elements: elementTemplateArray
                }
            }
        }
    }
}

module.exports = {MensajeTemplate};