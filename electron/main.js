const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path');
// const quickbooks = require('node-quickbooks');
const OAuthClient = require('intuit-oauth');
const http = require("http");


const host = "localhost";
const port = 801;

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

const server = http.createServer(testResponse);

server.listen(port, host, () => {
   console.log('server is tunning');
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon:'./electron/SABS logo - Square.jpeg' 
  })

  const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
  // const auth_url = createAuthUrl()

  win.loadFile(startURL)
  // win.loadURL(auth_url)
  // console.log(auth_url)
}

function createAuthUrl() {
  // Instance of client
  var oauthClient = new OAuthClient({
    clientId: 'ABNUyCiXJi38M8E4UGcZK1Rd7MrNLcSX9aRneVpRHdPNyD6K1B',
    clientSecret: 'k8OCVN3wwkhKvTga6xcM1W8HAff6HOx256g0Vzmg',
    environment: 'sandbox',  // ‘sandbox’ or ‘production’
    redirectUri: 'https://sabstestfunc.azurewebsites.net/api/QBOAuth'
  });

  var d = OAuthClient.scopes
  var scopes = [d.Accounting, d.Payment, d.OpenId, d.Profile, d.Email, d.Phone, d.Address]

  // AuthorizationUri
  var authUri = oauthClient.authorizeUri({scope:scopes});

  return authUri
}

// function createWindow () {
//   const win = new BrowserWindow ({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })

//   win.loadURL('https://google.com')
// }

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})