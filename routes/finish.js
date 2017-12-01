/**
	Modulo de finalización de orden


*/

var express = require('express');
var router = express.Router();
var Message = require('../bot/messages');
var UserData2 = require('../schemas/userinfo');
var Client = require('../schemas/clients');
var gis = require('g-i-s'); // Google images
var moment = require('moment');
var nodemailer = require('nodemailer');
/* GET home page. */
var domain = 'mydomain.mailgun.org';
var mailgun = require('mailgun-js')({
	apiKey: 'key-9c293f6c3094bc30754f2de0c8e5b353',
	domain: 'sandboxbaf8618216ff422db760f693e260987f.mailgun.org'
});
var Orders = require('../schemas/orders');

var tevo = require('../config/config_vars').tevo;


var TevoClient = require('ticketevolution-node'); // modulo de Ticket Evolution requests
var tevoClient = new TevoClient({
  apiToken: tevo.API_TOKEN,
  apiSecretKey: tevo.API_SECRET_KEY
});

router.post('/', function (req, res) {



	// Si no hay ID de Facebook ( osea no hay session nos salimos).

	if (undefined == req.query.uid) {
		res.status(200);
		res.send('Error trying to access');
		res.end();
		return;
	}


	/* Obtenemos la session guardada en mongo db */
	Client.findOne({
		fbId: req.query.uid
	}, {}, {
		sort: {
			'sessionStart': -1
		}
	}, function (err, result) {

		// Verificamoas el tipo de ticket.
		// Si es Eticket o Fisco para planear el request.
		if (req.body.format == 'Eticket') {


			var orderData = {
				"orders": [{
					"shipped_items": [{
						"items": [{
							"ticket_group_id": req.body.ticket_group_id,
							"price": req.body.price_per_ticket,
							"quantity": req.body.quantity,
						}],
						"type": "Eticket",
						"email_address_id": result.email_id
					}],
					"billing_address_id": result.billing_address_id[result.billing_address_id.length - 1],
					"payments": [{

						"type": "credit_card",
						"amount": (parseFloat(req.body.price_per_ticket * req.body.quantity).toFixed(2)),
						"credit_card_id": result.creditcard_id[result.creditcard_id.length - 1]
					}],
					"seller_id": process.env.OFFICE_ID,
					"client_id": result.client_id,
					"created_by_ip_address": '',
					"instructions": "",
					"shipping": req.body.shipping_price,
					"service_fee": 0.00,
					"additional_expense": 0.00,
					"tax": 0.00,
					"discount": 0.00,
					"promo_code": ""
				}]
			};
		} else {
			var orderData = {
				"orders": [{
					"shipped_items": [{
						"items": [{
							"ticket_group_id": req.body.ticket_group_id,
							"price": req.body.price_per_ticket,
							"quantity": req.body.quantity,
						}],
						"phone_number_id": result.phone_id,
						"service_type": "LEAST_EXPENSIVE",
						"type": "FedEx",
						"address_id": result.address_id[result.address_id.length - 1],
						"ship_to_name": result.fullName,
						"address_attributes": {
							"name": req.body.name2,
							"street_address": req.body.street_address,
							"extendend_address": req.body.extendend_address,
							"locality": req.body.locality,
							"region": req.body.region,
							"country_code": req.body.country_code,
							"postal_code": req.body.postal_code,
							"label": "shipping"
						}

					}],
					"billing_address_id": result.billing_address_id[result.billing_address_id.length - 1],
					"payments": [{

						"type": "credit_card",
						"amount": (parseFloat(req.body.price_per_ticket * req.body.quantity).toFixed(2)),
						"credit_card_id": result.creditcard_id[result.creditcard_id.length - 1]
					}],
					"seller_id": process.env.OFFICE_ID,
					"client_id": result.client_id,
					"created_by_ip_address": "",
					"instructions": "",
					"shipping_address": {
						"name": req.body.name2,
						"street_address": req.body.street_address,
						"extendend_address": req.body.extendend_address,
						"locality": req.body.locality,
						"region": req.body.region,
						"country_code": req.body.country_code,
						"postal_code": req.body.postal_code,
						"label": "shipping"
					},
					"shipping": req.body.shipping_price,
					"service_fee": 0.00,
					"additional_expense": 0.00,
					"tax": 0.00,
					"discount": 0.00,
					"promo_code": ""
				}]
			}
		}
		console.log(JSON.stringify(orderData));


		// Realizamos la orden.
		var createOrder = tevo.API_URL + 'orders'


		tevoClient.postJSON(createOrder, orderData).then((json) => {


			// Hay error? mostramos error y salimos
			if (json.error != undefined) {

				res.send('<b>' + json.error + '</b>');

				res.end();
				return;
			}


			// obtenemos la informacion de la orden del JSON.

			var nombreCliente = json.orders[0].buyer.name;
			var eventoNombre = json.orders[0].items[0].ticket_group.event.name;
			var ciudadEvento = json.orders[0].items[0].ticket_group.event.venue.address.locality + ', ' + json.orders[0].items[0].ticket_group.event.venue.address.region;
			var fechaEvento = moment(json.orders[0].items[0].ticket_group.event.occurs_at).format('MMMM Do YYYY');
			var horaEvento = moment(json.orders[0].items[0].ticket_group.event.occurs_at).format('h:mm:ss a');
			var cantidadTickets = json.orders[0].items[0].quantity;
			var tipoTickets = json.orders[0].items[0].ticket_group.format;
			var precio = json.orders[0].items[0].price;
			var costoTotal = json.orders[0].items[0].cost;
			var ordenNumber = json.orders[0].id;
			var fechaOrden = moment(json.orders[0].created_at).format('MMMM Do YYYY, h:mm:ss a');
			var clienteId = json.orders[0].buyer.id;
			var venueEvento = json.orders[0].items[0].ticket_group.event.venue.name;


			//	Guardamos el número de orden.

			var Order = new Orders; {
				Order.order_id.push(json.orders[0].id);
				Order.save();
			}


			// Email Template
			// obtenemos la plantilla HTML y le cambiamos todos los datos.
			var ordenData = json;
			var templateHTML = '<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <!-- NAME: CONTRAST --> <!--[if gte mso 15]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Thank you for Buying Tickets!</title> <style type="text/css">p{margin:10px 0;padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block;margin:0;padding:0;}img,a img{border:0;height:auto;outline:none;text-decoration:none;}body,#bodyTable,#bodyCell{height:100%;margin:0;padding:0;width:100%;}.mcnPreviewText{display:none !important;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt;mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit;cursor:default;text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important;}a.mcnButton{display:block;}.mcnImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/body,#bodyTable{/*@editable*/background-color:#f5f0f0;}/*@tab Page@section background style@tip Set the background color and top border for your email. You may want to choose colors that match your companys branding.*/#bodyCell{/*@editable*/border-top:0;}/*@tab Page@section email border@tip Set the border for your email.*/#templateContainer{/*@editable*/border:0;}/*@tab Page@section heading 1@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.@style heading 1*/h1{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:12px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-1px;/*@editable*/text-align:left;}/*@tab Page@section heading 2@tip Set the styling for all second-level headings in your emails.@style heading 2*/h2{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:20px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.75px;/*@editable*/text-align:left;}/*@tab Page@section heading 3@tip Set the styling for all third-level headings in your emails.@style heading 3*/h3{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:16px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:-.5px;/*@editable*/text-align:left;}/*@tab Page@section heading 4@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.@style heading 4*/h4{/*@editable*/color:#000000 !important;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/font-style:normal;/*@editable*/font-weight:bold;/*@editable*/line-height:125%;/*@editable*/letter-spacing:normal;/*@editable*/text-align:left;}/*@tab Preheader@section preheader style@tip Set the background color and borders for your emails preheader area.*/#templatePreheader{/*@editable*/background-color:#000000;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Preheader@section preheader text@tip Set the styling for your emails preheader text. Choose a size and color that is easy to read.*/.preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{/*@editable*/color:#FFFFFF;/*@editable*/font-family:Helvetica;/*@editable*/font-size:9px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Preheader@section preheader link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.preheaderContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Header@section header style@tip Set the background color and borders for your emails header area.*/#templateHeader{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Header@section header text@tip Set the styling for your emails header text. Choose a size and color that is easy to read.*/.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Header@section header link@tip Set the styling for your emails header links. Choose a color that helps them stand out from your text.*/.headerContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Body@section body style@tip Set the background color and borders for your emails body area.*/#templateBody{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Body@section body text@tip Set the styling for your emails body text. Choose a size and color that is easy to read.*/.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:13px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Body@section body link@tip Set the styling for your emails body links. Choose a color that helps them stand out from your text.*/.bodyContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Columns@section column style@tip Set the background color and borders for your emails columns area.*/#templateColumns{/*@editable*/background-color:#FFFFFF;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Columns@section left column text@tip Set the styling for your emails left column text. Choose a size and color that is easy to read.*/.leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:14px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Columns@section left column link@tip Set the styling for your emails left column links. Choose a color that helps them stand out from your text.*/.leftColumnContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Columns@section right column text@tip Set the styling for your emails right column text. Choose a size and color that is easy to read.*/.rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{/*@editable*/color:#202020;/*@editable*/font-family:Helvetica;/*@editable*/font-size:14px;/*@editable*/line-height:150%;/*@editable*/text-align:left;}/*@tab Columns@section right column link@tip Set the styling for your emails right column links. Choose a color that helps them stand out from your text.*/.rightColumnContainer .mcnTextContent a{/*@editable*/color:#C52E26;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}/*@tab Footer@section footer style@tip Set the background color and borders for your emails footer area.*/#templateFooter{/*@editable*/background-color:#f5f0f0;/*@editable*/border-top:0;/*@editable*/border-bottom:0;}/*@tab Footer@section footer text@tip Set the styling for your emails footer text. Choose a size and color that is easy to read.*/.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/color:#CCCCCC;/*@editable*/font-family:Helvetica;/*@editable*/font-size:10px;/*@editable*/line-height:125%;/*@editable*/text-align:left;}/*@tab Footer@section footer link@tip Set the styling for your emails footer links. Choose a color that helps them stand out from your text.*/.footerContainer .mcnTextContent a{/*@editable*/color:#CCCCCC;/*@editable*/font-weight:normal;/*@editable*/text-decoration:underline;}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important;min-width:100% !important;}}@media only screen and (max-width: 480px){#templateContainer,#templatePreheader,#templateHeader,#templateColumns,#templateBody,#templateFooter{max-width:600px !important;width:100% !important;}}@media only screen and (max-width: 480px){.columnsContainer{display:block!important;max-width:600px !important;padding-bottom:18px !important;padding-left:0 !important;width:100%!important;}}@media only screen and (max-width: 480px){.mcnImage{height:auto !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{max-width:100% !important;width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important;padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important;padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important;padding-bottom:0 !important;padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important;width:100% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 1@tip Make the first-level headings larger in size for better readability on small screens.*/h1{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 2@tip Make the second-level headings larger in size for better readability on small screens.*/h2{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 3@tip Make the third-level headings larger in size for better readability on small screens.*/h3{/*@editable*/font-size:18px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section heading 4@tip Make the fourth-level headings larger in size for better readability on small screens.*/h4{/*@editable*/font-size:13px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Boxed Text@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Visibility@tip Set the visibility of the emails preheader on small screens. You can hide it to save space.*/#templatePreheader{}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Preheader Text@tip Make the preheader text larger in size for better readability on small screens.*/.preheaderContainer .mcnTextContent,.preheaderContainer .mcnTextContent p{/*@editable*/font-size:14px !important;/*@editable*/line-height:115% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Header Text@tip Make the header text larger in size for better readability on small screens.*/.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Body Text@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Left Column Text@tip Make the left column text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.leftColumnContainer .mcnTextContent,.leftColumnContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section Right Column Text@tip Make the right column text larger in size for better readability on small screens. We recommend a font size of at least 16px.*/.rightColumnContainer .mcnTextContent,.rightColumnContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/*@tab Mobile Styles@section footer text@tip Make the body content text larger in size for better readability on small screens.*/.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/font-size:12px !important;/*@editable*/line-height:115% !important;}}</style> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto"> </head> <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"> <!--[if !gte mso 9]> <!----> <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"> </span> <!--<![endif]--> <!--*|END:IF|*--> <center> <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <!-- BEGIN TEMPLATE // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer"> <tr> <td align="center" valign="top"> <!-- BEGIN PREHEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templatePreheader"> <tr> <td valign="top" class="preheaderContainer" style="padding-top:9px; padding-bottom:9px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:0px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;"> <tbody> <tr> <td valign="top" style="padding-right: 0px; color:white; padding-bottom: 0; text-align:left;height:160px; background-image: url(\'https://ticketdelivery.herokuapp.com/images/head_mail.jpg\');"> <span style="position:absolute;margin-left:18px;top:18px;font-family:Roboto; font-size:11pt;">Your Pepper Tickets</span>  <span style="position:absolute; top:95px;margin-left:80px;font-family:Roboto; font-size:11pt;"><!-- {EVENT_NAME} --> </span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END PREHEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN HEADER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateHeader"> <tr> <td valign="top" class="headerContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;"> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Congratulations &lt;Name&gt;</strong> <br>Thank you for buying tickets from us. <br> Please review the details of your purchase. </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END HEADER --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN BODY // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody"> <tr> <td valign="top" class="bodyContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Receipt&nbsp;Details&nbsp;</strong> <br>&lt;Event&gt; &lt;City&gt;&nbsp;- &lt;Date&gt;&nbsp;at &lt;Time&gt; <br>&lt;Quantity&gt; &lt;type of ticket&gt; &lt;Price&gt; =&nbsp; &lt;Total Cost&gt; &nbsp; <br>Total Cost: &lt;Total Cost&gt; </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>Your Order</strong> <br>Order&nbsp;#: &lt;Order&gt; <br>Order&nbsp;date: &lt;orderDate&gt;&nbsp; <br>Customer #: &lt;Customer&gt; <br>Customer name: &lt;Name&gt; <br>Delivery method: &lt;Delivery method&gt; <br>Number of tickets: &lt;Number of Tickets&gt;​ <br> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;font-size:12px;"> <strong>About This Event</strong> <br>&lt;Date&gt; from &lt;Start Time&gt; <br>&lt;Location&gt;&nbsp; <br>&nbsp; </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END BODY --> </td> </tr> <tr> <td align="center" valign="top"> <!-- BEGIN COLUMNS // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateColumns"> <tr> <td align="left" valign="top" class="columnsContainer" width="50%"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateColumn"> <tr> <td valign="top" class="leftColumnContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="300" style="width:300px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px;font-size:12px; padding-bottom:9px; padding-left:18px;"> Thank you for buying from us. </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> </td> <td align="left" valign="top" class="columnsContainer" width="50%"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateColumn"> <tr> <td valign="top" class="rightColumnContainer"></td> </tr> </table> </td> </tr> </table> <!-- // END COLUMNS --> </td> </tr> <tr> <td align="center" valign="top" style="padding-bottom:40px;"> <!-- BEGIN FOOTER // --> <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateFooter"> <tr> <td valign="top" class="footerContainer" style="padding-top:9px; padding-bottom:9px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:0px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;"> <tbody> <tr> <td class="mcnImageContent" valign="top" style="padding-right: 0px; padding-left: 0px; padding-top: 0; padding-bottom: 0; text-align:center;"> <img align="center" alt="" src="https://gallery.mailchimp.com/2392b91a60b1f0f004fceddc8/images/2aa318f2-ccb2-4805-b914-ccf1b09844a4.png" width="50" style="max-width:50px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage"> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"> <!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr> <![endif]--> <!--[if mso]> <td valign="top" width="599" style="width:599px;"> <![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;"> <span style="color:#000000"><em>Copyright © 2017 Pepper bot, All rights reserved.</em> <br>You are receiving this email because you opted to buy from Pepper bot.&nbsp; <br> <br><strong>Contact Information:</strong> <br>Pepper bot <br>business.joinpepper.com <br><u>contact@spotlightstudio.org</u> <br> </td> </tr> </tbody> </table> <!--[if mso]> </td> <![endif]--> <!--[if mso]> </tr> </table> <![endif]--> </td> </tr> </tbody> </table> </td> </tr> </table> <!-- // END FOOTER --> </td> </tr> </table> <!-- // END TEMPLATE --> </td> </tr> </table> </center> </body></html>';
			templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
			templateHTML = templateHTML.replace('&lt;Name&gt;', nombreCliente);
			templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
			templateHTML = templateHTML.replace('{EVENT_NAME}', eventoNombre);
			templateHTML = templateHTML.replace('&lt;Event&gt;', eventoNombre);
			templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
			templateHTML = templateHTML.replace('&lt;City&gt;', ciudadEvento);
			templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
			templateHTML = templateHTML.replace('&lt;Date&gt;', fechaEvento);
			templateHTML = templateHTML.replace('&lt;Time&gt;', horaEvento);
			templateHTML = templateHTML.replace('&lt;Start Time&gt;', horaEvento);
			templateHTML = templateHTML.replace('&lt;Quantity&gt;', cantidadTickets);
			templateHTML = templateHTML.replace('&lt;Number of Tickets&gt;', cantidadTickets);
			templateHTML = templateHTML.replace('&lt;type of ticket&gt;', tipoTickets);
			templateHTML = templateHTML.replace('&lt;Price&gt;', precio);
			templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
			templateHTML = templateHTML.replace('&lt;Total Cost&gt;', '$' + costoTotal);
			templateHTML = templateHTML.replace('&lt;Order&gt;', ordenNumber);
			templateHTML = templateHTML.replace('&lt;orderDate&gt;', fechaOrden);
			templateHTML = templateHTML.replace('&lt;Customer&gt;', clienteId);
			templateHTML = templateHTML.replace('&lt;Location&gt;', venueEvento);
			//			res.send('<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <base href="https://ticketdelivery.herokuapp.com/"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>finished</title> <link href="css/bootstrap.min.css" rel="stylesheet"> <link href="css/style.css" rel="stylesheet"> </head> <body> <div class="container-fluid"> <div class="row"> <div class="col-md-12"> <div class="jumbotron"> <h2> Finished Checkout </h2> <p> You have completed the process of acquiring tickets we have sent an email with the order. If you have any questions please feel free to contact us at .... </p> </div> </div> </div></div> <script src="js/jquery.min.js"></script> <script src="js/bootstrap.min.js"></script> <script src="js/scripts.js"></script> </body></html>');

			// Mas informacion relativa al tipo de ticket.
			if (req.body.format == 'Eticket') {
				templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'Eticket - Email with PDF');

			} else {

				templateHTML = templateHTML.replace('&lt;Delivery method&gt;', 'FedEx');

			}


			/* Comienza la parte del template en HTML */
			// Enviamos el template que se usa al final de la compra.
			var template = '<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8"> <base href="https://ticketdelivery.herokuapp.com/"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no"> <title>Your tickets are on its way!</title> <base href="https://ticketdelivery.herokuapp.com"> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <!--Import materialize.css--> <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection"/> <!--Let browser know website is optimized for mobile--> </head> <body> <div class="container left"> <dir style="margin-top:0;padding-top:0;" class="section center-align"> <div class="row"> <h4>Congratulations {NAME_BUYER}</h4> <h6 class="grey-text">Enjoy your Tickets</h6> </div> <div class="row"> <img src="images/pepper.png" style="margin-top:0;padding-top:0;" class="responsive-img"> </div> <div class="row" style="margin-top:0; padding-top:0;"> <div style="width:100%; margin-top:0;" class="card-panel blue darken-4"><label class="flow-text white-text">Thank you.</label><br> <label class="flow-text white-text">Your confirmation is on its way.</label> </div> </div> </dir> </div> <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script> <script type="text/javascript" src="js/materialize.min.js"></script> </body></html>';
			res.send(template.replace('{NAME_BUYER}', nombreCliente));


			Message.typingOn(req.query.uid);
			Message.sendMessage(req.query.uid, nombreCliente + ' Thank you for purchasing tickets for ' + eventoNombre);
			Message.typingOff(req.query.uid);
			// Arrays con los emails a enviar
			var emails = [req.body.email_id, 'armandorussi@gmail.com', 'thepepperbot@gmail.com'];
			var mailgun = require('mailgun-js')({
				apiKey: process.env.MAILGUNKEY,
				domain: process.env.MAILGUNHOST
			});
			for (var i = 0; i < emails.length; i++) {
				var mailData = {
					from: 'PepperBot Tickets <thepepperbot@gmail.com>',
					to: emails[i],
					subject: 'Your Event tickets!',
					html: templateHTML
				};

				mailgun.messages().send(mailData, function (error, body) {
					console.log('Enviado...');
					console.log(body);
				});
			}

		});
	});

});



module.exports = router;