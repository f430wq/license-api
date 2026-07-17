const path = require("path");
require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,

    database: {
        file: process.env.DATABASE_FILE || path.join(__dirname, "database", "license.sqlite")
    },

    license: {
        keyLength: 32,
        hwidResetCooldown: 86400000
    }
};
