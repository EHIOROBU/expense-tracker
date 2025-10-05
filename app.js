const express = require("express");
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const authRoute = require("./routers/route");
require("dotenv").config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


mongoose.connect(process.env.URI)
    .then(() => {
        console.log("Connected to database");
        app.listen(3000, () => {
            console.log("Running on Port 3000");
        });
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
    });

app.use(authRoute);