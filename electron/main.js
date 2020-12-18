const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path');
// const quickbooks = require('node-quickbooks');
const https = require("https");
const http = require('http');
const qbo = require('./qbo');

const server = http.createServer(qbo.handleAuth);

server.listen(801, 'localhost', () => {
});

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

ipcMain.handle('isAccessTokenValid', () => {
  return qbo.isAccessTokenValid();
})

ipcMain.handle('qboSignIn', () => {
  const winAuth = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon:'./electron/SABS Logo.png' 
  })
  winAuth.loadURL(qbo.createAuthUrl());
});

ipcMain.handle('NewSignIn', () => {

  https.get('https://sabstestfunc.azurewebsites.net/api/QBORequestAuth?', (res) => {
    const { statusCode } = res;
  
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
      rawData += chunk;
    });
  
    res.on('end', () => {
      const winAuth = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false
        },
        icon:'./electron/SABS Logo.png' 
      })
      winAuth.loadURL(rawData);
    });
  })
  
});

ipcMain.handle('qboSignOut', () => {
  qbo.revokeAccessToken();
})


ipcMain.handle('refreshAccessToken', () => {
  qbo.refreshAccessToken();
});

ipcMain.handle('getAllCustomers', ()=> {
   qbo.getAllCustomers();
});


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon:'./electron/SABS Logo.png' 
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }
};