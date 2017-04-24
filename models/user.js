'use strict';
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); //this gives User access to fancy new methods :)

module.exports = mongoose.model("User", UserSchema);