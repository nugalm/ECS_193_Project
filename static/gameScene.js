//import { Scene } from "phaser.js"
class gameScene extends Phaser.Scene {
    constructor()
    {
        super({key: 'gameScene'});
        this.cursor;
        this.projectiles;
        this.player;
        this.username;
        this.displayName;
        this.cursors; 
        this.score = 0;
        this.scoreText;
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

        this.meleeHitboxes;
        var dummy;
        this.fork = new Fork('salty');
        this.forkTime;
        this.healthDisplay;
        this.dummies;
        this.sour;
        this.sweet;
        this.spicy;
        this.salt;

    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
       // this.player.printStat();
        if (this.player.weapon != null){
         //   this.player.weapon.printWeaponStats();
        }
        this.username = data.username;
        this.socket = data.socket;
       
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        
        
    }
    
    //this.client.socket.emit('newPlayer');
    
    create()
    {  
       // this.client.socket.emit('startPlayer');
       
       /* var self = this;
        
        this.client.socket.on('moveUpdates', function(object){ 
            
            self.otherPlayers[object.id].setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].rotation = object.player.rotation;
            
            if((object.player.position.x != object.player.oldPosition.x) || 
               (object.player.position.y != object.player.oldPosition.y))
            {
                self.otherPlayers[object.id].anims.play('left', true);
            }
            
        });*/
        
        
       this.cursors = this.input.keyboard.addKeys
       ({
            'up': Phaser.Input.Keyboard.KeyCodes.W, 
            'down': Phaser.Input.Keyboard.KeyCodes.S,                     
            'left': Phaser.Input.Keyboard.KeyCodes.A,     
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'space': Phaser.Input.Keyboard.KeyCodes.space,
                                        
                                                    
        });
        
        
        this.projectileHandler.initProjectiles();

        // trying TILEmap
        this.map = this.add.tilemap("Real_Map");
        this.tileset = this.map.addTilesetImage("real_tile", "map_sheet");
        this.floorLayer = this.map.createStaticLayer('Floor', this.tileset, 0, 0);
        
        this.player.username = this.add.text(-20,
            -50,
            this.username,
         { fontSize: '24px', fill: 'white' });
        

    
        this.drawer.drawCharacter();
        

        
        this.dummies = this.physics.add.group({allowGravity: false});
        
        this.salt = new SaltyCharacter();
        this.salt.username = this.add.text(-20, -70, "enemy", { fontSize: '24px', fill: 'white' });
        this.salt.sprite = this.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
        
        
        
        this.salt.initSprite(this);
        
      //  this.dummies.add(this.salt.sprite);
        
        // Player melee animation callback
        this.player.sprite.on('animationcomplete', this.animationComplete, this);
        

        this.physics.add.overlap(this.salt.myContainer, this.player.myContainer, this.meleeHit, null, this);
        
        this.input.on('pointerdown', function(p)
        {    
            
            if (p.leftButtonDown())
            {
                this.projectileHandler.createProjectile();
            }
            
            else if (p.rightButtonDown())
            {
                this.player.updateMelee();
            }
            
        }, this);
          
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.input.keyboard.on('keydown-SPACE', function(p) 
        {
            this.player.dashTargetRotation = this.player.sprite.rotation;
            this.player.dash();
        }, this);

        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        this.collidableLayer.setCollisionByProperty( {collides:true} );

        this.physics.add.collider(this.player.myContainer, this.collidableLayer);
        
        this.physics.add.collider(this.projectiles, this.salt.myContainer, this.bulletHit, null, this);

        
        //camera
        this.cameras.main.startFollow(this.player.myContainer, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
        // highlight collides tiles for debugging
        
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.collidableLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        
        
      
       /* this.client.socket.on('updatePlayers', function(server){
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
                    self.physics.add.collider(self.otherPlayers[id], self.collidableLayer);
                    self.physics.add.collider(self.otherPlayers[id], self.player.sprite);
                }
            }
        });  */
        
          
    } 
    update()
      {
        var self = this;
          
        if (this.gameOver)
        {
            return;   
        }

        this.salt.updateHealth();  
          
          
       // this.displayName = this.add.text(this.player.sprite.x,
       //     this.player.sprite.y - 50,
        //    this.username,
       //  { fontSize: '24px', fill: 'white' });

        this.player.update(this);
        this.projectileHandler.moveProjectiles();

        //this.healthDisplay.x = this.salt.sprite.x - 25;
       // this.healthDisplay.y = this.salt.sprite.y - 60;
       // if (this.dummy.health != 0) {
     //   this.healthDisplay.setText("Health: " + this.salt.health);
       // }
     //   if (this.salt.health == 0) 
      //  {
      //      this.healthDisplay.visible = false;   
       // }

      /*var myPosition = {x: this.player.sprite.x , y: this.player.sprite.y};
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
        }); */   

    }  
           
    isCollision()
    {
        alert("collided");
    }

    
    meleeHit()
    {
        
        if (this.player.isMeleeing && this.player.hitCount == 1)
        {
            this.salt.takeDamage(10);
            this.player.hitCount = 0;
          //  alert("health after melee hit: " + this.dummy.health);
        }
    }
    
    bulletHit(salt, bullet)
    {
        this.salt.takeDamage(10);
        bullet.disableBody(true, true);
        //alert("health after prjecitle hit: " + this.dummy.health);
        
    }
    
    animationComplete(animation, frame)
    {
        if (animation.key === 'fork_stab' )
        {
            this.player.isMeleeing = false;
        }
    
        if (animation.key === 'mouse_dash')
        {
            this.player.isDashing = false;
        }
    }

}