const express = require("express");
const router = express.Router();

const { db } = require("../database/database");


// ===============================
// GET SCRIPT
// ===============================

router.post("/get", (req, res) => {

    const { key } = req.body;


    if (!key) {

        return res.status(400).json({
            success:false,
            message:"Missing license key"
        });

    }



    db.get(
        `
        SELECT *
        FROM licenses
        WHERE key = ?
        `,
        [key],

        (err, license)=>{


            if(err){

                return res.status(500).json({
                    success:false,
                    error:err.message
                });

            }



            if(!license){

                return res.json({

                    success:false,
                    message:"Invalid license"

                });

            }



            if(!license.discord_id){

                return res.json({

                    success:false,
                    message:"License not redeemed"

                });

            }



            res.json({

                success:true,

                script:
                `
                loadstring(game:HttpGet("https://YOUR_SCRIPT_HOST/script.lua"))()
                `

            });



        }
    );


});


module.exports = router;
