var express = require('express');
var router = express.Router();




router.post('/', function(req, res) {


	var express = require('express');
	var router = express.Router();
	var Message = require('../bot/messages');
	var UserData2 = require('../schemas/userinfo');
	var gis = require('g-i-s'); // Google images
	var moment = require('moment');
	/* GET home page. */
	
	var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
	var teClient = new TevoClient(
	{
		apiToken: process.env.API_TOKEN,
		apiSecretKey: process.env.API_SECRET_KEY
	});
	
	
	router.post('/', function(req, res) {
	
	
		  var event_id = req.query.event_id;
		  var fbId = req.query.uid;
		  var venue_id = req.query.venue_id;
		  var event_name = req.query.event_name;
		  var performer_id = req.query.performer_id;
		  var event_date = req.query.event_date;
		  var section = req.query.section;
		  var row = req.query.row;
		  var quantity = req.query.userticketsquantity;
		  var price = req.query.priceticket;
		  var format = req.query.format;
		  var eticket = req.query.eticket;
	
	
		if(undefined == req.query.uid)
		{
			res.status(200);
			res.send('Error trying to access');
			res.end();
			return;
		}
	
		UserData2.findOne({fbId: fbId}, {}, { sort: { 'sessionStart' : -1 } }, function(err, result)
		{
	
			if(result)
			{
	
			console.log('Checkout.js');
			console.log('------------------------');
	
	
			console.log(result);
	
			var headerHtml = '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <base href="https://ticketdelivery.herokuapp.com/"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Ticket Checkout</title> <base href="https://ticketdelivery.herokuapp.com/"> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/> </head> <body> <div class="container"> <div class="section"> <div class="row"> <div class="col m12 m4"> <h4 class="header left blue-text">Checkout Process</small></h4> <table class="table-responsive "> <thead> <tr> <th>Event</th> <th>Date</th> <th>Seats</th> <th> Quantity</th> <th>Price Each</th> </tr> </thead> <tbody> <tr> <td>'+ event_name+'</td> <td>'+moment(event_date).format('MMMM Do YYYY, h:mm:ss a')+'</td> <td><b>Section:</b>'+section+' <br> <b>Row</b>: '+row+' </td> <td>'+quantity+'</td> <td>$'+price+'</td> </tr> <tr> <td><b>Ticket Type: </b> <span class="new badge green">'+format+' </<span> </td> <td colspan="2"></td> <td><strong>Total</strong></td> <td>$'+(quantity * price)+'</td> </tr> </tbody> </table> </div> </div> </div>';
			//var form = ' <div class="row"> <div class="col m12 m4"> <form action="/pay/?uid='+fbId+'" method="post" class="col s12"> <input type="hidden" value="'+event_date+'" name="event_date"> <input type="hidden" value="'+section+'" name="section"> <input type="hidden" value="'+row+'" name="row"> <input type="hidden" value="'+event_name+'" name="event_name"> <input type="hidden" value="'+price+'" name="price"> <input type="hidden" value="'+quantity+'" name="quantity"> <input type="hidden" value="'+req.query.format+'" name="format"> <input type="hidden" value="'+req.query.groupticket_id+'" name="groupticket_id"> <div class="row"> <h5 class="blue-text">Billing Information.</h5 class="blue-text"> <div class="input-field col s12"> <input id="firstname" name="firstname" value="'+result.firstName+'" type="text" class="validate"> <label for="firstname">Fist Name</label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="lastname" value="'+result.LastName+'" name="lastname" type="text" class="validate"> <label for="lastname">Last Name</label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_address" name="billing_address" type="text" class="validate"> <label for="billing_address">Billing Address</label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_city" name="billing_city" type="text" class="validate"> <label for="billing_city">City</label> </div> </div> <div class="row"> <div class="input-field col s12"> <input type="text" id="billing_country" name="billing_country" class="autocomplete"> <label for="billing_country">Country</label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_zipcode" name="billing_zipcode" type="text" class="validate"> <label for="billing_zipcode">Zip Code</label> </div> </div> <!-- Select Basic --> <div class="row"> <label for="billing_state">State </label> <div class="input-field col s12"> <select id="billing_state" name="billing_state" class="form-control"> <option value="" selected="selected">Select…</option> <option value="Outside the U.S.">Outside the U.S.</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option> </select> </div> </div> <h5 class="blue-text">Shipping Information.</h5 class="blue-text"> <!-- Text input--> <div class="row"> <div> <input type="checkbox" value="1" id="same_as_ship" name="same_as_ship" /> <label for="same_as_ship">Same as Billing Address</label> </div> </div> <div id="shipping_form"> <div class="row"> <div class="input-field col s12"> <input id="ship_address" name="ship_address" type="text" class="validate" value=" " required=""> <label for="ship_address">Shipping Address</label> </div> </div> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="city" name="city" type="text" class="validate" value=" " required=""> <label for="city">City</label> </div> </div> <!-- Select Basic --> <div class="row"> <div class="input-field col s12"> <input type="text" id="country" name="country" class="autocomplete"> <label for="country">Country</label> </div> </div> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="zipcode" name="zipcode" value=" " type="text" class="validate" required=""> <label for="zipcode">Zip Code </label> </div> </div> <!-- Select Basic --> <div class="row"> <label for="state">State </label> <div class="input-field col s12"> <select id="state" name="state" class="form-control"> <option value=" " selected="selected">Select…</option> <option value="Outside the U.S.">Outside the U.S.</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option> </select> </div> </div> </div> <h5 class="blue-text">Contact Information.</h5 class="blue-text"> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="email" name="email" type="text" class="validate" required=""> <label for="email">Email</label> </div> </div> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="phone" name="phone" type="text" class="validate" required=""> <label for="phone">Daytime phone</label> </div> </div> <!-- Select Basic --> <h5 class="blue-text">Payment Information.</h5 class="blue-text"> <div class="row"> <div class="input-field col s12"> <input id="cc" name="cc" type="text" class="validate" required=""> <label for="cc">Credit Card # </label> </div> </div> <div class="row"> <div class="input-field col s12"> <select id="exp_month" name="exp_month" class="form-control"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> <option value="9">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> </select> <label for="exp_month">Exp Month </label> </div> </div> <!-- Select Basic --> <div class="row"> <div class="input-field col s12"> <select id="exp_year" name="exp_year" class="form-control"> <option value="2017">2017</option> <option value="2018">2018</option> <option value="2019">2019</option> <option value="2020">2020</option> <option value="2021">2021</option> <option value="2022">2022</option> <option value="2023">2023</option> <option value="2024">2024</option> <option value="2025">2025</option> <option value="2026">2026</option> <option value="2027">2027</option> <option value="2028">2028</option> <option value="2029">2029</option> <option value="2030">2030</option> <option value="2031">2031</option> <option value="2032">2032</option> </select> <label for="exp_year">Exp Year </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="cvv" name="cvv" type="text" placeholder="Security Code / CVV" class="text-blue" required=""> <label for="cvv">Security Code </label> </div> </div> <div class="row"> <div class="col-md-4"> <button id="checkout" name="checkout" class="btn blue">Check out</button> </div> </div> </form> </div> </div> </div>';
			var form = '<div class="row"> <div class="col m12 m4"> <form action="/pay/?uid='+fbId+'" method="post" class="col s12" name="checkout"> <input type="hidden" value="'+event_date+'" name="event_date"> <input type="hidden" value="'+section+'" name="section"> <input type="hidden" value="'+row+'" name="row"> <input type="hidden" value="'+event_name+'" name="event_name"> <input type="hidden" value="'+price+'" name="price"> <input type="hidden" value="'+quantity+'" name="quantity"> <input type="hidden" value="'+req.query.format+'" name="format"> <input type="hidden" value="'+req.query.groupticket_id+'" name="groupticket_id"> <div class="row"> <h5 class="blue-text"> Billing Information.</h5 class="blue-text"> <div class="input-field col s12"> <input id="firstname" name="firstname" value="'+result.firstName+'" type="text" class="validate"> <label for="firstname">Fist Name </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="lastname" value="'+result.LastName+'" name="lastname" type="text" class="validate"> <label for="lastname">Last Name </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_address" name="billing_address" type="text" class="validate" required> <label for="billing_address">Billing Address </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_zipcode" required name="billing_zipcode" type="number" max="99999" class="validate"> <label for="billing_zipcode">Zip Code </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="billing_city" required name="billing_city" type="text" class="validate"> <label for="billing_city">City </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input type="text" id="billing_country" required name="billing_country" class="autocomplete"> <label for="billing_country">Country </label> </div> </div> <!-- Select Basic --> <div class="row"> <div class="input-field col s12"> <input type="text" required class="validate" id="billing_state" name="billing_state" class="form-control"><label for="billing_state">State </label>  </div> </div>';
	
	
		// colocar no igual a eticket
				if(req.query.format != 'Eticket')
				{
					form += '<h5 class="blue-text"> Shipping Information.</h5 class="blue-text"> <!-- Text input--> <div class="row"> <div> <input type="checkbox" value="1" id="same_as_ship" name="same_as_ship" /> <label for="same_as_ship">Same as Billing Address </label> </div> </div> <div id="shipping_form"> <div class="row"> <div class="input-field col s12"> <input id="ship_address" name="ship_address" type="text" class="validate" value=" " required=""> <label for="ship_address">Shipping Address </label> </div> </div> <!-- Text input-->  <div class="row"> <div class="input-field col s12"> <input id="zipcode" name="zipcode" value=" " type="number" class="validate" required=""> <label for="zipcode">Zip Code </label> </div> </div>  <!-- fin shipping address --> <div class="row"> <div class="input-field col s12"> <input id="city" name="city" type="text" class="validate" value=" " required=""> <label for="city">City </label> </div> </div> <!-- Select Basic --> <div class="row"> <div class="input-field col s12"> <input type="text" id="country" name="country" class="autocomplete"> <label for="country">Country </label> </div> </div> <!-- Text input--> <!-- Select Basic --> <div class="row">  <div class="input-field col s12"> <input type="text" class="validate" required="" id="state" name="state" class="form-control"><label for="state">State </label> </div> </div> </div>';
				}
	
	
	
				form += '<h5 class="blue-text"> Contact Information.</h5 class="blue-text"> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$" name="email" type="email" class="validate" required=""> <label for="email">Email </label> </div> </div> <!-- Text input--> <div class="row"> <div class="input-field col s12"> <input id="phone" name="phone" type="text" class="validate" required=""> <label for="phone">Daytime phone </label> </div> </div> <!-- Select Basic --> <h5 class="blue-text"> Payment Information.</h5 class="blue-text"> <div class="row"> <div class="input-field col s12"> <input id="cc" maxlength="16" name="cc" max="9999999999999999" type="number" class="validate" required=""> <label for="cc">Credit Card # </label> </div> </div> <div class="row"> <div class="input-field col s12"> <select id="exp_month" name="exp_month" class="form-control validate"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> <option value="9">9</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> </select> <label for="exp_month">Exp Month </label> </div> </div> <!-- Select Basic --> <div class="row"> <div class="input-field col s12"> <select id="exp_year" required name="exp_year" class="form-control validate"> <option value="2017">2017</option> <option value="2018">2018</option> <option value="2019">2019</option> <option value="2020">2020</option> <option value="2021">2021</option> <option value="2022">2022</option> <option value="2023">2023</option> <option value="2024">2024</option> <option value="2025">2025</option> <option value="2026">2026</option> <option value="2027">2027</option> <option value="2028">2028</option> <option value="2029">2029</option> <option value="2030">2030</option> <option value="2031">2031</option> <option value="2032">2032</option> </select> <label for="exp_year">Exp Year </label> </div> </div> <div class="row"> <div class="input-field col s12"> <input id="cvv" required maxlength="3" name="cvv" type="number" max="999" placeholder="Security Code / CVV" class="text-blue validate"> <label for="cvv">Security Code </label> </div> </div> <div class="row"> <div class="col-md-4"> <button id="checkout" name="checkout" class="btn blue">Check out</button> </div> </div> </form> </div></div></div>';
			var footer = '<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script> <script type="text/javascript" src="js/materialize.min.js"></script> <script>$(document).ready(function() { $(\'select\').material_select(); $(\'input.autocomplete\').autocomplete({ data: { "United States":null, "Afghanistan":null, "Albania": null, "Algeria":null, "American Samoa":null, "Andorra":null, "Angola":null, "Anguilla": null, "Antarctica": null, "Antigua And Barbuda": null, "Argentina": null, "Armenia": null, "Aruba": null, "Australia": null, "Austria": null, "Azerbaijan": null, "Bahamas": null, "Bahrain": null, "Bangladesh": null, "Barbados": null, "Belarus": null, "Belgium": null, "Belize": null, "Benin": null, "Bermuda":null, "Bhutan":null, "Bolivia": null, "Bosnia And Herzegovina": null, "Botswana": null, "Bouvet Island":null, "Brazil":null, "British Indian Ocean Territory":null, "Brunei Darussalam":null, "Bulgaria":null, "Burkina Faso": null, "Burundi": null, "Cambodia": null, "Cameroon": null, "Canada": null, "Cape Verde": null, "Cayman Islands": null, "Central African Republic": null, "Chad":null, "Chile": null, "China": null, "Christmas Island": null, "Cocos (Keeling) Islands": null, "Colombia": null, "Comoros": null, "Congo":null, "The Democratic Republic Of The Congo":null, "Cook Islands":null, "Costa Rica":null, "Cote D Ivoire":null, "Croatia":null, "Cuba": null, "Cyprus": null, "Czech Republic": null, "Denmark": null, "Djibouti": null, "Dominica": null, "Dominican Republic": null, "East Timor": null, "Ecuador": null, "Egypt": null, "El Salvador": null, "Equatorial Guinea": null, "Eritrea": null, "Estonia": null, "Ethiopia": null, "Falkland Islands (Malvinas)": null, "Faroe Islands": null, "Fiji":null, "Finland":null, "France":null, "French Guiana":null, "French Polynesia":null, "French Southern Territories":null, "Gabon":null, "Gambia":null, "Georgia":null, "Germany":null, "Ghana":null, "Gibraltar":null, "Greece":null, "Greenland":null, "Grenada":null, "Guadeloupe":null, "Guam":null, "Guatemala":null, "Guinea":null, "Guinea-Bissau":null, "Guyana":null, "Haiti":null, "Heard Island And Mcdonald Islands":null, "Holy See (Vatican City State)":null, "Honduras":null, "Hong Kong":null, "Hungary":null, "Iceland":null, "India":null, "Indonesia":null, "Islamic Republic Of Iran": null, "Iraq":null, "Ireland":null, "Israel":null, "Italy":null, "Jamaica":null, "Japan":null, "Jordan":null, "Kazakstan":null, "Kenya":null, "Kiribati":null, "Democratic Peoples Republic Of Korea":null, "Korean Republic":null, "Kuwait":null, "Kyrgyzstan":null, "Lao Peoples Democratic Republic":null, "Latvia":null, "Lebanon":null, "Lesotho":null, "Liberia":null, "Libyan Arab Jamahiriya":null, "Liechtenstein":null, "Lithuania":null, "Luxembourg":null, "Macau":null, "The Former Yugoslav Republic Of Macedonia":null, "Madagascar":null, "Malawi":null, "Malaysia":null, "Maldives":null, "Mali":null, "Malta":null, "Marshall Islands":null, "Martinique": null, "Mauritania": null, "Mauritius": null, "Mayotte":null, "Mexico":null, "Federated States Of Micronesia": null, "Republic of Moldova":null, "Monaco": null, "Mongolia":null, "Montserrat":null, "Morocco":null, "Mozambique":null, "Myanmar":null, "Namibia":null, "Nauru":null, "Nepal":null, "Netherlands":null, "Netherlands Antilles": null, "New Caledonia": null, "New Zealand": null, "Nicaragua": null, "Niger":null, "Nigeria":null, "Niue":null, "Norfolk Island":null, "Northern Mariana Islands":null, "Norway": null, "Oman": null, "Pakistan": null, "Palau": null, "Palestinian Territory": null, "Panama": null, "Papua New Guinea": null, "Paraguay":null, "Peru": null, "Philippines": null, "Pitcairn": null, "Poland": null, "Portugal": null, "Puerto Rico": null, "Qatar": null, "Reunion": null, "Romania": null, "Russian Federation": null, "Rwanda":null, "Saint Helena":null, "Saint Kitts And Nevis": null, "Saint Lucia": null, "Saint Pierre And Miquelon": null, "Saint Vincent And The Grenadines":null, "Samoa":null, "San Marino":null, "Santo Tome And Principe":null, "Saudi Arabia": null, "Senegal": null, "Seychelles": null, "Sierra Leone": null, "Singapore": null, "Slovakia": null, "Slovenia": null, "Solomon Islands": null, "Somalia": null, "South Africa": null, "South Georgia And The South Sandwich Islands":null, "Spain": null, "Sri Lanka": null, "Sudan": null, "Suriname": null, "Svalbard And Jan Mayen": null, "Swaziland":null, "Sweden": null, "Switzerland": null, "Syrian Arab Republic": null, "Province Of China Taiwan": null, "Tajikistan": null, "United Republic Of Tanzania": null, "Thailand": null, "Togo": null, "Tokelau": null, "Tonga": null, "Trinidad And Tobago": null, "Tunisia": null, "Turkey": null, "Turkmenistan": null, "Turks And Caicos Islands":null, "Tuvalu":null, "Uganda":null, "Ukraine": null, "United Arab Emirates":null, "United Kingdom": null, "United States Minor Outlying Islands": null, "Uruguay": null, "Uzbekistan":null, "Vanuatu":null, "Venezuela":null, "Viet Nam":null, "Virgin Islands, British": null, "Virgin Islands, U.S.":null, "Wallis And Futuna": null, "Western Sahara":null, "Yemen":null, "Yugoslavia":null, "Zambia": null, "Zimbabwe":null }, limit: 20, onAutocomplete: function(val) { }, minLength: 1 }); }); </script> <script> $(document).ready(function(){ $("#same_as_ship").on("click", function(e){ if($(this).is(":checked")) { $("#shipping_form").hide(); $("#ship_address").attr("disabled","disabled");$("#zipcode").attr("disabled","disabled");$("#city").attr("disabled","disabled");$("#state").attr("disabled","disabled");$("#country").attr("disabled","disabled");} else {  $("#ship_address").removeAttr("disabled","disabled");$("#zipcode").removeAttr("disabled","disabled");$("#city").removeAttr("disabled","disabled");$("#state").removeAttr("disabled","disabled");$("#country").removeAttr("disabled","disabled"); $("#shipping_form").show();  } }); }); </script> </body></html>';
				res.send(headerHtml + form + footer);
			}
		 });
	});
	
	module.exports = router;
});

module.exports = router;