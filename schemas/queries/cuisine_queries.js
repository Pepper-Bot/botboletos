 var CusineModel = require('../cuisine');
 var moment = require('moment');



 var getCuisineById = (cuisine_id) => {
     return new Promise((resolve, reject) => {
         CusineModel
             .find({
                 id: cuisine_id
             })
             .sort({
                 value: 'asc'
             } /*ordenamiento*/ )
             .exec(
                 (err, cuisines) => {
                     if (err) {
                         console.log('Error al consultar cuisines por Id ' + err)
                         reject(err)

                     }
                     if (!cuisines) {
                         console.log('Error al consultar cuisines por Id ' + err)
                         reject(err)
                     }
                     if (cuisines) {


                         resolve(cuisines)
                         //console.log("cuisines zomato >>> " + JSON.stringify(cuisines));
                     }
                 });
     })
 }



 var getCuisineByName = (cuisine_name) => {
     return new Promise((resolve, reject) => {
         CusineModel.find({
             name: {
                 $regex: new RegExp(cuisine_name, "ig")
             }
         }, function (err, cusines) {
             if (err) {
                 console.log('Error al consultar cuisine en   getCuisine ' + err)
                 reject(err)

             }
             if (!cusines) {
                 console.log('Error al consultar cuisine en   getCuisine !' + err)
                 reject(err)
             }
             if (cusines) {
                 resolve(cusines)
                 console.log("cusines zomato  >>> " + JSON.stringify(cusines));
             }
         });

     })
 }






 var getCuisinesForAI = () => {
     return new Promise((resolve, reject) => {
         CusineModel.find({

             }, {
                 value: 1,
                 synonyms: 1,
                 _id: 0
             },

             function (err, cusines) {
                 if (err) {
                     console.log('Error al consultar cuisine en   getCuisine ' + err)
                     reject(err)

                 }
                 if (!cusines) {
                     console.log('Error al consultar cuisine en   getCuisine !' + err)
                     reject(err)
                 }
                 if (cusines) {
                     resolve(cusines)
                     console.log("getCuisinesForAI  >>> " + JSON.stringify(cusines));
                 }
             });

     })
 }


 module.exports = {
     getCuisineById,
     getCuisineByName,
     getCuisinesForAI,

 }