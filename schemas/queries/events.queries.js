var UserData = require("../../bot/userinfo");
var EventsModel = require("../events.model");
var moment = require("moment");

function isDefined(obj) {
  if (typeof obj == "undefined") {
    return false;
  }

  if (!obj) {
    return false;
  }

  return obj != null;
}

var getEventsImages = event_name => {
  return new Promise((resolve, reject) => {
    EventsModel.find({
        value: {
          $regex: new RegExp(event_name, "ig")
        }
      },
      function (err, events) {
        if (err) {
          console.log("Error al consultar getEventsImages por nombre" + err);
          resolve([]);
        }
        if (!events) {
          console.log("Error al consultar getEventsImages por nombre " + err);
          resolve([]);
        }
        if (events) {
          resolve(events);
          console.log("events query Tevo >>> " + JSON.stringify(events));
        }
      }
    );
  });
};

var getEvent = (event_name = "") => {
  return new Promise((resolve, reject) => {
    EventsModel.findOne({
        value: event_name
      }, {}, {
        sort: {
          event_name: -1
        }
      },
      function (err, foundEvent) {
        if (!err) {
          console.log(foundEvent);
          if (null != foundEvent) {
            resolve(foundEvent);
          } else {
            resolve({});
          }
        } else {
          resolve({});
        }
      }
    );
  });
};

var newEvent = (value = "", synonyms = "", images = {}) => {
  return new Promise((resolve, reject) => {
    getEvent(value).then(foundEvent => {
      if (isDefined(foundEvent.value)) {
        if (isDefined(images.url)) {
          foundEvent.images.concat([images]);
        }

        foundEvent.save(function (err, eventSaved) {
          if (!err) {
            console.log(
              "Events images Updated!!! " + JSON.stringify(eventSaved.value)
            );
            resolve(eventSaved);
          } else {
            console.log("Error actualizando las imagenes del evento " + err);
            resolve(undefined);
          }
        });
      } else {
        var event = new EventsModel();

        event.value = value;
        event.synonyms.concat([value]);
        if (isDefined(images.url)) {
          event.images.concat([images]);
        }

        event.save(function (err, eventSaved) {
          if (!err) {
            console.log(
              "Event Saved!!! " + JSON.stringify(eventSaved.value)
            );
            resolve(eventSaved);
          } else {
            console.log("Error guardando en userdatas " + err);
            resolve(undefined);
          }
        });
      }
    });
  });
};

module.exports = {
  getEventsImages,
  newEvent,
  getEvent

};