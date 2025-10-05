const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routers/route");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const dbUri = process.env.URI;

// if (!dbUri) {
//     console.error("MongoDB URI is not set");
//     process.exit(1);
// }

mongoose.connect(dbUri)
    .then(() => {
        console.log("Connected to Database");
        app.listen(3000, () => {
            console.log("Server is listening on Port 3000");
        });
    })
    .catch((error) => {
        console.error("Error occurred connecting to Database", error);
        process.exit(1);
    });

app.use(authRoute);