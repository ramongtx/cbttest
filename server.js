var https = require('https');
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

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  if (!isLoggedIn(req)) {
    res.render('pages/index');
  } else {
    res.redirect('/profile');
  }
});

app.get('/profile', function(req, res) {
  if (isLoggedIn(req)) {
    getUserInfo(req.session.loginData, function(data) {
      var obj = {name: ""};
      try {
        obj = JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
      res.render('pages/profile.ejs', {
        name: obj.name,
        data: data
      });
    });
  } else {
    res.redirect('/');
  }
});

app.post('/login', function(req, res) {
  req.session.loginData = req.body;
  console.log('loginData', req.session.loginData);
  res.end('ok');
});

// route for logging out
app.get('/logout', function(req, res) {
  if (req.session.loginData) req.session.loginData = {};
  res.redirect('/');
});

function isLoggedIn(req) {
  if (req.session && req.session.loginData && req.session.loginData.token) {
    return true;
  }
  return false;
}

function getUserInfo(loginData, callback) {
  var host = 'api-staging.socialidnow.com';
  var path = '/v1/marketing/login/info'
  var parameters = 'api_secret=' + process.env.API_SECRET;
  parameters += '&token=' + loginData.token;
  parameters += "&fields=display_name,picture_url";

  var optionsget = {
    host: 'api-staging.socialidnow.com',
    port: 443,
    path: '/v1/marketing/login/info?' + parameters,
    method: 'GET',
    headers: {
      'Accept': '*/*'
    }
  }

  var reqGet = https.request(optionsget, function(res) {
    var str = ""
    res.on('data', function(d) {
      str+=d;
    });
    res.on('end',function(){
      callback(str)
    });
  });

  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
