'use strict';

var express  = require('express');
var path     = require('path');
var mongoose = require('mongoose');
var routes   = require('./server/routes/home-routes');
var chat     = require('./server/controllers/socket-controller');

//========================
//== Initialize express ==
//========================
var app = express();
//== Have Express serve static assets (web server application should do this in production)
app.use(express.static(path.join(__dirname, 'client/public/build')));

//============================
//== Initialize view engine ==
//============================
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs');

//=======================
//== Initialize routes ==
//=======================
routes.initialize(app);

//======================================
//== Initialize websockets controller ==
//======================================
chat.initialize(app);

//==============================
//== Initialize DB Connection ==
//==============================
mongoose.connect('mongodb://localhost/temp-chat');
mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose...');
});

//== Expose the express app
module.exports = app;
