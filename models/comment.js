'use strict';
const mongoose      = require("mongoose");

//SCHEMA SETUP (note: schema is the structure/organization of a database)
const commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: { //"author" now is an object with a username & id
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //This refers to the model that we're going to refer to with this ObjectId (User in this case)
        },
        username: String
    },
});

module.exports = mongoose.model("Comment", commentSchema);
