'use strict'
const express = require("express");
const router = express.Router({mergeParams: true}); //this merges the parameters from campgrounds & comments together
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middleware = require("../middleware")

//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => { //by adding "isLoggedIn", it runs this first. If user is authenticated, it runs the "next" code (which is the callback)
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
           res.render("comments/new", { campground: campground }) 
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
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
                //add username and id to comment
                console.log("New comment's username will be " + req.user.username)
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;

                //connect new comment to campground
                comment.save();
                campground.comments.push(comment);
                campground.save();
                
                console.log(comment);
                //redirect campground show page
                res.redirect('/campgrounds/' + campground._id);
            }
         });
       }
   });
});

// Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
   Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// Comments Update
router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirecT("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;