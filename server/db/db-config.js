'use strict';

var mongoose = require('mongoose');

module.exports = {
    connect: function () {
        mongoose.connect('mongodb://localhost/temp-chat');
        mongoose.connection.on('open', function () {
            console.log('Connected to Mongoose...');
        });
    }
};
