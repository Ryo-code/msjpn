'use strict';
const mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("User", UserSchema);