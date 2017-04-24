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

const commentRoutes     = require("./routes/comments");
const campgroundRoutes  = require("./routes/campgrounds");
const indexRoutes        = require("./routes/index") //Could also have been called "authRoutes" ;)

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

app.use((req, res, next) =>{           //This will run for every single route.
    res.locals.currentUser = req.user; //Whatever we put in "res.locals" is what's available inside of the user's current template
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, () => {
  console.log('The YelpCamp Server has started (on port 3000)!')
})