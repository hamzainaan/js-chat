document.addEventListener('DOMContentLoaded', function(e) {

    //socket.io object
    var socket = io();

    //user id
    var Id = "";

    socket.on('user-id', (id) => {
        Id = id;
    });

    //event listeners
    document.getElementById('form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (Id) {
            socket.emit('message', {
                id: Id,
                message: document.getElementById('input').value
            });
            document.getElementById('input').value = '';

            //typing... removal
            document.getElementById('feedback').innerHTML = '';
        }
    });

    document.getElementById('input').addEventListener("input", () => {
        if(Id){
            socket.emit("typing", Id);
        }
    });

    //socket object listeners
    socket.on('message', function(data) {
        var item = document.createElement('li');
        //create message
        item.innerHTML = '<span class="user-id">' + data.id + '</span> ' + data.message;
        item.classList.add('message');

        //Side?
        item.classList.add((data.id == Id) ? 'message-out' : 'message-in');

        //push to the body
        document.getElementById('messages').appendChild(item);

        //typing.. removal
        document.getElementById('feedback').innerHTML = "";
        socket.emit("typing", "");
    });

    socket.on("typing", (data) => {
        document.getElementById('feedback').innerHTML = data ? (data + " yazıyor...") : ("");
    });

});
