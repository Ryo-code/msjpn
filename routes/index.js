'use strict'
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Middleware
const isLoggedIn = (req, res, next) => { //Use this whenever you need to ensure the user is authenticated/logged in
    if(req.isAuthenticated() ){
        return next(); //This line means (if they're authenticated, move on to whatever is the NEXT thing)
    }
    res.redirect("/login"); //If they're not authenticated, redirect to the login page
}

//Root route
router.get("/", (req, res) => {
    res.render("landing");
});

//Show register form
router.get("/register", (req, res) =>{
    res.render("register");
});

//Handle sign up logic
router.post("/register", (req, res) =>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        //The code is written so that  if there's no error, you can skip to the authentication below (similar to login)
        if(err){
            console.log(err);
            return res.render("register"); //we use "return" as a clever way to GTFO of the callback
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

//Show Login Form
router.get("/login", (req, res) => {
    res.render("login");
})

//Handle login logic
//***The following lines of code are essentially:「app.post(route, middleware, callback)」****
router.post("/login", passport.authenticate("local",       // The ".authenticate" method takes the
    //form's req.body.password & req.body.username, and searches for them in the DB (ie. authenticates them)
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

//Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;