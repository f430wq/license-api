const express = require("express");

const router = express.Router();

const db = require("../database");



const SCRIPT = `

-- Roblox Script
-- Loaded by License System

print("License verified")

-- Put your real script here

`;




// GET SCRIPT

router.post("/get", async (req,res)=>{


    try{


        const {
            key
        } = req.body;




        if(!key){


            return res.json({

                success:false,

                message:"Missing key"

            });


        }





        const license =
        await db.get(

            "SELECT * FROM licenses WHERE key = ?",

            [key]

        );





        if(!license){


            return res.json({

                success:false,

                message:"Invalid license"

            });


        }




        if(
            license.status === "revoked"
        ){


            return res.json({

                success:false,

                message:"License revoked"

            });


        }





        res.json({

            success:true,

            script:SCRIPT

        });




    }


    catch(error){


        console.error(error);


        res.status(500).json({

            success:false

        });


    }


});





module.exports = router;
