const Store = require('electron-store');

const schema = {
    key: {
        type: 'string'
    },
    keyR: {
        type: 'string'
    },
    dbPath : {
        type: "string"
    }
  };

const name = "settings";
const encryptionKey = "VO0KrY1&-3$$h`K";
const settings = new Store({schema, name, encryptionKey});

exports.settings = settings