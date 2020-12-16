const Store = require('electron-store');

// Defines the file that saves the acess and refreash tokens for qbo
const schema = {
    token_type: {
        type: "string",
        default: "bearer"
    }, 
    access_token: {
        type: "string",
        default: ""
    },
    expires_in: {
        type: "integer",
        default: 100
    },
    refresh_token: {
        type: "string",
        default: ""
    },
    x_refresh_token_expires_in: {
        type: "integer",
        default: 100
    },
    createdAt: {
        type: "integer",
        default: Date.now()
    }
}

const name = "qboAuthClientData";
const encryptionKey = "VO0KrY1&-3$$h`K";
const qboAuthClientData = new Store({schema, name, encryptionKey});

exports.qboAuthClientData = qboAuthClientData