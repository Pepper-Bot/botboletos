//10 de agosto
"use strict";
require("dotenv").config();
var express = require("express");

var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var sassMiddleware = require("node-sass-middleware");
var session = require("express-session");
var redisVars = require("./config/config_vars").redis;
var redisClient = require("redis").createClient(redisVars.REDIS_URL);
var RedisStore = require("connect-redis")(session);
var Promise = global.Promise || require("promise");
var helpers = require("./lib/helpers");

var config = require("./config/config_vars");

var APLICATION_URL_DOMAIN = config.APLICATION_URL_DOMAIN;
var DASHBOT_API_KEY = config.DASHBOT_API_KEY;

const dashbot = require("dashbot")(DASHBOT_API_KEY).facebook; //new

var methodOverride = require("method-override");

var fbgraphModule = require("./routes/facebook_graph_module/fb_graph_module");

var passport = require("passport");

var SpotifyStrategy = require("./modules/spotify/passport-spotify/index")
  .Strategy;
var spotifyVar = require("./config/config_vars").spotifyVar;

var consolidate = require("consolidate");

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, expires_in
//   and spotify profile), and invoke a callback with a user object.

passport.use(
  new SpotifyStrategy(
    {
      clientID: spotifyVar.SPOTIFY_CLIENT_ID,
      clientSecret: spotifyVar.SPOTIFY_CLIENT_SECRET,
      callbackURL: APLICATION_URL_DOMAIN + "auth/spotify/callback"
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

var index = require("./routes/index");
//var users = require('./routes/users');
var webhook = require("./routes/webhook");
var storeUrl = require("./routes/redirect");
//var ticketSales = require('./routes/event');
var ticketGroups = require("./routes/groups");

var events = require("./routes/tickets-controllers/event.controller");

var ticket_Groups = require("./routes/tickets-controllers/ticketgroup.controller");

//var checkoutBuy = require('./routes/checkout');
var checkoutBuy = require("./routes/tickets-controllers/checkout.controller");
var pay_controller = require("./routes/tickets-controllers/pay.controller");
var creditcard_finish_controller = require("./routes/tickets-controllers/creditcard_finish.controller");
//var payment = require('./routes/pay');
var finish = require("./routes/finish");
var email = require("./routes/email");

var ChatBox = require("./bot/chatbox");
// prueba alexis
ChatBox.unsetGreetingText(); // Reset Greetings
ChatBox.startButton("Greetings");
/*ChatBox.greetingText(
  "Hello {{user_first_name}}!. Pepper finds you upcoming concerts & events based on your lifestyle and listening habits",
  "default"
);*/

/*ChatBox.persistentMenu(
  {
    type: "postback",
    title: "Start again",
    payload: "Greetings",
    webview_height_ratio: "tall"
  },
  {
    type: "web_url",
    title: "Select Artists",
    url: "https://pepper-bussines.herokuapp.com/",
    webview_height_ratio: "tall",
    messenger_extensions: true
  }
);*/

var app = express();

//notificaciones//

app.listen(2000, function() {
  setInterval(function() {
    var moment = require("moment");
    var notificaciones = require("./db/queries/user.notification.sheduled.queries");

    let today_start = moment().startOf("day");
    let today_end = moment().endOf("day");

    console.log(`INICIO DEL DIA  ${today_start}`);
    console.log(`FINAL DEL DIA  ${today_end}`);


    let startDate = moment().add(-5, "minutes");
    let endDate = moment().add(5, "minutes");

    console.log(`start Date ${startDate}`);
    console.log(`end Date ${endDate}`);

    notificaciones.sendDailyNotification(
      startDate,
      endDate
    );

  //1000*60*24
  }, 1000*60*5);
});

//notificaciones//

/*
app.use(function(req, res, next) {

    res.header('Content-Type','application/vnd.api+json; charset=utf-8');
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Access-Control-Allow-Headers, Authorization, X-Requested-With, Content-Type, Accept, Connection, Content-Length, Cookie, Host, Keep-Alive, Referer, Upgrade, Transfer-Encoding");

  next();
});
*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Origin", APLICATION_URL_DOMAIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//############MANEJO DE PLANTILLAS express-handlebars####################

var hbs = exphbs.create({
  defaultLayout: "default",
  extname: ".hbs",
  partialsDir: ["views/partials/"]
});

/*app.engine('.hbs', exphbs({
  defaultLayout: 'default',
  ext: '.hbs',
 

}));*/
app.set("views", __dirname + "/views");
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
//############MANEJO DE PLANTILLAS####################

app.use(
  sassMiddleware({
    /* Options */
    src: __dirname,
    dest: path.join(__dirname, "public"),
    debug: true,
    outputStyle: "compressed",
    prefix: "/prefix" // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
  })
);

app.use(logger("dev"));
app.use(bodyParser.json());
var urlencodedParser = app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//midleware para ssessions...

var sess = {
  name: "session",
  secret: "some secret",
  cookie: {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    signed: false
  },
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    host: redisVars.REDIS_HOST,
    port: redisVars.REDIS_PORT,
    db: 0,
    cookie: {
      maxAge: 3600 * 1000 * 30
    }, // 30 Days in ms
    client: redisClient
  })
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
app.use(methodOverride());

//app.use(session({ secret: 'keyboard cat' }));//esta

app.use(passport.initialize());
app.use(passport.session(sess));

app.use(express.static(__dirname + "/public")); //esta
app.use("/dashboard", index);
//app.use('/users', users);
// xxx  app.use('/webhook2/', webhook);
var welcome = require("./routes/welcome/welcome");
app.get("/", welcome.welcome);

app.get("/webhook2/", webhook.intitGetFB);
app.post("/webhook2/", webhook.initFBEvents);
app.post("/pause", webhook.pause);
app.use("/redirect/", storeUrl);

//app.use('/event/', ticketSales);
app.get("/event/", events.render_events);

app.use("/tickets/", ticketGroups);
app.get("/ticketgroups/:event_id", ticket_Groups.ticketgroup);
//app.use('/checkout/', checkout);

app.post("/checkout/", checkoutBuy.checkout);
app.post("/checkout/paypal_pay/", checkoutBuy.paypal_pay);
app.use("/paypal_success/", checkoutBuy.paypal_success);
app.use("/paypal_cancel/", checkoutBuy.paypal_cancel);

app.post("/pay/", pay_controller.init_pay);
//app.use('/finish/', finish); // finishing checkout / creating orders and payments
app.post("/finish_pay_credit_card/", creditcard_finish_controller.finishCC);

app.get("/auth/", fbgraphModule.auth);

// user gets sent here after being authorized
app.get("/UserHasLoggedIn/", fbgraphModule.UserHasLoggedIn);

app.get("/zuck/", fbgraphModule.zuck);

app.get("/spotify/", function(req, res) {
  res.render("./layouts/spotify/index", {
    titulo: "Spotify",
    APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
    user: req.user
  });
});

app.get("/spotify/account/", ensureAuthenticated, function(req, res) {
  res.render("./layouts/spotify/account", {
    titulo: "Spotify Account",
    APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
    user: req.user
  });
});

app.get("/spotify/login/", function(req, res) {
  res.render("./layouts/spotify/login", {
    titulo: "Spotify Login",
    APLICATION_URL_DOMAIN: APLICATION_URL_DOMAIN,
    user: req.user
  });
});

//DASHBOT DAY
app.post("/guessnumber", (request, response) => {
  dashbot.logIncoming(request.body);
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  "/auth/spotify/",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "/spotify/login/"
  }),
  function(req, res) {
    res.redirect("/spotify/");

    //res.send('Loguiado!!!')
  }
);

app.get("/spotify/logout/", function(req, res) {
  req.logout();
  res.redirect("/spotify/");
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/spotify/login");
}

app.use("/pruebamail/", email);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(req, res, next) {
  if (!req.session) {
    return next(new Error("oh no")); // handle error
  } else {
    console.log("req.session" + req.session);
  }
  next(); // otherwise continue
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function exposeTemplates(req, res, next) {
  // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
  // templates which will be shared with the client-side of the app.
  hbs
    .getTemplates("shared/templates/", {
      cache: app.enabled("view cache"),
      precompiled: true
    })
    .then(function(templates) {
      // RegExp to remove the ".handlebars" extension from the template names.
      var extRegex = new RegExp(hbs.extname + "$");

      // Creates an array of templates which are exposed via
      // `res.locals.templates`.
      templates = Object.keys(templates).map(function(name) {
        return {
          name: name.replace(extRegex, ""),
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
