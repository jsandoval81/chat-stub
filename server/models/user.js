'use strict';

var mongoose = require('mongoose');

//== Define the schema for our user (chatter) model
var userSchema = mongoose.Schema({
    chatters: [String]
});

//== Expose the model for users
module.exports = mongoose.model('User', userSchema);