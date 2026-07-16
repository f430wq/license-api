const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDatabase } = require("./database/database");

const licenseRoutes = require("./routes/licenses");
const hwidRoutes = require("./routes/hwid");


const app = express();


app.use(cors());
app.use(express.json());


// Routes
app.use("/licenses", licenseRoutes);
app.use("/hwid", hwidRoutes);


// Status
app.get("/", (req,res)=>{

    res.json({

        success:true,
        name:"License API",
        version:"1.0.0",
        status:"online"

    });

});


// Database
initDatabase();



const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(`✅ License API started on port ${PORT}`);

});
