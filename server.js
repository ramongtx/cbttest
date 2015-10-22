var express = require('express');
var app = express();

var cookieSession = require('cookie-session');
app.use(cookieSession({
  name: "session",
  keys: ['49Cablq997', 'xd8QNF2gfl']
}));

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var socialID = require('./socialid');

app.get('/', function(req, res) {
  if (!socialID.isLoggedIn(req.session)) {
    res.render('pages/index');
  } else {
    res.redirect('/profile');
  }
});

app.get('/profile', function(req, res) {
  if (socialID.isLoggedIn(req.session)) {
    socialID.getUserInfo(req.session.loginData, function(data) {
      var obj = {
        name: ""
      };
      try {
        obj = JSON.parse(data);
        req.session.userData = obj;
      } catch (e) {
        console.error(e);
      }
      res.render('pages/profile.ejs', {
        name: obj.name,
        picture: obj.picture_url,
        data: obj
      });
    });
  } else {
    res.redirect('/');
  }
});

app.post('/login', function(req, res) {
  req.session.loginData = req.body;
  res.end('ok');
});

app.get('/logout', function(req, res) {
  if (req.session.loginData) req.session.loginData = null;
  if (req.session.userData) req.session.userData = null;
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
