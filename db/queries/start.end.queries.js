var StartEndSchema = require("../schemas/start.end.schema");

/**
 * @description createUpdateStartEnd
 */
var createUpdateStartEnd = () => {
  return new Promise((resolve, reject) => {
    StartEndSchema.findOne(
      {
        toogle: true
      },
      {},
      {
        sort: {
          toogle: -1
        }
      },
      function(err, startEnd) {
        if (null != startEnd) {
          startEnd.toogle = !startEnd.toogle;

          startEnd.save(function(err, startEndUpdated) {
            if (!err) {
              console.log(
                "startEndUpdated !!! " + JSON.stringify(startEndUpdated.id)
              );

              resolve(startEndUpdated);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        } else {
          let startEnd = new StartEndSchema();
          startEnd.toogle = false;

          startEnd.save(function(err, startEndSaved) {
            if (!err) {
              console.log(
                "startEndSaved !!! " + JSON.stringify(startEndSaved.id)
              );

              resolve(startEndSaved);
            } else {
              console.log("Error guardando en userdatas " + err);
            }
          });
        }
      }
    );
  });
};

/**
 * ================================================
 * @description función para buscar un registro con toogle =true
 * ================================================
 */
var searchToogle = () => {
  return new Promise((resolve, reject) => {
    StartEndSchema.findOne(
      {
        toogle: true
      },
      {},
      {
        sort: {
          toogle: -1
        }
      },
      function(err, startEnd) {
        if (err) {
            resolve({})
        } else {
          if (null != startEnd) {
            resolve(startEnd);
          } else {
            resolve({});
          }
        }
      }
    );
  });
};


module.exports = {
    createUpdateStartEnd,
    searchToogle
}