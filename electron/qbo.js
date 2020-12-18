const OAuthClient = require('intuit-oauth');
const Quickbooks = require('node-quickbooks');
const store = require('./store');

// Instance of client
var oauthClient = new OAuthClient({
  clientId: 'ABNUyCiXJi38M8E4UGcZK1Rd7MrNLcSX9aRneVpRHdPNyD6K1B',
  clientSecret: 'k8OCVN3wwkhKvTga6xcM1W8HAff6HOx256g0Vzmg',
  environment: 'sandbox',  // ‘sandbox’ or ‘production’
  redirectUri: 'https://sabstestfunc.azurewebsites.net/api/QBOAuth',
  token: store.qboAuthClientData.store
});

var qboClient = new Quickbooks({
  consumerKey: 'ABNUyCiXJi38M8E4UGcZK1Rd7MrNLcSX9aRneVpRHdPNyD6K1B',
  consumerSecret: 'k8OCVN3wwkhKvTga6xcM1W8HAff6HOx256g0Vzmg',
  token: store.qboAuthClientData.get("access_token"),
  tokenSecret: false,
  realmId: store.qboAuthClientData.get("realmId"),
  useSandbox: true,
  debug: false,
  minorversion: null,
  oauthversion: '2.0',
  refreshToken: store.qboAuthClientData.get("refresh_token")
});

var allCustomers;

// Defines scopes use for authentification
var d = OAuthClient.scopes
var scopes = [d.Accounting, d.Payment, d.OpenId, d.Profile, d.Email, d.Phone, d.Address]

function refreshAccessToken() {
  oauthClient.refresh()
  .then(function(authResponse) {
    const responseJSON = authResponse.getJson();
    // Stores the new token in persistent storage
    store.qboAuthClientData.set("createdAt", Date.now());
    store.qboAuthClientData.set(responseJSON);
    // Sets the new tokens for the qboClient
    qboClient.token = responseJSON.access_token;
    qboClient.refreshToken = responseJSON.refresh_token 
  })
  .catch(function(e) {
    console.log("There was an error in refreshAccessToken")
    store.qboAuthClientData.clear();
  })
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

function getAllCustomers() {
  qboClient.findCustomers({
    fetchAll: true
  }, (e, customers) => {
    console.log(customers.QueryResponse.Customer);
  })
}

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
        // Sets the values of tokens and realmId to persistent storage
        store.qboAuthClientData.set(responseJSON);   
        store.qboAuthClientData.set("createdAt", Date.now());
        store.qboAuthClientData.set("realmId", myURLSearch.get("realmId"));
        // Sets the values of tokens and realmId to qboClient
        qboClient.realmId = myURLSearch.get("realmId");
        qboClient.token = responseJSON.access_token;
        qboClient.refreshToken = responseJSON.refresh_token; 
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
exports.getAllCustomers = getAllCustomers;
exports.allCustomers = allCustomers;