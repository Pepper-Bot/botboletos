var express = require('express');
var router = express.Router();
var UserData2 = require('../schemas/userinfo');
/* GET home page. */


router.get('/', function(req, res) {
 	   
	if(undefined == req.query.id)
	{
		res.status(200);
		res.send('Error trying to access');
		res.end();
		return;
	}
	UserData2.findOne({fbId: req.query.id}, {}, { sort: { 'sessionStart' : -1 } }, function(err, result) 
	{	
		console.log('Dentro de redirect');

		console.log(result);
		console.log(req.query.id);
		result.urlsVisited.push(req.query.u);
		
		result.save(function(err){

			if(!err){

				console.log('URL guardada exitosamente');
				var urlLocation = req.query.u;
				console.log(urlLocation.slice(0,-1));
				res.redirect(urlLocation.slice(0,-1));
				res.end();
			}
			else
			{
				res.send('Sorry something wrong happened');
				res.end();
				console.log('Error');
			}
		});
 	});
});




module.exports = router;