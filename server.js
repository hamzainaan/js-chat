//req. libraries
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

//port
const edinPort = 8699;

//objects
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// serve contents as static
app.use('/app', express.static(path.join(__dirname, 'stuff')));

app.get('/app.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/stuff/app.js');
  });

app.get('/style.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/stuff/style.css');
  });

// nonsense, i think?
app.get('/', (req, res) => {
    res.type('application/json');
    res.json({
        status: true,
        message: "edin is running."
    });
});

// id generator (randomly)
function generateId() {
    return 'user-' + Math.floor(1000000 + Math.random() * 9000000);
}

// socket object listener
io.on('connection', (socket) => {

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });

    // create and assign the id to the user
    socket.emit('user-id', generateId());

    // broadcast new messages to all of the clients
    socket.on('message', (data) => {
        io.sockets.emit('message', data);

        // typing... removal
        socket.emit('typing', "");
    });
});

// listening
server.listen(edinPort, () => {
    console.log('edin is listening on ' + edinPort);
});
