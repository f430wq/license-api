const express = require("express");
const router = express.Router();

const { db } = require("../database/database");
const adminAuth = require("../middleware/auth");



// Génération clé
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




// =================================
// GENERATE LICENSE
// =================================

router.post("/generate", adminAuth, (req,res)=>{


    const {
        type = "lifetime",
        days = null,
        created_by = "admin"
    } = req.body;



    const key = generateKey();


    let expires_at = null;


    if(days){

        const date = new Date();

        date.setDate(
            date.getDate() + Number(days)
        );

        expires_at = date.toISOString();

    }




    db.run(

        `
        INSERT INTO licenses
        (
            key,
            type,
            expires_at,
            created_by
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
        `,

        [
            key,
            type,
            expires_at,
            created_by
        ],



        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }




            res.json({

                success:true,

                license:{

                    key:key,
                    type:type,
                    expires_at:expires_at

                }

            });



        }


    );



});







// =================================
// VERIFY LICENSE
// =================================

router.post("/verify",(req,res)=>{


    const { key } = req.body;



    if(!key){

        return res.status(400).json({

            success:false,
            message:"Missing key"

        });

    }




    db.get(

        `
        SELECT *
        FROM licenses
        WHERE key = ?
        `,

        [key],


        (err,license)=>{


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




            if(license.status === "revoked"){


                return res.json({

                    success:false,
                    message:"License revoked"

                });

            }





            if(
                license.expires_at &&
                new Date(license.expires_at) < new Date()
            ){


                return res.json({

                    success:false,
                    message:"License expired"

                });


            }





            res.json({

                success:true,
                license:license

            });



        }


    );


});








// =================================
// REDEEM LICENSE
// =================================

router.post("/redeem",(req,res)=>{


    const {
        key,
        discord_id
    } = req.body;




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


        (err,license)=>{



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






            if(license.discord_id){


                return res.json({

                    success:false,
                    message:"Already redeemed"

                });


            }







            db.run(

                `
                UPDATE licenses

                SET

                discord_id = ?,
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
