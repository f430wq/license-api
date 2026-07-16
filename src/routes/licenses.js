const express = require("express");
const router = express.Router();

const { db } = require("../database/database");


// Générer une clé
router.post("/generate", (req, res) => {

    const key =
        "LIC-" +
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 10).toUpperCase();


    db.run(
        `
        INSERT INTO licenses (key)
        VALUES (?)
        `,
        [key],
        function(err) {

            if(err){
                return res.status(500).json({
                    success:false,
                    error:err.message
                });
            }


            res.json({
                success:true,
                key:key
            });

        }
    );

});


// Vérifier une clé
router.post("/verify", (req,res)=>{

    const { key } = req.body;


    if(!key){
        return res.status(400).json({
            success:false,
            message:"Missing key"
        });
    }


    db.get(
        `
        SELECT * FROM licenses
        WHERE key = ?
        `,
        [key],
        (err,row)=>{


            if(err){
                return res.status(500).json({
                    success:false,
                    error:err.message
                });
            }


            if(!row){
                return res.json({
                    success:false,
                    message:"Invalid key"
                });
            }


            res.json({
                success:true,
                license:row
            });

        }
    );

});


module.exports = router;
