'use strict'
const express = require("express");
const router = express.Router({mergeParams: true}); //this merges the parameters from campgrounds & comments together
const Campground = require("../models/campground")
const Comment = require("../models/comment")

//Middleware
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated() ){
        return next();
    }
    res.redirect("/login");
}

//Comments New
router.get("/new", isLoggedIn, (req, res) => { //by adding "isLoggedIn", it runs this first. If user is authenticated, it runs the "next" code (which is the callback)
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
           res.render("comments/new", { campground: campground }) 
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, (req, res) => {
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

module.exports = router;