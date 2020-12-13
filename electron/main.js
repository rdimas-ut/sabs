const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path');
// const quickbooks = require('node-quickbooks');
const http = require("http");
const settings = require('./settings')
const qbo = require('./qbo')

const server = http.createServer(qbo.testResponse);

server.listen(801, 'localhost', () => {
   console.log('server is tunning');
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

ipcMain.handle('openAuth', () => {
  const winAuth = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    icon:'./electron/SABS logo - Square.jpeg' 
  })
  winAuth.loadURL(qbo.createAuthUrl())
});

// console.log(test.qbo_auth.get("key"));

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon:'./electron/SABS Logo.png' 
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(`file://${path.join(__dirname, '../build/index.html')}`)
  }
};