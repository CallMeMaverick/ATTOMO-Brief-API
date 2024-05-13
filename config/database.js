const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });


const connectDB = async (connectionString) => {
    try {
        mongoose.connect(connectionString);
        console.log("Successfully connection to DB");
    } catch (err) {
        console.log("Failed connection: ", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;