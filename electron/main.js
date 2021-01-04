const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path');
const https = require("https");

const Database = require('better-sqlite3');
const dbpath = 'C:\\Users\\Ruben Dimas\\Aquila Analytics\\SA Benefit Services - TestingForSharepoint\\sabs.db'
const db = new Database(dbpath, { verbose: console.log });

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

ipcMain.handle('refreshCustomer', () => {
  console.log("main refreshCustomer")
  reqOptions = {
    headers: {
      "RequestType": "refreshCustomer"
    }
  }
  https.get('https://sabstestfunc.azurewebsites.net/api/QBO', reqOptions, (res) => {
    const { statusCode } = res;
    console.log(statusCode);
  })
});

ipcMain.handle('refreshVendor', () => {
  console.log("main refreshVendor")
  reqOptions = {
    headers: {
      "RequestType": "refreshVendor"
    }
  }
  https.get('https://sabstestfunc.azurewebsites.net/api/QBO', reqOptions, (res) => {
    const { statusCode } = res;
    console.log(statusCode);
  })
});


ipcMain.handle('revokeTokens', () => {
  console.log('Main RevokeTokens');
  reqOptions = {
    headers: {
      "RequestType": "revokeTokens"
    }
  }
  https.get('https://sabstestfunc.azurewebsites.net/api/QBO', reqOptions, (res) => {
    const { statusCode } = res;
    console.log(statusCode);
  });
});

ipcMain.handle('testSQLITE', () => {
  var i;
  const stmt = db.prepare('SELECT * FROM Customer');
  const cats = stmt.all();
  for (i = 0; i < cats.length; i++) {
      console.log(cats[i].DispName);
  }
  return cats;
})

ipcMain.handle('qboSignIn', () => {
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
        icon:'./electron/icon.png' 
      })
      winAuth.loadURL(rawData);
    });
  })
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon:'./electron/icon.png' 
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }
};