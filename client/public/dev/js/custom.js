//====================================================================
//== Custom client-side JS to handle the socket events for the chat ==
//====================================================================
(function ($) {
    'use strict';

    var name          = prompt('Please enter your chat name', ''),
        socket        = io.connect('http://localhost:3201'),
        numChatters   = 0,
        chatterLoop   = 0,
        chatterList   = '',
        historyOnJoin = false,
        numMessages   = 0,
        messageLoop   = -1,
        messageList   = '';

    //== Connect to the socket server
    socket.on('connect', function () {
        if (!name) {
            name = 'Unknown User';
        }
        socket.emit('join', name);
    });

    //== Handle the joined emission from the server
    socket.on('joined', function (data) {
        //== Markup the list of chatters
        numChatters = data.chatters.length;
        for (chatterLoop = 0; chatterLoop < numChatters; chatterLoop += 1) {
            chatterList += '<div data-name="' + data.chatters[chatterLoop] + '">' + data.chatters[chatterLoop] + '</div>';
        }
        //== Display the new list of chatters
        $('.chat-peeps').html('');
        $('.chat-peeps').append(chatterList);
        chatterList = '';
        //== If this is the user that joined then display the recent messages
        if (historyOnJoin === true && name === data.name) {
            numMessages = data.messages.length;
            for (messageLoop = numMessages - 1; messageLoop > -1; messageLoop -= 1) {
                messageList += '<div class="chat-message">' +
                               '<span class="chat-message-user">' + data.messages[messageLoop].nickname + ' said:</span>' +
                               '<span class="chat-message-text">' + data.messages[messageLoop].text + '</span>' +
                               '</div>';
                //== TODO: Render an EJS template/partial from the controller rather than build the markup here
            }
            if (messageList) {
                $('.chat-convo').append(messageList);
            }
        }
        //== Show a message for the user that just joined
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + data.name + ' has joined the chat</span>' +
                                '</div>');
        //== TODO: Render an EJS template/partial from the controller rather than build the markup here
    });

    //== Handle the message emission from the server
    socket.on('message', function (data) {
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + data.name + ' says:</span>' +
                                '<span class="chat-message-text">' + data.message + '</span>' +
                                '</div>');
        //== TODO: Render an EJS template/partial from the controller rather than build the markup here
    });

    //== Handle the disconnect emission from the server
    socket.on('disconnect', function (user) {
        $('.chat-peeps div[data-name="' + user + '"]').remove();
        $('.chat-convo').append('<div class="chat-message">' +
                                '<span class="chat-message-user">' + user + ' has left the chat</span>' +
                                '</div>');
        //== TODO: Render an EJS template/partial from the controller rather than build the markup here
    });

    //== Emit messages to the server
    $('#chat-form').on('submit', function (event) {
        socket.emit('message', { name: name, message: $('.chat-input').val() });
        $('.chat-input').val('');
        return false;
    });

})(jQuery);