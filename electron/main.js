const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const ExcelJS = require("exceljs");
const https = require("https");
const { parse, resolve } = require("path");

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("readExcel", async (e, path) => {
  const workbook = new ExcelJS.Workbook();
  console.log(path);

  try {
    await workbook.xlsx.readFile(path);
  } catch (error) {
    console.log(error);
  }

  const worksheet = workbook.getWorksheet(1);
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    console.log(cell.value);
  });
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
    AggComp: "",
  };

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
  };

  // Locations of important blocks of data
  var soldLoc = 0;
  var stopLossTermsLoc = 0;
  var stopLossPremiumLoc = 0;

  // Locations of other values

  // Tries to find the sold column
  for (var i = 1; i <= worksheet.actualColumnCount; i++) {
    worksheet.getColumn(i).eachCell((cell, rowNumber) => {
      console.log(i + String(cell.value));
      if (cell.value != null) {
        if (sold.some((element) => String(cell.value).includes(element))) {
          soldLoc = i;
        }
      }
    });
  }

  // Find Stop Loss Terms
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    if (String(cell.value).includes("Stop Loss Terms")) {
      stopLossTermsLoc = rowNumber;
    }
  });

  // Find Stop Loss Premium
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    if (String(cell.value).includes("Stop Loss Premium")) {
      stopLossPremiumLoc = rowNumber;
    }
  });

  // Print out location
  console.log("Location of Sold" + String(soldLoc));
  console.log("Location of Terms" + String(stopLossTermsLoc));
  console.log("Location of Premiums" + String(stopLossPremiumLoc));

  // Find the rest of the values needed
  if (soldLoc) {
    console.log("Found Sold");
    // Write something to find the start date
    var firstCell = false;
    worksheet.getColumn(1).eachCell((cell, rowNumber) => {
      if (!firstCell) {
        firstCell = true;
        if (typeof cell.value === "string") {
          try {
            var res = cell.value.split("-");
            res = res[1];
            res = res.substring(res.indexOf(":") + 1, res.length - 1);
            res = new Date(res);
            returnValues.StartDate = res.getTime();
          } catch (err) {
            console.log(error);
          }
        }
      }
    });

    // Finds all the values
    worksheet.getColumn(1).eachCell((cell, rowNumber) => {
      if (
        rowNumber >= stopLossTermsLoc &&
        rowNumber < stopLossTermsLoc + 6 &&
        stopLossTermsLoc
      ) {
        if (
          valueNames.MGU.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.MGU = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.Carrier.some((element) =>
            String(cell.value).includes(element)
          )
        ) {
          returnValues.Carrier = worksheet
            .getRow(rowNumber)
            .getCell(soldLoc).value;
        }
        if (
          valueNames.Network.some((element) =>
            String(cell.value).includes(element)
          )
        ) {
          returnValues.Network = worksheet
            .getRow(rowNumber)
            .getCell(soldLoc).value;
        }
        if (
          valueNames.Admin.some((element) =>
            String(cell.value).includes(element)
          )
        ) {
          returnValues.Admin = worksheet
            .getRow(rowNumber)
            .getCell(soldLoc).value;
        }
        if (
          valueNames.MIC.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.MIC = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
      } else if (
        rowNumber >= stopLossPremiumLoc &&
        rowNumber < stopLossPremiumLoc + 13 &&
        stopLossPremiumLoc
      ) {
        if (
          valueNames.EE.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.EE = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.ES.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.ES = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.EC.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.EC = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.EF2.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.EF2 = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.EF4.some((element) => String(cell.value).includes(element))
        ) {
          returnValues.EF4 = worksheet.getRow(rowNumber).getCell(soldLoc).value;
        }
        if (
          valueNames.Comp.some((element) =>
            String(cell.value).includes(element)
          )
        ) {
          returnValues.Comp = worksheet
            .getRow(rowNumber)
            .getCell(soldLoc).value;
        }
        if (
          valueNames.AggComp.some((element) =>
            String(cell.value).includes(element)
          ) &&
          !returnValues.AggComp
        ) {
          returnValues.AggComp = worksheet
            .getRow(rowNumber)
            .getCell(soldLoc).value;
        }
      }
    });
  }

  // Restricts type to string or number
  for (const [key, value] of Object.entries(returnValues)) {
    if (typeof value != "string" && typeof value != "number") {
      returnValues[String(key)] = "";
    }
  }

  // Checks type of values return
  returnValues.MGU = String(returnValues.MGU);
  returnValues.Carrier = String(returnValues.Carrier);
  returnValues.Network = String(returnValues.Network);
  returnValues.Admin = String(returnValues.Admin);
  returnValues.StartDate = parseInt(returnValues.StartDate);
  if (!returnValues.StartDate) {
    returnValues.StartDate = "";
  }
  returnValues.MIC = parseInt(returnValues.MIC);
  if (!returnValues.MIC) {
    returnValues.MIC = "";
  }

  returnValues.EE = parseFloat(returnValues.EE);
  if (!returnValues.EE) {
    returnValues.EE = "";
  }
  returnValues.ES = parseFloat(returnValues.ES);
  if (!returnValues.ES) {
    returnValues.ES = "";
  }
  returnValues.EC = parseFloat(returnValues.EC);
  if (!returnValues.EC) {
    returnValues.EC = "";
  }
  returnValues.EF2 = parseFloat(returnValues.EF2);
  if (!returnValues.EF2) {
    returnValues.EF2 = "";
  }
  returnValues.EF4 = parseFloat(returnValues.EF4);
  if (!returnValues.EF4) {
    returnValues.EF4 = "";
  }
  returnValues.Comp = parseFloat(returnValues.Comp);
  if (!returnValues.Comp) {
    returnValues.Comp = "";
  }
  returnValues.AggComp = parseFloat(returnValues.AggComp);
  if (!returnValues.AggComp) {
    returnValues.AggComp = "";
  }

  console.log(returnValues);

  return returnValues;
});

