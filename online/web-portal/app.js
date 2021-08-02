var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require("express-session");
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

const publicRouter = require("./routes/public");
const usersRouter = require("./routes/users");
const notecardsRouter = require("./routes/notecards");

var app = express();
var oktaClient = new okta.Client({
  orgUrl: 'https://dev-27859221.okta.com',
  token: '***REMOVED***'
});
const oidc = new ExpressOIDC({
  issuer: "https://dev-27859221.okta.com/oauth2/default",
  client_id: "***REMOVED***",
  client_secret: "***REMOVED***",
  redirect_uri: 'http://notecards.online/authorization-code/callback',
  appBaseUrl:'http://notecards.online',
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    loginCallback: {
//      afterCallback: "/notecards/start"
        afterCallback: "/main"
    }
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'sdfd;grth9999odrgt,4wp5gsadfknjeyr0efd985634ltkmvearpoui6mgae;dlf,er;ymhmrfgfsdfs',
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);
app.use((req, res, next) => {
  if (!(req.userContext && req.userContext.userinfo)) {
    return next();
  }
  oktaClient.getUser(req.userContext.userinfo.sub)
	.then(user => {
		req.userinfo = res.locals.userinfo = req.userContext.userinfo;
		req.userprofile = res.locals.userprofile = user.profile;
  		next(); });
});

app.use('/', publicRouter);
app.use('/users', usersRouter);
app.use('/notecards', oidc.ensureAuthenticated(), notecardsRouter);
app.get('/main', oidc.ensureAuthenticated(), (req, res, next) => { res.render("main", {login: req.userprofile.email}); });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
