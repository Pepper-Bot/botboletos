var express = require('express');
var router = express.Router();


let personas = [{
        id: 1,
        nombre: "Mariel"
    },
    {
        id: 2,
        nombre: "Leonardo"
    },
    {
        id: 3,
        nombre: "Pepito"
    }
];

router.get('/', (req, res) => {
    //primero nombre del archivo y el segundo la lista de parametros con la que funciona el archivo...
    res.render(
        './layouts/tickets/login', {
            titulo: "Your tickets are on its way!",
            personas : personas
        }
    );


});

module.exports = router;