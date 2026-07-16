const express = require("express");
const router = express.Router();

const db = require("../database/database");


// Script Roblox à retourner après validation
const SCRIPT = `

-- License System
-- Verified successfully

print("License accepted")

-- Put your Roblox code here

`;



// POST /script/get

router.post("/get", async (req, res) => {

    try {

        const {
            key
        } = req.body;


        if (!key) {

            return res.json({

                success: false,

                message: "Missing key"

            });

        }



        const license = await db.get(

            "SELECT * FROM licenses WHERE key = ?",

            [
                key
            ]

        );



        if (!license) {

            return res.json({

                success:false,

                message:"Invalid key"

            });

        }



        if (license.status === "revoked") {

            return res.json({

                success:false,

                message:"License revoked"

            });

        }



        return res.json({

            success:true,

            script:SCRIPT

        });



    } catch(error) {


        console.error(
            error
        );


        return res.status(500).json({

            success:false,

            message:"Server error"

        });


    }


});



module.exports = router;
