'use strict'
const express    = require("express");
const router     = express.Router();
const Sight = require("../models/sight");
const middleware = require("../middleware");
const geocoder   = require("geocoder");
const fs         = require("fs");
// const fileUpload = require('express-fileupload'); 今は使われてない

/* INDEX - show all sights */
router.get("/", (req, res) => {
        console.log("req.user ->", req.user)
    // Get all sights from DB
    Sight.find({}, (err, allSights) => {
        if(err){
            console.log(err);
        } else {
            res.render("sights/index", {sights: allSights});
        }
    });
});

/* CREATE - add new sights to DB */
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
        const newSight = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
        // Create a new sight and save to DB
        Sight.create(newSight, (err, newlyCreated) => {
            if(err){
                console.log(err);
            } else {
                //redirect back to sights page
                console.log("Just created this in the DB: " + newlyCreated)
                res.redirect("/sights");
            }
        });
    });
});

/* NEW - Show form to create a new sight */
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("sights/new");
});

/* SHOW - Shows more info about one sight */
router.get("/:id", (req, res) => {
    Sight.findById(req.params.id).populate("comments").exec((err, foundSight) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundSight);
            res.render("sights/show", {sight: foundSight});
            //this renders the show template with that sight
        }
    });
});

/* EDIT - This shows the edit form */
router.get("/:id/edit", middleware.checkSightOwnership, (req, res) => {
    Sight.findById(req.params.id, (err, foundSight) =>{
        if(err){
            req.flash("error", "Sight not found") //Unlikely someone will ever see this, but you can handle errors like this anywhere
        }
        res.render("sights/edit", {sight: foundSight})
    });
});

/* UPDATE - This is where the form submits*/
router.put("/:id", middleware.checkSightOwnership, (req, res) =>{
    //find and update the correct sight
    //The arguments below: 1) what ID we're looking for, 2) the data that we wanna update, 3) callback
    Sight.findByIdAndUpdate(req.params.id, req.body.sight, (err, updatedSight) => {
        if(err){
            res.redirect("/sights");
        } else {
            //redirect somewhere(show page)
            res.redirect("/sights/" + req.params.id)
        }
    });
});

/* UPDATE - This is where the form submits*/
router.put("/:id", middleware.checkSightOwnership, (req, res) => { //俺自身がmiddlewareを入れたけど、なかったらやばくない？
    geocoder.geocode(req.body.location, (err, data) => {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
        Sight.findByIdAndUpdate(req.params.id, {$set: newData}, (err, sight) => {
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/sights/" + sight._id);
            }
        });
    });
});

/* DESTROY - Delete sight */
router.delete("/:id", middleware.checkSightOwnership, (req, res) =>{
    Sight.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            console.log("There was an error->", err)
            res.redirect("/sights");
        } else {
            res.redirect("/sights");
        }
    });
});

module.exports = router;
