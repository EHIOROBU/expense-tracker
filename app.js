const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routers/route");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
    console.error("MongoDB URI is not set");
    process.exit(1);
}

mongoose.connect(dbUri)
    .then(() => {
        console.log("Connected to Database");
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is listening on Port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error occurred connecting to Database", error);
        process.exit(1);
    });

app.use(authRoute);