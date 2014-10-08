'use strict';

var http         = require('http');
var socketio     = require('socket.io');
var mongoose     = require('mongoose');
var UserModel    = require('../models/user');
var MessageModel = require('../models/message');

module.exports = {
    initialize: function (app) {
        //===========================================
        //== Create the http server and websockets ==
        //===========================================
        var server    = http.Server(app),
            io        = socketio(server),
            users,
            session,
            messages  = [];

        server.listen(3201);
        console.log('socket.io server listening on port 3201');

        //==================================================
        //== Listen for connection events from the client ==
        //==================================================
        io.on('connection', function (client) {
            //== Listen for join events from the client
            client.on('join', function (name) {
                //== Add the username to the client and query the current list of chatters
                client.username = name;
                UserModel.findOne({'chatRoom': 'default'}, function (err, users) {
                    //== If no user documents exist with chatters then create a new document
                    if (!users) {
                        console.log('Creating chatter document in Mongo');
                        users = new UserModel({ chatRoom: 'default' });
                    }
                    //== Add the new chatter to the chat room list in the DB
                    users.chatters.push(name);
                    users.save(function (err) {
                        if (err) {
                            console.log(name + ' was not able to join the chat because of DB errors');
                        } else {
                            //== Get the recent messages from the DB
                            MessageModel.findOne({ 'chatRoom': 'default' }, function (err, session) {
                                if (session.messages[0]) {
                                    messages = session.messages;
                                }
                                //== Emit the joined event to the clients
                                io.emit('joined', { name: name, chatters: users.chatters, messages: messages });
                                console.log(name + ' has joined the chat');
                            });
                        }
                    });
                });
            });

            //===============================================
            //== Listen for message events from the client ==
            //===============================================
            client.on('message', function (data) {
                MessageModel.findOne({ 'chatRoom': 'default' }, function (err, session) {
                    //== If no documents exist with messages then create a new document
                    if (!session) {
                        console.log('Creating messages document in Mongo');
                        session = new MessageModel({ chatRoom: 'default' });
                    }
                    //== Add the message to the messages list on Mongo
                    session.messages.unshift({ nickname: data.name, text: data.message });
                    //== Only keep the last 10 messages
                    if (session.messages.length > 10) {
                        session.messages = session.messages.slice(0, 10);
                    }
                    //== Save the recent messages to the DB
                    session.save(function (err) {
                        if (err) {
                            console.log('Could not save message to the DB because of errors');
                        } else {
                            //== Emit the message event to the clients
                            io.emit('message', { name: data.name, message: data.message });
                        }
                    });
                });
            });

            //==================================================
            //== Listen for disconnect events from the client ==
            //==================================================
            client.on('disconnect', function (data) {
                UserModel.findOne({'chatters.0': {'$exists': true}}, function (err, users) {
                    //== Remove the diconnected user from the active document in the DB
                    if (users.chatters.indexOf(client.username) > -1) {
                        users.chatters.splice(users.chatters.indexOf(client.username), 1);
                    }
                    users.save(function (err) {
                        //== Emit the disconnect message to the remaining clients (with errors if they exist)
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
        });
    }
};
