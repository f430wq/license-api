require("dotenv").config();


function adminAuth(req, res, next) {


    const secret = req.headers["x-api-secret"];


    if(!secret){

        return res.status(401).json({

            success:false,
            message:"Missing API secret"

        });

    }



    if(secret !== process.env.API_SECRET){

        return res.status(403).json({

            success:false,
            message:"Invalid API secret"

        });

    }



    next();

}


module.exports = adminAuth;
