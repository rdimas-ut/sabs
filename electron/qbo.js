const OAuthClient = require('intuit-oauth');
const store = require('./store');

// Instance of client
var oauthClient = new OAuthClient({
  clientId: 'ABNUyCiXJi38M8E4UGcZK1Rd7MrNLcSX9aRneVpRHdPNyD6K1B',
  clientSecret: 'k8OCVN3wwkhKvTga6xcM1W8HAff6HOx256g0Vzmg',
  environment: 'sandbox',  // ‘sandbox’ or ‘production’
  redirectUri: 'https://sabstestfunc.azurewebsites.net/api/QBOAuth'
});

var d = OAuthClient.scopes
var scopes = [d.Accounting, d.Payment, d.OpenId, d.Profile, d.Email, d.Phone, d.Address]

function createAuthUrl() {
  // AuthorizationUri
  var rty =oauthClient.authorizeUri({scope:scopes}) 
  console.log(rty)
  return rty;
};

// Handles he local redirect request received back from azure  
const handleAuth = function (req, res) {
  const myURL = new URL(req.url, "http://localhost:801");
  const myURLSearch = new URLSearchParams(myURL.search);
  const myError = myURLSearch.get("error");

  // Evaluate response
  res.writeHead(200);
  if (myURL.pathname === "/api/oauth/" && myError === null) {
    // exchange the code a access_toke and refresh_token
    oauthClient.createToken(req.url)
    .then(function(authResponse) {
        const responseJSON = authResponse.getJson();
        store.qboAuthData.set("access_token.value", responseJSON.access_token)
    })
    .catch(function(e) {
        store.qboAuthData.set("access_token.value", null);
    });

    res.end("Authentification was succesful. You may now close this window.");
  } else {
    res.end("Authentification failed. Please try again. You may now close this window")
  }

};


exports.createAuthUrl = createAuthUrl;
exports.testResponse = testResponse;
exports.handleAuth = handleAuth;