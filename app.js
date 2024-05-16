const express = require("express");
const connectDB = require("./config/database");
const router = require("./routes/index");
const {authenticate} = require("./middleware/authenticate")
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

connectDB(process.env.MONGO_STRING);

app.use(router);

app.listen(3001);
