//10 de agosto
'use strict';
require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var redisClient = require('redis').createClient(process.env.REDIS_URL);
var RedisStore = require('connect-redis')(session)
var Promise = global.Promise || require('promise');
var helpers = require('./lib/helpers');

var index = require('./routes/index');
//var users = require('./routes/users');
var webhook = require('./routes/webhook');
var storeUrl = require('./routes/redirect');
var ticketSales = require('./routes/event');
var ticketGroups = require('./routes/groups');
var ticket_Groups = require('./routes/tickets-views/ticketgroup.controller').ticketgroup;


//var checkoutBuy = require('./routes/checkout');
var checkoutBuy = require('./routes/tickets-views/checkout.view');
var pay_controller = require('./routes/tickets-views/pay.controller');
var finish = require('./routes/finish');
var email = require('./routes/email');

var ChatBox = require('./bot/chatbox');
// prueba alexis
//ChatBox.unsetGreetingText(); // Reset Greetings
ChatBox.startButton('Greetings');
ChatBox.greetingText('Pepper automatically finds relevant restaurants & bars for you by learning your habits', 'default');

ChatBox.persistentMenu({
  "type": "postback",
  "title": "Start again",
  "payload": "Greetings"
});

var app = express();


/*
app.use(function(req, res, next) {

    res.header('Content-Type','application/vnd.api+json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Access-Control-Allow-Headers, Authorization, X-Requested-With, Content-Type, Accept, Connection, Content-Length, Cookie, Host, Keep-Alive, Referer, Upgrade, Transfer-Encoding");

  next();
});

*/
app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Origin", "https://botboletos-test.herokuapp.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//############MANEJO DE PLANTILLAS express-handlebars####################



var hbs = exphbs.create({
  defaultLayout: 'default',
  extname: '.hbs',
  partialsDir: [
    
      'views/partials/'
  ]
});


/*app.engine('.hbs', exphbs({
  defaultLayout: 'default',
  ext: '.hbs',
 

}));*/
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
//############MANEJO DE PLANTILLAS####################





app.use(sassMiddleware({
  /* Options */
  src: __dirname,
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/prefix' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/> 
}));



app.use(logger('dev'));
app.use(bodyParser.json());
var urlencodedParser = app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//midleware para ssessions...


var sess = {
  name: 'session',
  secret: "some secret",
  cookie: {
    path: '/',
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    signed: false
  },
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    host: 'ec2-34-227-234-245.compute-1.amazonaws.com',
    port: 29239,
    db: 0,
    cookie: {
      maxAge: (3600 * 1000 * 30)
    }, // 30 Days in ms
    client: redisClient
  })
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))


//app.use(express.static(__dirname + '/public'));
app.use('/dashboard', index);
//app.use('/users', users);
app.use('/webhook2/', webhook);
app.use('/redirect/', storeUrl);
app.use('/event/', ticketSales);
app.use('/tickets/', ticketGroups);
app.get('/ticketgroups/:event_id', ticket_Groups);
//app.use('/checkout/', checkout);

app.post('/checkout/', checkoutBuy.checkout);
app.post('/checkout/paypal_pay/', checkoutBuy.paypal_pay);
app.use('/paypal_success/', checkoutBuy.paypal_success);
app.use('/paypal_cancel/', checkoutBuy.paypal_cancel);



app.post('/pay/', pay_controller.init_pay);
app.use('/finish/', finish); // finishing checkout / creating orders and payments
app.use('/pruebamail/', email);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  } else {
    console.log("req.session" + req.session)
  }
  next() // otherwise continue
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function exposeTemplates(req, res, next) {
  // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
  // templates which will be shared with the client-side of the app.
  hbs.getTemplates('shared/templates/', {
      cache      : app.enabled('view cache'),
      precompiled: true
  }).then(function (templates) {
      // RegExp to remove the ".handlebars" extension from the template names.
      var extRegex = new RegExp(hbs.extname + '$');

      // Creates an array of templates which are exposed via
      // `res.locals.templates`.
      templates = Object.keys(templates).map(function (name) {
          return {
              name    : name.replace(extRegex, ''),
              template: templates[name]
          };
      });

      // Exposes the templates during view rendering.
      if (templates.length) {
          res.locals.templates = templates;
      }

      setImmediate(next);
  })
  .catch(next);
}

module.exports = app;