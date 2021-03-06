//jshint esversion:6
require('dotenv').config();  // Necessary to be at the top
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true}
));

mongoose.connect("mongodb://localhost:27017/userBD")

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

//Mongoose encryption
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("user", userSchema)

app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.get("/register", function(req, res) {
  res.render("register")
})

app.post("/register", function(req, res) {
  const userName = req.body.username
  const password = req.body.password

  const newUser = User({
    email: userName,
    password: password
  })
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets")
    }
  });
})

app.post("/login", function(req, res) {
  const userName = req.body.username
  const password = req.body.password

  User.findOne({email: userName}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser.password === password) {
        res.render("secrets")
      }
    }
  })
})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
})
