'use strict'
const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");
const geocoder = require("geocoder");

/* INDEX - show all campgrounds */
router.get("/", (req, res) => {
        console.log("req.user ->", req.user)
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

/* CREATE - add new campground to DB */
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location,  (err, data) => {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        const location = data.results[0].formatted_address;
        const newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, (err, newlyCreated) => {
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log("Just created this in the DB: " + newlyCreated)
                res.redirect("/campgrounds");
            }
        });
    });
});

/* NEW - Show form to create a new campground */
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        if(err){
            req.flash("error", "Campground not found") //Unlikely someone will ever see this, but you can handle errors like this anywhere
        }
        res.render("campgrounds/edit", {campground: foundCampground})
    });
});

/* UPDATE - This is where the form submits*/
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
    //find and update the correct campground
    //The arguments below: 1) what ID we're looking for, 2) the data that we wanna update, 3) callback
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

/* UPDATE - This is where the form submits*/
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => { //俺自身がmiddlewareを入れたけど、なかったらやばくない？
    geocoder.geocode(req.body.location, (err, data) => {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, (err, campground) => {
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

/* DESTROY - Delete campground */
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) =>{
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
