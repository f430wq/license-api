const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initDatabase } = require("./database/database");
const licenseRoutes = require("./routes/licenses");


const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/licenses", licenseRoutes);


// API Status
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        name: "License API",
        version: "1.0.0",
        status: "online"
    });
});


// Database
initDatabase();


// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ License API started on port ${PORT}`);
});
