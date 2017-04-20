'use strict';

const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const Campground  = require("./models/campground");
const seedDB      = require("./seeds"); //because you did "module.exports = seedDB" in seeds.js

mongoose.connect("mongodb://localhost/yelp_camp"); //creates "yelp_camp" DB if it doesn't exist, connects to it if it does
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", (req, res) => {
    res.render("landing");
});

/* INDEX - show all campgrounds */
app.get("/campgrounds", (req, res) => {
    //Get all campgrounds from DB, and THEN render that file
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    })
});

/* CREATE - add new campground to DB */
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

/* SHOW - Shows more info about one campground */
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});
            //this renders the show template with that campground
        }
    });
});

app.listen(3000, () => {
  console.log('The YelpCamp Server has started (on port 3000)!')
})