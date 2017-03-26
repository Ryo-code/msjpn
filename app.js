'use strict';
let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")
//Some people apparently style their requires like this (機能は変わらない)

mongoose.connect("mongodb://localhost/yelp_camp"); //this line created the "yelp_camp" database the first time this file was run, and connected to it from then on (so it creates it if it doesn't exist yet)
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
});

let Campground = mongoose.model("Campground", campgroundSchema); //This line turns the schema (ie. blueprint) of what a campground is, and compiles it into a model which has a bunch of methods like .find() and .create()

// Campground.create(
//     {
//         name: "Nova", 
//         image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"
//     }, (err, campground) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground...:")
//             console.log(campground)
//         }
//     });

let campgrounds = [
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
    {name: "Salmon Creek", image: "https://s-media-cache-ak0.pinimg.com/originals/34/ec/3e/34ec3e5544694c0d6da7e476f283747a.jpg"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbh1nOLC3xu2zALrM1M-zyLxdGOqNv_tg0-bH9b1JBBUDwTqNd"},
    {name: "Mountain Goat's Rest", image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg"},
];

app.get("/", (req, res) => {
   res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    //Get all campgrounds from DB, and THEN render that file
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds})
        }
    })
    // res.render("campgrounds", {campgrounds: campgrounds}); 
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image}; //gets from data, adds to campgrounds array
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log("Oh no! " + err)
        } else {
            res.redirect("/campgrounds"); //redirect back to campgrounds page
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, function () {
  console.log('The YelpCamp Server has started (on port 3000)!')
})