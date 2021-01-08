//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

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
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if (result) {
                        res.render("secrets");
                    } else {
                        res.send("Wrong password!");
                    }
                });
            } else {
                res.send("Username not registered.");
            }
        } else {
            console.log(err);
        }
    })
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (!err) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            })
            newUser.save((err) =>{
                if (!err) {res.render("secrets");}
            });
        }
    });
    
});

app.post("/submit", (req, res) => {

});







app.listen(3000, () => {
    console.log("Server started on port 3000.");
});
