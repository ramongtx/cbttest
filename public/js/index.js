function socialLoad() {
  if (typeof(window.socialid) !== "object") window.socialid = {};
  socialid.onLoad = function() {
    socialid.login.init(301, {
      loginType: "event"
    });
    socialid.login.renderLoginWidget("login­c6ab6f67", {
      "providers": ["facebook", "gplus", "twitter", "linkedin"],
      "theme": "bricks",
      "showSocialIdLink": true
    });
    socialid.events.onLoginSuccess.addHandler(function(data) {
      console.log("Website received onLoginSuccess: ", data);
      $.ajax({
        type: "POST",
        url: '/login',
        data: data,
        cache: false,
        dataType: "json",
        success: (function() {
          alert("SUCCESS")
        })
      });
    });
  };
}
