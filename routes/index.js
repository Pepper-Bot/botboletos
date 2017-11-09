var express = require('express');
var router = express.Router();
var UserData = require('../schemas/userinfo');
var MLinkController = require("../dbAPI/controllers/mlink.controller");
var checkBuy  = require ("../routes/checkout")


/* GET home page. */

var headHTML = '<!doctype html><html> <head> <script src="https://code.jquery.com/jquery-1.12.4.js"></script><link href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css" rel="stylesheet"><script src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script><meta charset="utf-8"> <meta name="description" content=""> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Pepper Bot Data</title> <link rel="stylesheet" href="css/style.css"> <link rel="author" href="humans.txt"> <!-- Latest compiled and minified CSS --><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"><!-- Optional theme --><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"> </head> <body> <div class="container"> <div class="page-header"> <h1>Peppers Bot Data</h1> </div> <div class="row"> <div class="col-xs-12"> <table cellpadding="1" cellspacing="2" class="table-responsive table-hover" style="width:100%;text-align:center;" id="datos"> <caption>Session Data</caption> <thead> <tr> <th>Picture</th> <th>FB ID</th> <th>First Name</th> <th>Last Name</th> <th>Locale</th> <th>Time Zone</th> <th>Gender</th> <th>Session Started</th> <th>Session End</th> <th>Location</th> <th>Options selected</th><th>Cards Selected</th> </tr> </thead> <tbody>';
var footHTML = '</tbody> </table> </div> </div> </div> <script> var table = $("#datos").DataTable({"paging":   true,"ordering": false,"info":     false}); </script> <!-- Latest compiled and minified JavaScript --><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> </body></html>';
router.get('/', function (req, res) {

	UserData.find({}, {}, {
		sort: {
			'sessionStart': 1
		}
	}, function (err, result) {

		console.log(result);
		var table = '';
		for (var i = 0, c = result.length; i < c; i++) {

			table += '<tr><td><img src="' + result[i].profilePic + '" style="width:100px;"></td><td>' + result[i].fbId + '</td><td>' + result[i].firstName + '</td><td>' + result[i].LastName + '</td><td>' + result[i].locale + '</td><td> GMT ' + result[i].timeZone + '</td>	<td>' + result[i].gender + '</td><td>' + result[i].sessionStart + '</td><td>' + result[i].sessionEnd + '</td><td><a href="' + result[i].locationURL + '" target="_blank">View Location</a></td>';
			table += '<td>';
			for (var j = 0, x = result[i].optionsSelected.length; j < x; j++) {
				table += result[i].optionsSelected[j] + '\n<br>';
			}

			table += '</td>';

			table += '<td>';
			for (var k = 0, y = result[i].urlsVisited.length; k < y; k++) {
				table += '<a href="' + result[i].urlsVisited[k] + '" target="_blank">' + result[i].urlsVisited[k] + '</a>\n<br>';
			}
			table += '</td>';

			table += '</tr>';

		}

		res.status(200).send(headHTML + table + footHTML);

	});






});



router.get("/api/saludar/:nombre?", MLinkController.saludar);
router.get("/api/mlink/:id?", MLinkController.getMlink);
router.get("/api/mlinks", MLinkController.getMlinks);

router.get("/api/mlinks/:mlink", MLinkController.getMlinkByMLink);

router.post("/api/mlink", MLinkController.createMlink);
router.put("/api/mlink/:id", MLinkController.updateMlink);
router.delete("/api/mlink/:id", MLinkController.deleteMlink);

router.get("/api/event-name/:ticket_group_id", MLinkController.searchEventName);
router.get("/api/events/:name", MLinkController.searchEventByName);
router.get("/api/events1/:name", MLinkController.searchEventByName1);

router.get("/api/categories", MLinkController.searchCategories);
router.get("/api/categories/:category_name", MLinkController.searchParents);
router.get("/api/categories/parent/:parent_id", MLinkController.searchCategoriesByParentId);
router.get("/api/events/category/:category_id", MLinkController.searchEventsByCategoryId);
router.get("/api/events/category/:category_id/occurs_at_gte/:occurs_at_gte/occurs_at_lte/:occurs_at_lte", MLinkController.searchEventsByCategoryIdAndDate);


router.get("/api/events/:name/occurs_at_gte/:occurs_at_gte/occurs_at_lte/:occurs_at_lte",
	MLinkController.searchEventByNameAndDate);

router.get("/api/events/category/:category_id/lat/:lat/lon/:lon",
	MLinkController.searchEventsByCategoryIdAndLocation);


router.post("/checkout/", checkBuy.checkout );

module.exports = router;