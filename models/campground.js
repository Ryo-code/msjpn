'use strict';
const mongoose = require("mongoose");

//SCHEMA SETUP (note: schema is the structure/organization of a database)
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: Number,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        // This means that we don't actually embed the comments, we embed just the reference TO THOSE COMMENTS
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
//This line turns the schema (ie. blueprint) of what a campground is, and
//compiles it into a model which has a bunch of methods like .find() & .create()
