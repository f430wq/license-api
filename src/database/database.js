const sqlite3 = require("sqlite3").verbose();
const config = require("../config");

const path = require("path");

const dbPath = path.resolve(config.database.file);


const db = new sqlite3.Database(dbPath, (err)=>{

    if(err){

        console.error("❌ Database error:", err.message);

    } else {

        console.log("✅ SQLite database connected");

    }

});



function initDatabase(){

    db.serialize(()=>{


        db.run(`
            CREATE TABLE IF NOT EXISTS licenses (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                key TEXT UNIQUE NOT NULL,

                discord_id TEXT,

                hwid TEXT,

                status TEXT DEFAULT 'active',

                type TEXT DEFAULT 'lifetime',

                expires_at DATETIME,

                created_by TEXT,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                redeemed_at DATETIME

            )
        `);



        db.run(`
            CREATE TABLE IF NOT EXISTS users (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                discord_id TEXT UNIQUE NOT NULL,

                license_key TEXT,

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP

            )
        `);



    });


    console.log("✅ Database initialized");

}



module.exports = {

    db,
    initDatabase

};
