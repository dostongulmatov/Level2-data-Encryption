//jshint esversion:6
require('dotenv').config()
const express = require("express");;
const ejs = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');  
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true})
console.log(process.env.API_KEY)
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})
const secret = "Thisisourlittlesecret"
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render('home');
})
app.route('/register')
  .get(function(req, res){
    res.render('register');
  })
  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    })
    newUser.save(function(err){
      if(err){console.log(err)}
      else{res.render("secrets");}
    });
  })

app.route("/login")
  .get(function(req, res){
    res.render('login');
  })
  .post(function(req, res){
    // email: req.body.username,
    // password: req.body.password
    User.findOne({ email: req.body.username}, function(err, foundUser){
      if(err){res.render("Sorry no this kind of account registered")}
      else{
        if(foundUser){
          if(foundUser.password === req.body.password){
            res.render('secrets')
          }
        }
      }
    })
  })

app.get("/submit", function(req, res){
  res.render('submit');
})


app.listen(3000, function(){
  console.log("Server is running on port 3000")
})
