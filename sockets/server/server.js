var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.use(express.static('serve'));

app.get('/hypercube', function(req, res){
  res.sendFile(__dirname + '/hypercube.js');
});

io.on('connection', function(socket){
  console.log('Screen added');
  socket.on('disconnect', function(){
    console.log('screen removed');
    io.emit('info', 'screen removed');
  });
  socket.on('new screen', function(msg){
    console.log('screen added: ' + msg);
    io.emit('info', 'screen added: ' + msg);
  });
  socket.on('update', function(msg){
    console.log('update: ' + msg);
    io.emit('update', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
