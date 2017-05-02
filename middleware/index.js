'use strict';
const Sight = require("../models/sight");
const Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkSightOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Sight.findById(req.params.id, function(err, foundSight){
           if(err){
               res.redirect("back");
           }  else {
               // Does user own the sight?
            if(foundSight.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                req.flash("error", "Sight not found") //Probably no one will ever see this error msg
                res.redirect("back");
            } else {
                
                // Does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        //The following flash message will basically only show if some smartass manually adds "/edit" into the URL bar
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!"); //In parentheses is really a key & value pair.
        //.flash doesn't actually render right away. The flash msg will render on the next page (ie. after redirecting to login)
    res.redirect("/login"); //The flash msg must be handled in 「routes/index」
}

module.exports = middlewareObj;