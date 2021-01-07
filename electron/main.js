const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const isDev = require('electron-is-dev');   
const path = require('path');
const ExcelJS = require('exceljs');
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

// workbook.getColumn(1).eachCell((cell, rowNumber) => {console.log(cell.value)})

ipcMain.handle('readExcel', async (e, path) => {
  const workbook = new ExcelJS.Workbook();
  console.log(path)

  try {
    await workbook.xlsx.readFile(path)
  } catch (error) {
    console.log(error)
  }

  const worksheet = workbook.getWorksheet(1);
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {console.log(cell.value)})
  const sold = ["SOLD", "sold", "Sold"];

  var returnValues = {
    MGU: "", 
    Carrier: "", 
    Network: "", 
    Admin: "",
    MIC: "", 
    StartDate: "",

    EE: "",
    ES: "",
    EC: "",
    EF2: "",
    EF4: "",
    Comp: "",
    AggComp: ""
  }

  const valueNames = {
    MGU: ["MGU", "mgu"], 
    Carrier: ["Stop Loss Carrier", "stop loss carrier"], 
    Network: ["Network", "Medical Network"], 
    Admin: ["Administrator", "TPA", "administrator"],
    MIC: ["Months in Contract", "months in contract"], 

    EE: ["Specific Employee"],
    ES: ["Specific Emp+Spouse"],
    EC: ["Specific Emp+Child"],
    EF2: ["Specific Family-2 tier"],
    EF4: ["Specific Family-4 tier"],
    Comp: ["Specific Composite"],
    AggComp: ["Aggregate Premium", "aggregate Premium"],
  }
  
  // Locations of important blocks of data
  var soldLoc = 0;
  var stopLossTermsLoc = 0;
  var stopLossPremiumLoc = 0;

  // Locations of other values

  
  // Tries to find the sold column
  for (var i = 1; i <= worksheet.actualColumnCount; i++) {
    worksheet.getColumn(i).eachCell((cell, rowNumber) => {
      console.log(i + String(cell.value))
      if (cell.value != null) {
      if (sold.some((element) => String(cell.value).includes(element))) {
        soldLoc = i;
      }}
    })
  }

  // Find Stop Loss Terms
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    if (String(cell.value).includes("Stop Loss Terms")) { stopLossTermsLoc = rowNumber; }
  });

  // Find Stop Loss Premium
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    if (String(cell.value).includes("Stop Loss Premium")) {stopLossPremiumLoc = rowNumber; }
  });
  
  // Print out location
  console.log("Location of Sold" + String(soldLoc));
  console.log("Location of Terms" + String(stopLossTermsLoc));
  console.log("Location of Premiums" + String(stopLossPremiumLoc));

  // Find the rest of the values needed
  if (soldLoc) {
    console.log("Found Sold")
    // Write something to find the start date

    // Finds all the weird ones 
    worksheet.getColumn(1).eachCell((cell, rowNumber) => {
      if (rowNumber >= stopLossTermsLoc && rowNumber < (stopLossTermsLoc+6) && stopLossTermsLoc) {
        if (valueNames.MGU.some((element) => String(cell.value).includes(element))) { returnValues.MGU = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.Carrier.some((element) => String(cell.value).includes(element))) { returnValues.Carrier = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.Network.some((element) => String(cell.value).includes(element))) { returnValues.Network = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.Admin.some((element) => String(cell.value).includes(element))) { returnValues.Admin = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.MIC.some((element) => String(cell.value).includes(element))) { returnValues.MIC = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
      
      } else if (rowNumber >= stopLossPremiumLoc && rowNumber < (stopLossPremiumLoc + 13) && stopLossPremiumLoc) {
        if (valueNames.EE.some((element) => String(cell.value).includes(element))) { returnValues.EE = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.ES.some((element) => String(cell.value).includes(element))) { returnValues.ES = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.EC.some((element) => String(cell.value).includes(element))) { returnValues.EC = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.EF2.some((element) => String(cell.value).includes(element))) { returnValues.EF2 = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.EF4.some((element) => String(cell.value).includes(element))) { returnValues.EF4 = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.Comp.some((element) => String(cell.value).includes(element))) { returnValues.Comp = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
        if (valueNames.AggComp.some((element) => String(cell.value).includes(element)) && !returnValues.AggComp) { returnValues.AggComp = worksheet.getRow(rowNumber).getCell(soldLoc).value;}
      }
    });
  }

  console.log(returnValues)

  return returnValues
})

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
        width: 680,
        height: 800,
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
    width: 1000,
    height: 1000,
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