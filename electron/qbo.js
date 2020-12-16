const OAuthClient = require('intuit-oauth');
const store = require('./store');

// Instance of client
var oauthClient = new OAuthClient({
  clientId: 'ABNUyCiXJi38M8E4UGcZK1Rd7MrNLcSX9aRneVpRHdPNyD6K1B',
  clientSecret: 'k8OCVN3wwkhKvTga6xcM1W8HAff6HOx256g0Vzmg',
  environment: 'sandbox',  // ‘sandbox’ or ‘production’
  redirectUri: 'https://sabstestfunc.azurewebsites.net/api/QBOAuth',
  token: store.qboAuthClientData.store
});

// Defines scopes use for authentification
var d = OAuthClient.scopes
var scopes = [d.Accounting, d.Payment, d.OpenId, d.Profile, d.Email, d.Phone, d.Address]

function refreshAccessToken() {
  console.log("refreshAccessToken to be" + JSON.stringify(oauthClient.getToken().getToken()));
  console.log(store.qboAuthClientData.store)
  oauthClient.refresh()
  .then(function(authResponse) {
    const responseJSON = authResponse.getJson();
    store.qboAuthClientData.set("createdAt", Date.now());
    store.qboAuthClientData.set(responseJSON);
  })
  .catch(function(e) {
    console.log("There was an error in refreshAccessToken")
    store.qboAuthClientData.clear();
  })

  console.log("this is the regular one" + oauthClient.getToken())
}

function revokeAccessToken() {
  oauthClient
  .revoke()
  .then(function (authResponse) {
    console.log('Tokens revoked : ' + JSON.stringify(authResponse.getJson()));
  })
  .catch(function (e) {
    console.error('The error message is :' + e.originalMessage);
    console.error(e.intuit_tid);
  });
  store.qboAuthClientData.clear();
}

function isAccessTokenValid() {
  return oauthClient.isAccessTokenValid();
}

function createAuthUrl() {
  return oauthClient.authorizeUri({scope:scopes}) 
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
        store.qboAuthClientData.set("createdAt", Date.now());
        store.qboAuthClientData.set("realmId", myURLSearch.get("realmId"));
        store.qboAuthClientData.set(responseJSON);    
    })
    .catch(function(e) {
        store.qboAuthClientData.clear();
    });
    
    res.end("Authentification was succesful. You may now close this window.");
  } else {
    res.end("Authentification failed. Please try again. You may now close this window")
  }
};


exports.refreshAccessToken = refreshAccessToken;
exports.revokeAccessToken = revokeAccessToken;
exports.isAccessTokenValid = isAccessTokenValid;
exports.createAuthUrl = createAuthUrl;
exports.handleAuth = handleAuth;