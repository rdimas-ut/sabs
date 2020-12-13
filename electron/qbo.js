const OAuthClient = require('intuit-oauth');

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
  return oauthClient.authorizeUri({scope:scopes});
};

const testResponse = function (req, res) {
  const myURL = new URL(req.url, "http://localhost:801");
  var paramArray = new Array(4);
  var params = ["code", "realmId", "state", "error"];
  var returnString = "Hi, this is my first server\n";
  var i = 0

  returnString += myURL.pathname + "\n";
  const myURLSearch = new URLSearchParams(myURL.search);
  for (const param of params) {
    returnString += param + "=" + myURLSearch.get(param) + "\n";
    paramArray[i] = myURLSearch.get(param);
    i += 1;
  }

  // Check if the path and parameters are correct api/oauth and code realmId 
  // If they are then exchange codes for keys and if not then return header file sortof.

  res.writeHead(200);
  res.end(returnString);
};


exports.createAuthUrl = createAuthUrl;
exports.testResponse = testResponse;