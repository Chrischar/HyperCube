var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clientInfo = {
    "setup1": {
        "screenppmm": {
            "x": 5.04,
            "y": 5.04
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": 0,
            "y": 100,
            "z": 1000
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": 0,
            "y": 100,
            "z": 0
        }, // where the screen is facing
        "rotation": 0 // how much it rotates around the
            // (screenlookingat - screenlocation) vector, not yet implemented!
    },
    "setup2": {
        "screenppmm": {
            "x": 3.5,
            "y": 3.5
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": 230,
            "y": 170,
            "z": 1000
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": 230,
            "y": 170,
            "z": 0
        }, // where the screen is facing
        "rotation": 0 // how much it rotates around the
            // (screenlookingat - screenlocation) vector, not yet implemented!
    },
    "setup3": {
        "screenppmm": {
            "x": 3.75,
            "y": 3.75
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": -275,
            "y": 180,
            "z": 1000
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": -275,
            "y": 180,
            "z": 0
        }, // where the screen is facing
        "rotation": 0 // how much it rotates around the
            // (screenlookingat - screenlocation) vector, not yet implemented!
    },
    "mac": {
        "screenppmm": {
            "x": 5.04,
            "y": 5.04
        }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
        "screenlocation": {
            "x": 0,
            "y": -1000,
            "z": 120
        }, // centre of screen location in mm
        "screenlookingat": {
            "x": 0,
            "y": 0,
            "z": 120
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
    socket.on('get-layout', function(msg) {
        console.log('get-layout: ' + msg);
        io.emit('get-layout', msg);
    });
    socket.on('send-layout', function(msg) {
        console.log('send-layout: ' + msg);
        io.emit('send-layout', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
