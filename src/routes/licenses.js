const express = require("express");
const router = express.Router();

const { db } = require("../database/database");


// Génération d'une clé aléatoire
function generateKey() {

    const part1 = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    const part2 = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    return `LIC-${part1}-${part2}`;
}



// ===============================
// GENERATE KEY
// ===============================

router.post("/generate", (req, res) => {

    const key = generateKey();


    db.run(
        `
        INSERT INTO licenses (key)
        VALUES (?)
        `,
        [key],
        function(err) {


            if(err) {

                return res.status(500).json({
                    success:false,
                    error:err.message
                });

            }


            res.json({

                success:true,
                message:"License generated",
                key:key

            });


        }
    );


});




// ===============================
// VERIFY KEY
// ===============================

router.post("/verify", (req,res)=>{


    const { key } = req.body;


    if(!key) {

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



            if(license.status !== "active"){

                return res.json({

                    success:false,
                    message:"License inactive"

                });

            }



            res.json({

                success:true,
                license:license

            });



        }

    );


});




// ===============================
// REDEEM KEY
// ===============================

router.post("/redeem", (req,res)=>{


    const { key, discord_id } = req.body;



    if(!key || !discord_id){

        return res.status(400).json({

            success:false,
            message:"Missing data"

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
                    message:"Invalid key"

                });

            }



            if(license.discord_id){

                return res.json({

                    success:false,
                    message:"Key already redeemed"

                });

            }



            db.run(

                `
                UPDATE licenses
                SET discord_id = ?,
                status = 'used',
                redeemed_at = CURRENT_TIMESTAMP

                WHERE key = ?
                `,

                [
                    discord_id,
                    key
                ],


                function(error){


                    if(error){

                        return res.status(500).json({

                            success:false,
                            error:error.message

                        });

                    }



                    res.json({

                        success:true,
                        message:"License redeemed"

                    });


                }

            );



        }

    );


});



module.exports = router;
