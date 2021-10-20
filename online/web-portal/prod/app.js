var fs = require('fs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require("express-session");
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;


const isDev = (process.env.DEV_OR_PROD && (process.env.DEV_OR_PROD == "dev"));

const oktaEnv = isDev ? require("./okta_env_dev") : require("./okta_env");
const port =  isDev ? 8080 : 80;
const base_url = `http://notecards.online${isDev ? ":" + port : ""}`;

const notecardsRouter = require("./notecards");
notecardsRouter.base_url = base_url;

const clientRouter = express.Router();
const novnc_path = path.join(__dirname, 'novnc');
clientRouter.get('/go', (req, res, next) => { res.sendFile(path.join(novnc_path, 'vnc.html')); });
clientRouter.use(express.static(novnc_path));


var app = express();
var oktaClient = new okta.Client({
  orgUrl: oktaEnv.orgUrl,
  token: oktaEnv.token
});
const oidc = new ExpressOIDC({
  issuer: oktaEnv.issuer,
  client_id: oktaEnv.client_id,
  client_secret: oktaEnv.client_secret,
  redirect_uri: base_url + "/authorization-code/callback",
  appBaseUrl: base_url,
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    loginCallback: {
        afterCallback: "/main"
    }
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set up logging
const logStream = fs.createWriteStream(path.join(__dirname, isDev ? 'dev.log' : 'production.log'), { flags: 'a' });
logger.token('user', (req, res) => { return (req.userprofile && req.userprofile.email) || "Unknown"; });
logger.token('user-agent-short', (req, res) => { return (req.get('User-Agent') && req.get('User-Agent').split(' ', 1)[0]) || "Unknown"; });
app.use(
  logger(
    ':date[iso] :user :method :url :user-agent-short :status :response-time ms - :res[content-length]', { 
        stream: logStream,
        skip: (req, res) => {
          return !(/^\/notecards/.test(req.originalUrl) || /^\/client\/go/.test(req.originalUrl) || /^\/main$/.test(req.originalUrl) || /^\/$/.test(req.originalUrl));
        }      
    }));
//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));
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

app.get('/', (req, res) => { res.redirect('/users/login'); });
app.get('/main', oidc.ensureAuthenticated(), (req, res, next) => { res.render('main', {login: req.userprofile.email}); });
app.use('/notecards', oidc.ensureAuthenticated(), notecardsRouter);
app.use('/client', oidc.ensureAuthenticated(), clientRouter);

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
