 var EstablishmentModel = require('../establishment');
 var moment = require('moment');



 var getEstablishmentById = (establishment_id) => {
     return new Promise((resolve, reject) => {
         EstablishmentModel
             .find({
                 id: establishment_id
             })
             .sort({
                 value: 'asc'
             } /*ordenamiento*/ )
             .exec(
                 (err, establishments) => {
                     if (err) {
                         console.log('Error al consultar establishment por Id ' + err)
                         reject(err)

                     }
                     if (!establishments) {
                         console.log('Error al consultar establishment por Id ' + err)
                         reject(err)
                     }
                     if (establishments) {


                         resolve(establishments)
                         //console.log("cuisines zomato >>> " + JSON.stringify(cuisines));
                     }
                 });
     })
 }



 var getEstablishmentByName = (establishment_name) => {
     return new Promise((resolve, reject) => {
         EstablishmentModel.find({
             name: {
                 $regex: new RegExp(establishment_name, "ig")
             }
         }, function (err, Establishments) {
             if (err) {
                 console.log('Error al consultar  getEstablishmentByName ' + err)
                 reject(err)

             }
             if (!Establishments) {
                 console.log('Error al consultar cuisine en   getCuisine !' + err)
                 reject(err)
             }
             if (Establishments) {
                 resolve(Establishments)
                 console.log("Establishments zomato  >>> " + JSON.stringify(Establishments));
             }
         });

     })
 }






 var getEstablishmentsForAI = () => {
     return new Promise((resolve, reject) => {
         EstablishmentModel.find({

             }, {
                 value: 1,
                 synonyms: 1,
                 _id: 0
             },

             function (err, Establishments) {
                 if (err) {
                     console.log('Error al consultar getEstablishmentForAI ' + err)
                     reject(err)

                 }
                 if (!Establishments) {
                     console.log('Error al consultar getEstablishmentForAI !' + err)
                     reject(err)
                 }
                 if (Establishments) {
                     resolve(Establishments)
                     //console.log("getCuisinesForAI  >>> " + JSON.stringify(Establishments));
                 }
             });

     })
 }


 module.exports = {
   getEstablishmentById,
   getEstablishmentByName,
   getEstablishmentsForAI,
   
 }