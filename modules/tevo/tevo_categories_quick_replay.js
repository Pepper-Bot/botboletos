module.exports = (function() {
  return {
    send: function(Message, senderId, messagetxt, track_artists = false) {
      var tevo_categories = require("./tevo_categories");

      var repliesArray = [];
      var parentCategories = tevo_categories.getParentCategories();
      var text = "";
      for (var i = 0; i < parentCategories.length; i++) {
        if (parentCategories[i].Sports) {
          text = "Sports";
        } else {
          text = parentCategories[i].name;
        }

        repliesArray.push({
          content_type: "text",
          title: text,
          payload: text
        });
      }

      Message.markSeen(senderId);
      Message.typingOn(senderId);

      if (track_artists === true) {
        let account = {
          content_type: "text",
          title: "Track Artist",
          payload: "ACCOUNT"
        };

        repliesArray.unshift(account);
      }

      Message.quickReply(senderId, messagetxt, repliesArray);
      Message.typingOff(senderId);
    }
  };
})();
