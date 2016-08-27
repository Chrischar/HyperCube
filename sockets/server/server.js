var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clientInfo = {
    "mac": {
        "screenppmm": {
            "x": 5.04,
            "y": 5.04
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": 0,
            "y": -330,
            "z": 120
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": 0,
            "y": 0,
            "z": 120
        }, // where the screen is facing
        "rotation": 0 // how much it rotates around the
            // (screenlookingat - screenlocation) vector, not yet implemented!
    },
    "bigscreen": {
        "screenppmm": {
            "x": 4.26,
            "y": 4.26
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": -160,
            "y": 0,
            "z": 2290
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": 0,
            "y": 0,
            "z": 2290
        }, // where the screen is facing
        "rotation": 0 // how much it rotates around the
            // (screenlookingat - screenlocation) vector, not yet implemented!
    }
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/set', function(req, res) {
    res.sendFile(__dirname + '/push.html');
});

app.use(express.static('serve'));

app.get('/hypercube', function(req, res) {
    res.sendFile(__dirname + '/hypercube.js');
});

io.on('connection', function(socket) {
    console.log('Screen added');
    socket.on('disconnect', function() {
        console.log('screen removed');
        io.emit('info', 'screen removed');
    });
    socket.on('name', function(msg) {
        console.log('changed screen name: ' + msg);
        io.emit('info', 'name: ' + msg);
        socket.emit('info', 'you are now ' + msg);
        if (clientInfo[msg] != undefined) {
            socket.emit('client-update', clientInfo[msg]);
            socket.emit('info', 'data sent');
        } else {
            socket.emit('info', 'data not found');
        }
        io.emit('info', "test");
    });
    socket.on('update', function(msg) {
        console.log('update: ' + msg);
        io.emit('update', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
