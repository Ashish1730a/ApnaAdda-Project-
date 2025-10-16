const express = require("express");
const app = express();
const jhatu = require("./routes/user.js")

app.get("/",(req,res) => {
    res.send("Hi, I am root!");
})

app.use("/users", jhatu);



app.listen("3000", () => {
    console.log("server is listing to 3000")
})
