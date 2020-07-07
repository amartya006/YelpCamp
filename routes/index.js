var express= require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/userModel");
var passport = require("passport");

//ROUTES
router.get("/", function(req, res){
    res.render("home");
});




//Auth Routes

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            req.flash("error", err.message)
            res.redirect("/register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully Created Your Account")
            res.redirect("/campground")
        })
    })
});

router.get("/login", function(req,res){
    
    res.render("login")
});

router.post("/login",passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}) ,function(req,res){
    req.flash("Successfully Logged In")
});

router.get("/logout", function(req, res){
    req.logout()
    req.flash("success", "Successfully Logged Out")
    res.redirect("/login")
});


module.exports = router;