//import { Scene } from "phaser.js"
class gameScene extends Phaser.Scene {
    constructor()
    {
        super({key: 'gameScene'});
        this.cursor;
        this.projectiles;
        this.platforms;
        this.player;
        this.cursors;
        this.stars;
        this.score = 0;
        this.scoreText;
        this.bombs;
        this.gameOver = false;
        this.dragging = false;
        this.mouse;
        this.hitbox;
        this.drawer = new Drawer(this);
        this.colliderHandler = new ColliderHandler(this);
        this.projectileHandler = new ProjectileHandler(this);
        this.map;
        this.floor;
        this.hidableLayer;
        this.collidableLayer;
        this.tileset;
        this.client = new Client();
        this.otherPlayers = {};
        this.DISPLAY = 150; 
        this.HITBOX = 110;
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
        this.player.printStat();
        this.socket = data.socket;
        //this.player.setWeapon(data.weapon)
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        
    }
    
    //this.client.socket.emit('newPlayer');
    
    create()
    {
        this.client.socket.emit('startPlayer');
        //this.client.socket.emit('newPlayer');
        // serves to inform other players of your existence in game
        //this.client.socket.emit('newPlayer');
        var self = this;
        
        this.client.socket.on('updatePlayers', function(server){
            for (var id in server){
                if(self.client.socket.id === id){
                    continue;
                }
                
                if(!server[id].render){
                    continue;
                }
                   
                if(!(id in self.otherPlayers)){
                    self.otherPlayers[id] = self.physics.add.sprite(100, 450, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
                    self.otherPlayers[id].displayWidth = self.DISPLAY;
                    self.otherPlayers[id].displayHeight = self.DISPLAY; 
                    self.otherPlayers[id].setSize(self.HITBOX, self.HITBOX);
                    self.otherPlayers[id].setOffset(125, 50);
                    //self.otherPlayers[id].setCollideWorldBounds(true);
                    self.otherPlayers[id].body.setAllowGravity(false);
                    
                    //self.physics.add.collider(self.otherPlayers, platforms);
                    //self.physics.add.collider(self.otherPlayers, stars);
                    self.otherPlayers[id].x = server[id].position.x;
                    self.otherPlayers[id].y = server[id].position.y;
                    self.otherPlayers[id].rotation = server[id].rotation;
                }
            }
        });
        /*
        this.client.socket.on('moveUpdates', function(object){ 
            //if(object.id in otherPlayers){
            self.otherPlayers[object.id].setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].rotation = object.player.rotation;
            // Leave animations on constantly for now
            self.otherPlayers[object.id].anims.play('left', true);
            //console.log("move updates");
            //}
        });
        */
        
        //this.platforms = this.physics.add.staticGroup();
        // drawing sky, platforms, stars, player
       // this.drawer.draw(); 
        //this.drawer.drawCharacter();
    
        // Phaser's built-in Keyboard manager
        // populates cursors object with up, down left, right properties
        // the four directions are instances of Key objects
       // cursors = this.input.keyboard.createCursorKeys();
       this.cursors = this.input.keyboard.addKeys({'up': Phaser.Input.Keyboard.KeyCodes.W, 
                                     'down': Phaser.Input.Keyboard.KeyCodes.S,                     'left': Phaser.Input.Keyboard.KeyCodes.A,     
                                    'right': Phaser.Input.Keyboard.KeyCodes.D,
                                                    
        });
        
        this.projectileHandler.initProjectiles();
     //   this.bombs = this.physics.add.group();
          
        this.input.on('pointerdown', function(p)
        {    
            
            if (p.leftButtonDown())
            {
                this.projectileHandler.createProjectile();
            }
            
            else if (p.rightButtonDown())
            {
                alert("you're meleeing, but we dont have the assets :(");
                //TODO: Melee
            }
            
        }, this);
          
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        // set up collision detection between objects
       // this.colliderHandler.initColliders();
        
        
        // trying TILEmap
        this.map = this.add.tilemap("Real_Map");
        this.tileset = this.map.addTilesetImage("real_tile", "map_sheet");
        this.floorLayer = this.map.createStaticLayer('Floor', this.tileset, 0, 0);
        this.drawer.drawCharacter();
        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        
        
        //this.drawer.drawCharacter();
        this.collidableLayer.setCollisionByProperty( {collides:true} );
        this.physics.add.collider(this.player.sprite, this.collidableLayer);
        this.physics.add.collider(this.otherPlayers, this.collidableLayer);
        
        //camera
        this.cameras.main.startFollow(this.player.sprite, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
        
        // highlight collides tiles for debugging
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.collidableLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        */
        
        
        
          
    } 
    update()
      {
        var self = this;
          
        if (this.gameOver)
        {
            return;   
        }     
        this.player.update(this);            
        this.projectileHandler.moveProjectiles();

        var myPosition = {x: this.player.sprite.x , y: this.player.sprite.y};
        var myVelocity = {x: this.player.sprite.body.velocity.x , y: this.player.sprite.body.velocity.y };
        var info = {position: myPosition, velocity: myVelocity, r: this.player.sprite.rotation};
        this.client.socket.emit('movement', info);
          
        this.client.socket.on('moveUpdates', function(object){ 
            //if(object.id in otherPlayers){
            self.otherPlayers[object.id].setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].rotation = object.player.rotation;
            // Leave animations on constantly for now
            self.otherPlayers[object.id].anims.play('left', true);
            //console.log("move updates");
            //}
        });    

    }  
           
    isCollision()
    {
        alert("collided");
    }
}