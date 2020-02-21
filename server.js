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
    response.sendFile(path.join(__dirname, 'index.html')); // was index.html
});

server.listen(8080, function() {
    console.log('Starting server on port 8080');
});

var objs = {};
io.on('connection', function(socket) {
    socket.on('newPlayer', function() {
        console.log('New player arrives');
        objs[socket.id] = [];
        objs[socket.id].push(
        {
            name: 'player',
            position: {x: 100, y: 450},
            velocity: {x: 0, y: 0},
            render: true,
            object: 'mouse_walk/mouse_walk-2.png',
            rotation: 0
        });
        //console.log(objs);
    });
    
    /*
    socket.on('addProjectile', function(obj){
        if(typeof objs[obj.id] === 'undefined'){
            objs[obj.id] = [];
            console.log('what is happening here');
            //socket.emit('disconnect');
        }
        //console.log("projectile added");
        var added = {name: 'projectile' + obj.num, x: obj.x, y: obj.y, render: true, object: obj.obj};
        objs[obj.id].push(added);
    });
    
    
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
        //var player = (objs[socket.id][0] || {});
        
        function findPlayer(myObj){
            if(myObj.name === 'player'){
                return true;
            }
        }
        
        
        if(!(typeof objs[socket.id] === 'undefined')){
            var index = objs[socket.id].findIndex(findPlayer);
            //var player =  objs[socket.id][index]
            objs[socket.id][index].name = 'player';
            objs[socket.id][index].position = data.position;
            objs[socket.id][index].velocity = data.velocity;
            objs[socket.id][index].rotation = data.r;
            objs[socket.id][index].render = true;
            objs[socket.id][index].object = 'mouse_walk/mouse_walk-2.png';
            //objs[socket.id][0] = player;
        }
    });
    
    socket.on('disconnect', function() {
        //console.log('user disconnected');
        // remove this player from our players object
        delete objs[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
        //console.log('removed player ' + socket.id);
    });
});

// Send out the update state function 60 times a second
setInterval(function() {
  io.sockets.emit('state', objs);
    //console.log('Server emitting to client');
}, 1000 / 60);