ipcMain.handle("execute", async (e, commd) => {
  console.log("execute");
  var parsedData;
  try {
    parsedData = await execute(commd);
  } catch (err) {
    console.log(err);
  }

  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("insert", async (e, tableName, dataDict) => {
  console.log("insert");
  var parsedData;
  try {
    parsedData = await insert(tableName, dataDict);
  } catch (err) {
    console.log(err);
  }

  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("delete", async (e, tableName, searchDict) => {
  console.log("delete");
  var parsedData;
  try {
    parsedData = await delete_db(tableName, searchDict);
  } catch (err) {
    console.log(err);
  }

  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("update", async (e, tableName, dataDict, searchDict) => {
  console.log("update");
  var parsedData;
  try {
    parsedData = await update(tableName, dataDict, searchDict);
  } catch (err) {
    console.log(err);
  }

  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("getState", async () => {
  console.log("getState");
  var parsedData;
  try {
    parsedData = await getStateRequest();
  } catch (err) {
    console.error(err);
  }
  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("getCustomers", async () => {
  console.log("getCustomers");
  var parsedData;
  try {
    parsedData = await getCustomersRequest();
  } catch (err) {
    console.log(err);
  }

  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("getVendors", async () => {
  console.log("getVendors");
  var parsedData;
  try {
    parsedData = await getVendorsRequest();
  } catch (err) {
    console.error(err);
  }
  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("getPolicies", async () => {
  console.log("getPolicies");
  var parsedData;
  try {
    parsedData = await getPoliciesRequest();
  } catch (err) {
    console.error(err);
  }
  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("getCensus", async () => {
  console.log("getCensus");
  var parsedData;
  try {
    parsedData = await getCensusReques();
  } catch (err) {
    console.error(err);
  }
  console.log(parsedData);
  return parsedData;
});

ipcMain.handle("qboSignOut", async () => {
  console.log("qboSignOut");
  try {
    await revokeTokens();
  } catch (err) {
    console.log(err);
  }
});

ipcMain.handle("refreshCustomer", async () => {
  console.log("refreshCustomer");
  try {
    await refreshCustomer();
  } catch (err) {
    console.log(err);
  }
});

ipcMain.handle("refrershVendor", async () => {
  console.log("refrershVendor");
  try {
    await refreshVendor();
  } catch (err) {
    console.log(err);
  }
});

ipcMain.handle("qboSignIn", () => {
  https.get(
    "https://sabstestfunc.azurewebsites.net/api/QBORequestAuth?",
    (res) => {
      const { statusCode } = res;

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
        rawData += chunk;
      });

      res.on("end", () => {
        const winAuth = new BrowserWindow({
          width: 680,
          height: 800,
          webPreferences: {
            nodeIntegration: false,
          },
          icon: "./electron/icon.png",
        });
        winAuth.loadURL(rawData);
      });
    }
  );
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon: "./electron/icon.png",
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  }
}

function getStateRequest() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "getState",
        parameters: "{}",
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function getCustomersRequest() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "execute",
        parameters: JSON.stringify({ commd: "select * from Customer" }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData).res;
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function getVendorsRequest() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "execute",
        parameters: JSON.stringify({ commd: "select * from Vendor" }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData).res;
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function getPoliciesRequest() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "execute",
        parameters: JSON.stringify({ commd: "select * from Policy" }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData).res;
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function getCensusReques() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "execute",
        parameters: JSON.stringify({ commd: "select * from Census" }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData).res;
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function revokeTokens() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "revokeTokens",
        parameters: "{}",
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        const { statusCode } = res;

        console.log(statusCode);
        resolve(statusCode);
      }
    );

    req.end();
    req.on("error", (err) => {
      reject(err);
    });
  });
}

function refreshCustomer() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "refreshCustomer",
        parameters: "{}",
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        const { statusCode } = res;

        console.log(statusCode);
        resolve(statusCode);
      }
    );

    req.end();
    req.on("error", (err) => {
      reject(err);
    });
  });
}

function refreshVendor() {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "refreshVendor",
        parameters: "{}",
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        const { statusCode } = res;
        console.log(statusCode);
        resolve(statusCode);
      }
    );

    req.end();
    req.on("error", (err) => {
      reject(err);
    });
  });
}

function execute(commd) {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "execute",
        parameters: JSON.stringify({ commd }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function insert(tableName, dataDict) {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "insert",
        parameters: JSON.stringify({
          tableName: tableName,
          dataDict: dataDict,
        }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function delete_db(tableName, searchDict) {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "delete",
        parameters: JSON.stringify({
          tableName: tableName,
          searchDict: searchDict,
        }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function update(tableName, dataDict, searchDict) {
  return new Promise((resolve, reject) => {
    reqOptions = {
      method: "GET",
      headers: {
        call: "delete",
        parameters: JSON.stringify({
          tableName: tableName,
          dataDict: dataDict,
          searchDict: searchDict,
        }),
      },
    };

    let req = https.request(
      "https://sabstestfunc.azurewebsites.net/api/SABSAPP",
      reqOptions,
      (res) => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            console.log(rawData);
            parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            console.error(err.message);
          }
        });
      }
    );

    req.end();

    req.on("error", (err) => {
      reject(err);
    });
  });
}
