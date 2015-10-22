// Loading EXPRESSJS
var express = require('express');
var app = express();

// Loading cookie-session to be facilitate to cookie storage
var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ['49Cablq997', 'xd8QNF2gfl']
}));

// Loading body-parser to be facilitate the reading of POST parameters
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Basic http server configuration
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Import file containing the SocialID request helper
var socialID = require('./socialid');

// '/' gets redirected to '/profile' if user is already logged
app.get('/', function(req, res) {
  if (!socialID.isLoggedIn(req.session)) {
    res.render('pages/index');
  } else {
    res.redirect('/profile');
  }
});

// '/profile' gets redirected to '/' if user is not logged in
// Gets and saves user info in the session
app.get('/profile', function(req, res) {
  if (socialID.isLoggedIn(req.session)) {
    socialID.getUserInfo(req.session.loginData, function(userInfo) {
      req.session.userInfo = userInfo;
      res.render('pages/profile.ejs', {
        name: userInfo.name,
        picture: userInfo.picture_url,
        data: userInfo
      });
    });
  } else {
    res.redirect('/');
  }
});

// '/login' accepts and saves to session token from Social ID JS API
app.post('/login', function(req, res) {
  req.session.loginData = req.body;
  res.end('ok');
});

// '/logout' deletes all data saved in session
app.get('/logout', function(req, res) {
  if (req.session.loginData) req.session.loginData = null;
  if (req.session.userInfo) req.session.userInfo = null;
  res.redirect('/');
});

// Logs the port the app is running from
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
