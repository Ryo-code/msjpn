'use strict';
const mongoose = require("mongoose");

//SCHEMA SETUP (note: schema is the structure/organization of a database)
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
        // This means that we don't actually embed the comments, we embed just the reference TO THOSE COMMENTS
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema); 
//This line turns the schema (ie. blueprint) of what a campground is, and
//compiles it into a model which has a bunch of methods like .find() & .create()