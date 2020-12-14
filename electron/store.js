const Store = require('electron-store');

// Defines the file that saves the acess and refreash tokens for qbo
const schema = {
    access_token: {
        value: {
            type: "string",
            default: null
        },
        expires_in: {
            type: "number"
        }
    },
    refresh_token: {
        value: {
            type: "string"
        },
        expires_in: {
            type: "number"
        }
    },
    dbPath : {
        type: "string"
    }
  };

const name = "qboAuthData";
const encryptionKey = "VO0KrY1&-3$$h`K";
const qboAuthData = new Store({schema, name, encryptionKey});

exports.qboAuthData = qboAuthData