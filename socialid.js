var https = require('https');

module.exports = {
  // Checks if session contains login token
  isLoggedIn: function(session) {
    if (session && session.loginData && session.loginData.token) {
      return true;
    }
    return false;
  },

  // Makes GET request to obtain user info from socialidnow
  getUserInfo: function(loginData, callback) {
    var host = 'api-staging.socialidnow.com';
    var path = '/v1/marketing/login/info'
    var parameters = '?api_secret=' + process.env.API_SECRET;
    parameters += '&token=' + loginData.token;
    parameters += "&fields=display_name,picture_url";

    var optionsget = {
      host: host,
      port: 443,
      path: path + parameters,
      method: 'GET',
      headers: {
        'Accept': '*/*'
      }
    }

    var reqGet = https.request(optionsget, function(res) {
      var str = ""

      res.on('data', function(d) {
        str += d;
      });

      res.on('end', function() {
        var userInfo = {};
        try {
          userInfo = JSON.parse(str);
        } catch (e) {
          console.error(e);
          userInfo.name = "";
          userInfo.picture_url = "";
        }
        callback(userInfo)
      });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
      console.error(e);
    });
  }
};
