//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, foundUser) => {
        if (!err) {
            if (foundUser && foundUser.password === req.body.password) {
                console.log("found password: " + foundUser.password);
                res.render("secrets");
            } else {
                res.send("Wrong user or password!");
            }
        } else {
            console.log(err);
        }
    })
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) =>{
        if (!err) {res.render("secrets");}
    });
});

app.post("/submit", (req, res) => {

});







app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
