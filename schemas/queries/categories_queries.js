var UserData = require('../../bot/userinfo');
var CategoryModel = require('../category');
var moment = require('moment');



var getIdCategories1 = (event_type) => {
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



var getIdCategories = (event_type) => {
    return new Promise((resolve, reject) => {
        db.collection.find({
            name: {
                $regex: new RegExp(event_type, "ig")
            }
        }, function (err, categories) {
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