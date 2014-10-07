
(function ($) {
    'use strict';

    var name = prompt('Please enter your chat name', '');
    var socket = io.connect('http://localhost:3201');

    //== Connect to the socket server
    socket.on('connect', function () {
        if (!name) {
            name = 'Unknown User';
        }
    	socket.emit('join', name);
    });

    //== Handle the joined emission from the server
    socket.on('joined', function (user) {
    	$('.chat-peeps').append('<div data-name="' + user + '">' + user + '</div>');
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + user + ' has joined the chat</span>' +
                                '</div>');
    })

    //== Handle the message emission from the server
    socket.on('message', function (data) {
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + data.name + ' says:</span>' +
                                '<span class="chat-message-text">' + data.message + '</span>' +
                                '</div>');
    });

    //== Handle the disconnect emission from the server
    socket.on('disconnect', function (user) {
        $('.chat-peeps div[data-name="' + user + '"]').remove();
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + user + ' has left the chat</span>' +
                                '</div>');
    });

    //== Emit messages to the server
    $('#chat-form').on('submit', function (event) {
        socket.emit('message', { name: name, message: $('.chat-input').val() });
        $('.chat-input').val('');
        return false;
    });

})(jQuery);