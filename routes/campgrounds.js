'use strict'
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")

/* INDEX - show all campgrounds */
router.get("/", (req, res) => {
    console.log(req.user)
    //Get all campgrounds from DB, and THEN render that file
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
});

/* CREATE - add new campground to DB */
router.post("/", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;

    let newCampground = {name: name, image: image, description: desc}; //gets from data, adds to campgrounds array
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
router.get("/new", (req, res) => {
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

module.exports = router;