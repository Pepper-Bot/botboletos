module.exports = function () {

    return {

        send: function (Message, senderId, messagetxt) {
            var tevo_categories = require('./tevo_categories')


            var repliesArray = [];
            var parentCategories = tevo_categories.parentCategories();
            var text = '';
            for (var i = 0; i < parentCategories.length; i++) {

                if (parentCategories[i].Sports != undefined) {
                    text = parentCategories[i].Sport.name;
                } else {
                    text = parentCategories[i].name;
                }

                repliesArray.push({
                    "content_type": "text",
                    "title": text,
                    "payload": text
                });
            }


            Message.markSeen(senderId);
            Message.typingOn(senderId);


            Message.quickReply(senderId, messagetxt, repliesArray);
            Message.typingOff(senderId);
        }
    }

}();