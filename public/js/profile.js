function socialLoad() {
  if (typeof(window.socialid) !== "object") window.socialid = {};
  socialid.onLoad = function() {
    socialid.login.init(301, {
      loginType: "event"
    });
    socialid.login.renderConnectWidget("connectsocialid", {
      "providers": ["facebook", "gplus", "twitter", "linkedin"],
      "theme": "bricks",
      "showSocialIdLink": true,
      "loadCSS": true
    });
    document.getElementById("logoutbutton").onclick = function () {
      socialid.login.logout();
      window.location = '/logout';
    };
  };
}
