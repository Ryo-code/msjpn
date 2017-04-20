'use strict';
const mongoose      = require("mongoose");

//SCHEMA SETUP (note: schema is the structure/organization of a database)
const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    // published: {
    //     type: Date,
    //     default: Date.now
    // }
});

module.exports = mongoose.model("Comment", commentSchema);
