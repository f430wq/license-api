require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3000,

    database: {
        file: process.env.DATABASE_FILE || "./database/license.sqlite"
    },

    license: {
        keyLength: 32,
        hwidResetCooldown: 86400000
    }
};
