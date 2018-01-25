var UserData = require('../../bot/userinfo');
var CategoryModel = require('../category');
var moment = require('moment');



var getIdCategories = (event_type) => {
    return new Promise((resolve, reject) => {
        CategoryModel
            .find({
                name: {
                    $regex: '".*' + event_type + '.*"',
                    $options: 'i'
                }
            })
            .sort({
                value: 'asc'
            } /*ordenamiento*/ )
            .exec(
                (err, categories) => {
                    if (err) {
                        console.log('Error al consultar categorias por nombre getIdCategories ' + err)
                        reject(err)

                    }
                    if (!categories) {
                        console.log('Error al consultar categorias por nombre getIdCategories ' + err)
                        reject(err)
                    }
                    if (categories) {
                        resolve(categories)
                        console.log("categories query Tevo >>> " + JSON.stringify(categories));
                    }
                });
    })
}



module.exports = {
    getIdCategories

}