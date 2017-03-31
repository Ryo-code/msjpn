'use strict';

let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    //Some people apparently style their requires like this (機能は変わらない)

mongoose.connect("mongodb://localhost/yelp_camp"); //this line created the "yelp_camp" database the first time this file was run, and connected to it from then on (so it creates it if it doesn't exist yet)
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Campground.create(
//     {
//         name: "Nova", 
//         image: "http://nibler.ru/uploads/users/7075/2012-08-20/chebynkin-arsenixc-arseniy-krasivye-kartinki_405649275.jpg",
//         description: "Pretty nice and sunny place"
//     }, (err, campground) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created campground...:")
//             console.log(campground)
//         }
//     }
// );


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
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
            //this renders the show template with that campground
        }
    });
});

app.listen(3000, function () {
  console.log('The YelpCamp Server has started (on port 3000)!')
})