var express = require('express');
var app = express();

var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ['key0','key1']
}));

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  console.log('loginData',req.session.loginData)
  res.render('pages/index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('pages/profile.ejs', {
    name : "Ramon"
  });
});

app.post('/login', function(req, res) {
  req.session.loginData = req.body;
  console.log('loginData',req.session.loginData)
  res.redirect('/profile');
  console.log('page rendered')
});

// route for logging out
app.get('/logout', function(req, res) {
    if (req.session.loginData) req.session.loginData = {};
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.session && req.session.loginData && req.session.loginData.event) {
      return next();
    } else {
      res.redirect('/');
    }
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
