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
    health: Number,
    power: Number,
    mana: Number,
    speed: Number,
    stamina: Number,
    element: String,
    gun: String,
    weapon: String
});

// User model associated with the schema
var Player = mongoose.model("Player", playerSchema);

// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, function() {
    console.log("Starting server on port " + port);
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

//Java script object to hold player info
var serverPlayers = {};
// Java script object to hold an array of player related objects/sprites
// Like projectiles and such
//var serverProj = {};

io.on('connection', function(socket) {
    // Client tells server to intialize a spot for it
    socket.on('newPlayer', function() {
        serverPlayers[socket.id] = 
        {
            name: 'player',
            position: {x: 200, y: 450},
            health: 50,
            power: 50,
            mana: 50,
            speed: 50,
            stamina: 50,
            element: "none",
            gun: "none",
            weapon: "none",
            oldPosition: {x: 200, y: 450},
            velocity: {x: 0, y: 0},
            render: false,
            object: 'mouse_walk/mouse_walk-2.png',
            rotation: 0
        };
        //serverProj[socket.id] = [];
    });
    
    // Client sends character.js info onto server to store 
    socket.on('startPlayer', function(player){
        serverPlayers[socket.id].element = player.element;
        //serverPlayers[socket.id].position.x = player.position.x;
        //serverPlayers[socket.id].position.y = player.position.y;
        serverPlayers[socket.id].name = player.name;
        serverPlayers[socket.id].render = true;
        
        
        if(player.element === "salty"){
            serverPlayers[socket.id].health = 500;
            serverPlayers[socket.id].power = 300;
            serverPlayers[socket.id].mana = 70;
            serverPlayers[socket.id].speed = 200;
            //this.weapon = new Fork(this.element);
            serverPlayers[socket.id].weapon = "fork";
            serverPlayers[socket.id].gun = "salt_shaker";
        }
        
       
        else if(player.element === "sour"){
            serverPlayers[socket.id].health = 300;
            serverPlayers[socket.id].power = 200;
            serverPlayers[socket.id].mana = 60;
            serverPlayers[socket.id].speed = 500;
            //this.weapon = new Fork(this.element);
            serverPlayers[socket.id].weapon = "knife";
            serverPlayers[socket.id].gun = "frosting_bag";
        }
        
        else if(player.element === "spciy"){
            serverPlayers[socket.id].health = 200;
            serverPlayers[socket.id].power = 500;
            serverPlayers[socket.id].mana = 60;
            serverPlayers[socket.id].speed = 300;
            //this.weapon = new Fork(this.element);
            serverPlayers[socket.id].weapon = "whisk";
            serverPlayers[socket.id].gun = "none";
        }
        
        // Sweet element
        else{
            serverPlayers[socket.id].health = 300;
            serverPlayers[socket.id].power = 300;
            serverPlayers[socket.id].mana = 100;
            serverPlayers[socket.id].speed = 300;
            //this.weapon = new Fork(this.element);
            serverPlayers[socket.id].weapon = "none";
            serverPlayers[socket.id].gun = "none";
        }
        
        serverPlayers[socket.id].position = player.position;
        
        //Give update to everyone
        // New player adds all old players
        // Old players add new player
        //socket.emit('updatePlayersClient', serverPlayers);
        //socket.broadcast.emit("updatePlayersClient", serverPlayers);
    });
    

    socket.on('movement', function(data) {
        
        serverPlayers[socket.id].oldPosition = serverPlayers[socket.id].position;
        serverPlayers[socket.id].position = data.position;
        serverPlayers[socket.id].velocity = data.velocity;
        serverPlayers[socket.id].rotation = data.r;
        serverPlayers[socket.id].render = true;
        
        var object = {id: socket.id, player: serverPlayers[socket.id]};
        
        socket.broadcast.emit('moveUpdates', object);
    });
    
    socket.on('addProjectileServer', function(obj){
        var added = {x: obj.x, y: obj.y, rotation: obj.rotation, render: true};
        //serverProj[socket.id].push(added);
        
        var info = {id: socket.id, obj: added};
        
        socket.broadcast.emit('addProjectileClient', info);
    });
    
    socket.on('addSaltProjectileServer', function(obj){
        var added = {x: obj.x, y: obj.y, rotation: obj.rotation, render: true};
        var info = {id: socket.id, obj: added};
        
        socket.broadcast.emit('addSaltProjectileClient', info);
    });
    
    socket.on('addBottleProjectileServer', function(obj){
        var added = {x: obj.x, y: obj.y, rotation: obj.rotation, render: true};
        var info = {id: socket.id, obj: added};
        
        socket.broadcast.emit('addBottleProjectileClient', info);
    });
    
    socket.on('addFrostingProjectileServer', function(obj){
        var added = {x: obj.x, y: obj.y, rotation: obj.rotation, render: true};
        var info = {id: socket.id, obj: added};
        
        socket.broadcast.emit('addFrostingProjectileClient', info);
    });
    
    /*
    socket.on('updateProjectileServer', function(id){
        
            //console.log("server proj update");
            if(!(id in serverProj)){
                serverProj[id] = [];
            }
            
            var len = serverProj[id].length;
            for(var i = 0; i < len; i++){
                serverProj[id][i].x += Math.cos(serverProj[id][i].rotation) * 10;
                serverProj[id][i].y += Math.sin(serverProj[id][i].rotation) * 10;  
            }
        
       
       var info = {id: id, objs: serverProj[id]};
       socket.broadcast.emit('updateProjectileClient', info);
    });
    */
    
    socket.on("doDamage", function (damage){
        serverPlayers[socket.id].health -= damage;
        
        var info = {id: socket.id, damage: damage};
        
        socket.broadcast.emit("updateDamage", info);
    })
    
    socket.on('doAnim', function(info){
        socket.broadcast.emit('updateAnim', {id: socket.id, info: info});
    });
    
    socket.on('updateDropsClient', function(info){
        socket.broadcast.emit('updateDropsServer', info);
    });
    
    socket.on('syncDropsClient', function(info){
        socket.broadcast.emit('syncDropsServer', info); 
    });
    
    socket.on('hasDied', function() {
        //console.log('user disconnected');
        // remove this player from our players object
        //delete serverPlayers[socket.id];
        // emit a message to all players to remove this player
        socket.broadcast.emit('deleteTime', socket.id);
        //console.log('removed player ' + socket.id);
    });
    
    socket.on('disconnect', function() {
        //console.log('user disconnected');
        // remove this player from our players object
        delete serverPlayers[socket.id];
        // emit a message to all players to remove this player
        socket.broadcast.emit('deleteTime', socket.id);
        //console.log('removed player ' + socket.id);
    });
});


// Send out the update state function 60 times a second
setInterval(function() {
    io.sockets.emit('updatePlayersClient', serverPlayers);
    //console.log('Server emitting to client');
}, 1000 / 60);

