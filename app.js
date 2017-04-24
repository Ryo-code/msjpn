'use strict';

const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const Campground  = require("./models/campground");
const Comment     = require("./models/comment");
const User        = require("./models/user");
const seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp"); //creates "yelp_camp" DB if it doesn't exist, connects to it if it does
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //we did 「express.static("public")」 before, but "__dirname" just refers to the directory name of the current module which is safer in case you change around your files or whatever (feel free to console log __dirname for proof)
seedDB();

//*****PASSPORT CONFIGURATION*****
app.use(require("express-session")({
    secret: "Web development is cool!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) ); //this gives us the ".authenticate" method in the login post route
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//******ROUTES******
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
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
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
    res.render("campgrounds/new");
});

/* SHOW - Shows more info about one campground */
app.get("/campgrounds/:id", (req, res) => {
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


// ================
// COMMENTS ROUTES
// ================

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
           res.render("comments/new", { campground: campground }) 
        }
    })
});

app.post("/campgrounds/:id/comments", (req, res) => {
   //lookup campground using ID
   Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        //create new comment
        Comment.create(req.body.comment, (err, comment) => {
            if(err){
                console.log(err);
            } else {
                //connect new comment to campground
                campground.comments.push(comment);
                campground.save();

                //redirect campground show page
                res.redirect('/campgrounds/' + campground._id);
            }
         });
       }
   });
});

// ================
//   AUTH ROUTES
// ================

app.get("/register", (req, res) =>{
    res.render("register");
})

app.post("/register", (req, res) =>{
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        //The coe is written so that  if there's no error, you can skip to the authentication below (similar to login)
        if(err){
            console.log(err);
            return res.render("register"); //we use "return" as a clever way to GTFO of the callback
        }
        passport.authenticate("local")(req, res, () => { 
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", (req, res) => {
    res.render("login")
})

//***The following lines of code are essentially:「app.post(route, middleware, callback)」****
app.post("/login", passport.authenticate("local",       // The ".authenticate" method takes the
    //form's req.body.password & req.body.username, and searches for them in the DB (ie. authenticates them)
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

app.listen(3000, () => {
  console.log('The YelpCamp Server has started (on port 3000)!')
})