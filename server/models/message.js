'use strict';

var mongoose = require('mongoose');

//== Define the schema for our chat message model
var messageSchema = mongoose.Schema({
    chatRoom: String,
    messages: [
        {
            nickname: String,
            text:     String,
            dateTime: { type: Date, default: Date.now }
        }
    ]
});

//== Expose the model for users
module.exports = mongoose.model('Message', messageSchema);