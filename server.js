// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
//var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);

app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'kitchenScene.html')); // was index.html
});

server.listen(8080, function() {
    console.log('Starting server on port 8080');
});

//Java script object to hold player info
var serverPlayers = {};
// Java script object to hold an array of player related objects/sprites
// Like projectiles and such
var miscObjs = {};

io.on('connection', function(socket) {
    socket.on('newPlayer', function() {
        serverPlayers[socket.id] = 
        {
            name: 'player',
            position: {x: 100, y: 450},
            oldPosition: {x: 100, y: 450},
            velocity: {x: 0, y: 0},
            render: false,
            object: 'mouse_walk/mouse_walk-2.png',
            rotation: 0
        };
        miscObjs[socket.id] = [];
    });
    
    socket.on('startPlayer', function(){
        serverPlayers[socket.id].render = true; 
    });
    
    
    socket.on('addProjectile', function(obj){
        var added = {name: 'projectile' + obj.num, x: obj.x, y: obj.y, render: true, object: obj.obj};
        objs[obj.id].push(added);
    });
    
    /*
   socket.on('updateProjectile', function(obj){
       function firstProjectile(arr){
           return (arr.name === 'projectile' + obj.num);
       }
        var added = {name: 'projectile' + obj.num, x: obj.x, y: obj.y, render: true, object: obj.obj};
       if(!(typeof objs[obj.id] === 'undefined')){
            var index = objs[obj.id].findIndex(firstProjectile);
            objs[obj.id][index] = added;
       }
       else{
           objs[obj.id] = []
       }
    }); 
    */

    socket.on('movement', function(data) {
        
        serverPlayers[socket.id].oldPosition = serverPlayers[socket.id].position;
        serverPlayers[socket.id].position = data.position;
        serverPlayers[socket.id].velocity = data.velocity;
        serverPlayers[socket.id].rotation = data.r;
        serverPlayers[socket.id].render = true;
        
        var object = {id: socket.id, player: serverPlayers[socket.id]};
        
        socket.broadcast.emit('moveUpdates', object);
    });
    
    socket.on('disconnect', function() {
        //console.log('user disconnected');
        // remove this player from our players object
        delete serverPlayers[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
        //console.log('removed player ' + socket.id);
    });
});

// Send out the update state function 60 times a second
setInterval(function() {
  io.sockets.emit('updatePlayers', serverPlayers);
    //console.log('Server emitting to client');
}, 1000 / 60);