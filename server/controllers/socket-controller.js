'use strict';

var http         = require('http');
var socketio     = require('socket.io');
var mongoose     = require('mongoose');
var UserModel    = require('../models/user');
var MessageModel = require('../models/message');

module.exports = {
    initialize: function (app) {
        //== Create the http server and websockets
        var server = http.Server(app),
            io     = socketio(server);

        server.listen(3201);
        console.log('socket.io server listening on port 3201');

        //== Listen for websockets connections
        io.on('connection', function (client) {
            //== Listen for join events from the client
            client.on('join', function (data) {
                //== Add the username to the client and query the current list of chatters
                client.username = data;
                UserModel.findOne({'chatters.0': {'$exists': true}}, function (err, users) {
                    //== If no user documents exist with chatters then create a new document
                    if (!users) {
                        console.log('Creating chatter document in Mongo');
                        //== TODO: Timestamp the new user document so old documents (chat sessions) can contain history-type data
                        var users = new UserModel();
                    }
                    //== Add the new chatter to the active document in the DB
                    users.chatters.push(data);
                    users.save(function (err) {
                        if (err) {
                            console.log(data + " was not able to join the chat because of DB errors");
                        } else {
                            //== Emit the joined event to the clients
                            io.emit('joined', data);
                            console.log(data + " has joined the chat");
                        }
                    });
                });
            });

            //== Listen for message events from the client
            client.on('message', function (data) {
                io.emit('message', { name: data.name, message: data.message });
            });

            //== Listen for disconnect events from the client
            client.on('disconnect', function (data) {
                //== Query the current document for chatters
                UserModel.findOne({'chatters.0': {'$exists': true}}, function (err, users) {
                    //== Remove the diconnected user from the active document in the DB
                    if (users.chatters.indexOf(client.username) > -1) {
                        //== TODO: Add some more fields for history reporting
                        users.chatters.splice(users.chatters.indexOf(client.username), 1);
                    }
                    users.save(function (err) {
                        //== Emit the disconnect message (with errors if the exist)
                        if (err) {
                            io.emit('disconnect', client.username);
                            console.log(client.username + " has left the chat (with errors)");
                        } else {
                            io.emit('disconnect', client.username);
                            console.log(client.username + " has left the chat");
                        }
                    });
                });
            });
        })
    }
};
