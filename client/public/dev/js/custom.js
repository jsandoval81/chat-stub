
(function ($) {
    'use strict';

    var name = prompt('Please enter your chat name', '');
    var socket = io.connect('http://localhost:3201');

    socket.on('connect', function () {
        if (!name) {
            name = 'Unknown User';
        }
    	socket.emit('join', name)
    });

    socket.on('joined', function (user) {
    	$('.chat-peeps').append('<div>' + user.name + '</div>')
    })

    socket.on('message', function (data) {
        socket.emit('message', {message: data})
    });   

})(jQuery);