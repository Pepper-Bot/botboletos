const GoogleImages = require("google-images");

const GOOGLE_IMAGES_CSE_ID = "001848914505933683477:ztrtbvk1neq";
const GOOGLE_IMAGES_API_KEY = "AIzaSyB4hIHbBJntl27MN-gHSk35RtCfj3axnMs";
                               //AIzaSyAo84VfO9Wet8DdshB9aqsOLWHnk6-Ps-c

const client = new GoogleImages(GOOGLE_IMAGES_CSE_ID, GOOGLE_IMAGES_API_KEY);

var getGoogleImage = (search,  matriz = [], q ={}) => {
  return new Promise((resolve, reject) => {
    client
      .search(search, q)
      .then(images => {
        console.log(`Resultado de Imagenes ${JSON.stringify(images)}`);
        resolve(images, matriz);
      })
      .catch(error => {
        console.log(`Error  ${JSON.stringify(error)}`);
        reject(error);
      });
  });
};
// paginate results
//client.search("Steve Angello", { page: 2 });

// search for certain size
//client.search("Steve Angello", { size: "large" });

module.exports = {
  getGoogleImage
};
