const express = require("express");
const router = express.Router();

const { db } = require("../database/database");



// ===============================
// VERIFY / LINK HWID
// ===============================

router.post("/verify", (req, res) => {

    const { key, hwid } = req.body;


    if (!key || !hwid) {

        return res.status(400).json({
            success:false,
            message:"Missing key or hwid"
        });

    }



    db.get(
        `
        SELECT *
        FROM licenses
        WHERE key = ?
        `,
        [key],

        (err, license) => {


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



            if(license.hwid && license.hwid !== hwid){

                return res.json({
                    success:false,
                    message:"HWID mismatch"
                });

            }



            if(!license.hwid){


                db.run(
                    `
                    UPDATE licenses
                    SET hwid = ?
                    WHERE key = ?
                    `,
                    [
                        hwid,
                        key
                    ]
                );


            }



            res.json({

                success:true,
                message:"HWID verified"

            });



        }
    );


});




// ===============================
// RESET HWID
// ===============================

router.post("/reset", (req,res)=>{


    const { key } = req.body;



    if(!key){

        return res.status(400).json({

            success:false,
            message:"Missing key"

        });

    }



    db.run(

        `
        UPDATE licenses
        SET hwid = NULL
        WHERE key = ?
        `,

        [
            key
        ],


        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            if(this.changes === 0){

                return res.json({

                    success:false,
                    message:"License not found"

                });

            }



            res.json({

                success:true,
                message:"HWID reset"

            });


        }

    );


});



module.exports = router;
