'use strict';

var http     = require('http');
var socketio = require('socket.io');
var mongoose = require('mongoose');

module.exports = {
    initialize: function (app) {
        //== Create the http server and websockets
        var server = http.Server(app);
        var io = socketio(server);

        server.listen(3201);
        console.log('socket.io server listening on port 3201');

        //== Listen for websockets connections
        io.on('connection', function (client) {
            //== Listen for join events from the client
            client.on('join', function (data) {
                io.emit('joined', { name: data })
                console.log(data + " has joined the chat");
            });
            //== Listen for message events from the client
        })
    }
};
