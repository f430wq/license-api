const express = require("express");
const router = express.Router();

const { db } = require("../database/database");
const adminAuth = require("../middleware/auth");



// =================================
// LIST ALL LICENSES
// =================================

router.get("/licenses", adminAuth, (req, res) => {


    db.all(
        `
        SELECT *
        FROM licenses
        ORDER BY id DESC
        `,
        [],

        (err, rows) => {


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                licenses:rows

            });


        }
    );


});




// =================================
// REVOKE LICENSE
// =================================

router.post("/revoke", adminAuth, (req,res)=>{


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
        SET status = 'revoked'
        WHERE key = ?
        `,

        [key],

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
                message:"License revoked"

            });



        }

    );


});




// =================================
// ACTIVATE LICENSE
// =================================

router.post("/activate", adminAuth, (req,res)=>{


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
        SET status = 'active'
        WHERE key = ?
        `,

        [key],

        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"License activated"

            });


        }

    );


});




// =================================
// DELETE LICENSE
// =================================

router.delete("/delete", adminAuth, (req,res)=>{


    const { key } = req.body;



    if(!key){

        return res.status(400).json({

            success:false,
            message:"Missing key"

        });

    }



    db.run(

        `
        DELETE FROM licenses
        WHERE key = ?
        `,

        [key],

        function(err){


            if(err){

                return res.status(500).json({

                    success:false,
                    error:err.message

                });

            }



            res.json({

                success:true,
                message:"License deleted"

            });


        }

    );


});



module.exports = router;
