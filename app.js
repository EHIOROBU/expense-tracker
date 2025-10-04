const express = require("express")
const mongoose = require("mongoose")
const mongodb = require("mongodb")
const cookieParser = require("cookie-parser")
const authRoute = require("./routers/route")

require("dotenv").config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())



mongoose.connect(process.env.URI)
.then(()=>{
    console.log("connected to Database")
    app.listen(3000, ()=>{
        console.log("connection to Port 3000")
    })
})
.catch((error)=>{
console.error("error occured connecting to Database", error)
process.exit(1)
})

app.use(authRoute)