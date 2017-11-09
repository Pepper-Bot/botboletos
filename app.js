//mmm :C
require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var index = require('./routes/index');
//var users = require('./routes/users');
var webhook = require('./routes/webhook');
var storeUrl = require('./routes/redirect');
var ticketSales = require('./routes/event');

var index = require('./routes/index');
//var users = require('./routes/users');
var webhook = require('./routes/webhook');
var storeUrl = require('./routes/redirect');
var ticketSales = require('./routes/event');
var ticketGroups = require('./routes/groups');
var checkout = require('./routes/checkout');
var payment = require('./routes/pay');
var finish = require('./routes/finish');
var email = require('./routes/email');

var login = require('./routes/handlers-views/login');

/*var ChatBox = require('./bot/chatbox');
// prueba alexis

//ChatBox.unsetGreetingText(); // Reset Greetings
ChatBox.startButton('Greetings');
ChatBox.greetingText('Pepper automatically finds relevant restaurants & bars for you by learning your habits','default');

ChatBox.persistentMenu({
           "type":"postback",
           "title":"Start again.",
           "payload":"Greetings"
        });
*/


var app = express();

//############MANEJO DE PLANTILLAS express-handlebars####################
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  ext: '.hbs'

}));

app.set('view engine', '.hbs');
//############MANEJO DE PLANTILLAS####################




/*app.use(function (req, res, next) {

  res.header('Content-Type', 'application/vnd.api+json; charset=utf-8');
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Access-Control-Allow-Headers, Authorization, X-Requested-With, Content-Type, Accept, Connection, Content-Length, Cookie, Host, Keep-Alive, Referer, Upgrade, Transfer-Encoding");

  next();
});*/


// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public'));
app.use('/', index);
//app.use('/users', users);
app.use('/webhook2/', webhook);
app.use('/redirect/', storeUrl);
app.use('/event/', ticketSales);

app.use('/tickets/', ticketGroups);
app.use('/checkout/', checkout);
app.use('/pay/', payment);
app.use('/finish/', finish); // finishing checkout / creating orders and payments


app.use('/login/', login);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;