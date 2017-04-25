'use strict'
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")

//Middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() ){
        return next();
    }
    res.redirect("/login");
}

/* INDEX - show all campgrounds */
router.get("/", (req, res) => {
    console.log(req.user)
    //Get all campgrounds from DB, and THEN render that file
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});

/* CREATE - add new campground to DB */
router.post("/", isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, image: image, description: desc, author: author}; //gets from data, adds to campgrounds array
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log("Oh no! " + err)
        } else {
            console.log("Just created this in the DB: " + newlyCreated)
            res.redirect("/campgrounds"); //redirect back to campgrounds page
        }
    });
});

/* NEW - Show form to create a new campground */
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

/* SHOW - Shows more info about one campground */
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
            //this renders the show template with that campground
        }
    });
});

/* EDIT - This shows the edit form */
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err){
            res.residrect("/campgrounds");
        } else {
            console.log("this is being passed to the edit form... --->", foundCampground)
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    })
})

/* UPDATE - This is where the form submits*/
router.put("/:id", (req, res) =>{
    //find and update the correct campground
    //The arguments below: 1) what ID we're looking for, 2) the data that we wanna update, 3) callback
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    }) 
})

/* DESTROY - Delete campground */
router.delete("/:id", (req, res) =>{
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            console.log("There was an error->", err)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;