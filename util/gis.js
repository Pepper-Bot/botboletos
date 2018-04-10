var gis = require("g-i-s");
var getGoogleImage = (search, matriz = []) => {
  return new Promise((resolve, reject) => {
    gis(search, logResults);

    function logResults(error, results) {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          resolve(results);
        } else {
          resolve([]);
        }
      }
    }
  });
};




module.exports = {
  getGoogleImage
};
