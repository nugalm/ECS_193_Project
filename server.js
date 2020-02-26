// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var port = 8080;
//var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var socketIO = require('socket.io');
var io = socketIO(server);

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));

// Parsing the data and convert to JSON
// Need to set after port
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connecting the database to a directory
// Need to set after port and before use
    // Promise is a confirmation on whether or not
    // the data was saved into the database
    // useDefines are for deprecated mongoose
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/project", 
            {useNewUrlParser: true, useUnifiedTopology: true});

// How to expect the data to be saved
// Only tentative since this isn't static
var playerSchema = new mongoose.Schema({
    name: String,
    position: {Number, Number},
    oldPosition: {Number, Number},
    velocity: {Number, Number},
    render: Boolean,
    object: String,
    rotation: Number,
});

// User model associated with the schema
var Player = mongoose.model("Player", playerSchema);

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html')); // was index.html
});

server.listen(8080, function() {
    console.log('Starting server on port 8080');
});
/*
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
*/
app.post("/", (request,response) => {
    var data = new Player(request.body);
    data.save()
        .then(item => {
        response.send("Updated player")
    })
    .catch(err => {
        response.status(400).send("Failed to send to database");
    });
});

var serverPlayers = {};
io.on('connection', function(socket) {
    socket.on('newPlayer', function() {
        serverPlayers[socket.id] = 
        {
            name: 'player',
            position: {x: 100, y: 450},
            oldPosition: {x: 100, y: 450},
            velocity: {x: 0, y: 0},
            render: true,
            object: 'mouse_walk/mouse_walk-2.png',
            rotation: 0
        };
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
