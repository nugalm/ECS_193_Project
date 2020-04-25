class gameScene extends Phaser.Scene {
    constructor()
    {
        super({key: 'gameScene'});

        // User's info
        this.player;
        this.username;
    
        // WASD movement
        this.cursors; 

        // Not used. will need later for when we respawn player back into armory
        this.gameOver = false;


        // Class Handlers
        this.drawer = new Drawer(this);
        this.colliderHandler = new ColliderHandler(this);
        this.projectiles;
        this.projectileHandler = new ProjectileHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        
        
        // TiledMap vars
        this.map;
        this.floor;
        this.hidableLayer;
        this.collidableLayer;
        this.tileset;
        
        // multiplayer vars
        this.client = new Client(); // contains socket
        this.otherPlayers = {}; // holds the characters for all other players
        this.otherProjectiles = {}; // Holds all the other player projectiles

        // variables using to test (e.g. damage system, collision, etc.)
        this.dummies;
        this.dummiesGroup;
        this.sour;
        this.sweet;
        this.spicy;
        this.salt;
        
        //drops
        this.knife;
        this.hi;
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
       // this.player.printStat();

        this.username = data.username;
       
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        var info = {
            name: this.username,
            element:  this.player.element,
        };
        
        
        this.client.socket.emit('startPlayer', info);   
    }
    
    create()
    {   
        
        this.keyboardHandler.initCursors();
        this.projectileHandler.initProjectiles();

        // TiledMap
        this.map = this.add.tilemap("Real_Map");
        this.tileset = this.map.addTilesetImage("real_tile", "map_sheet");
        this.floorLayer = this.map.createStaticLayer('Floor', this.tileset, 0, 0);
        
        this.player.username = this.add.text(-20,
            -50,
            this.username,
         { fontSize: '24px', fill: 'white' });
        

    
        this.drawer.drawCharacter();
     //   this.dummies = this.physics.add.group({allowGravity: false});
        
       // dummies for testing
        this.dummies = new Dummies(this);
        this.dummies.initAllDummies();
        this.dummies.initGroup();
        
        
        // Player melee animation callback
        this.player.sprite.on('animationcomplete', this.animationComplete, this);
        

        
        
        this.physics.add.overlap(this.dummiesGroup, this.player.myContainer, this.meleeHit, null, this);
        
        
        this.keyboardHandler.initEvents(this);

        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        this.collidableLayer.setCollisionByProperty( {collides:true} );

        this.colliderHandler.initPlayerColliders();
        
        
        this.physics.add.collider(this.projectiles, this.dummiesGroup, this.bulletHit, null, this);

        
        //camera
        this.cameras.main.startFollow(this.player.myContainer, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
        //trying drops
        this.knife = new Knife({scene: this, x:200, y:200, key:"knife_drop_image"});
      //  this.knife.anims.play('knife_idle');
       
        
        
        this.hi = this.physics.add.overlap(this.knife, this.player.myContainer, this.pickUpWeapon, null, this);
        
        // highlight collides tiles for debugging
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.collidableLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
        
     
        //Multiplayer
        
        var self = this;
        
        /*
        var info = {
            name: this.username,
            element:  this.player.element,
            position: {x: this.player.sprite.x, y: this.player.sprite.y}
        };
        
        
        
        this.client.socket.emit('startPlayer', info);
        */
        
        //Update client of all other players
        this.client.socket.on('updatePlayersClient', function(server){
            for (var id in server){
                
                if(self.client.socket.id === id){
                    continue;
                }
                
                if(!server[id].render){
                    continue;
                }
                   
                if(!(id in self.otherPlayers)){
                    console.log("Adding new player");
                    
                    if(server[id].element === "salty"){
                        self.otherPlayers[id] = new SaltyCharacter();
                    }
                    
                    else if(server[id].element === "sour"){
                        self.otherPlayers[id] = new SourCharacter();  
                    }
                    
                    else if(server[id].element === "spicy"){
                        self.otherPlayers[id] = new SpicyCharacter();  
                    }
                    
                    else {
                        self.otherPlayers[id] = new SweetCharacter();  
                    }
                    
                    if(!(typeof self.otherPlayers[id] == 'undefined')) {
                        console.log("Displaying character");
                        //self.otherPlayers[id].startPositionY = server[id].position.y;
                        //self.otherPlayers[id].startPositionX = server[id].position.x;
                        self.otherPlayers[id].username = self.add.text(-20, -70, server[id].name, { fontSize: '24px', fill: 'white' });
                        self.otherPlayers[id].sprite = self.physics.add.sprite(0,
                            0,
                            'kitchenScene', 'mouse_walk/mouse_walk-2.png');
                        self.otherPlayers[id].initSprite(self);
                        
                        
                        self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id], self.meleeHit, null, self);
                        self.physics.add.collider(self.projectiles, self.otherPlayers[id], self.bulletHit, null, self);
                    }      

                    /*
                    self.otherPlayers[id].sprite = self.physics.add.sprite(350, 600, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
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
                    
                    self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id], self.meleeHit, null, self);
                    self.physics.add.collider(self.projectiles, self.otherPlayers[id], self.bulletHit, null, self);
                    
                    self.physics.add.collider(self.otherPlayers[id], self.collidableLayer);
                    self.physics.add.collider(self.otherPlayers[id], self.player.sprite);
                    */
                }
            }
        });
        
        // Update the movement of all the other players
        // To update add .sprite to the end of otherPlayers[object.id]
        this.client.socket.on('moveUpdates', function(object){ 
            
            if((object.player.position.x != object.player.oldPosition.x)
               || (object.player.position.y != object.player.oldPosition.y))
            {
                self.otherPlayers[object.id].sprite.anims.play('left', true);
            }
            
            /*
            self.otherPlayers[object.id].sprite.setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].sprite.setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].sprite.rotation = object.player.rotation;
            //self.otherPlayers[object.id].anims.play('left', true);
            */
            
            //console.log("x: " + object.player.velocity.x +  " y: " + object.player.velocity.y);
            
            self.otherPlayers[object.id].myContainer.body.setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].myContainer.body.setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].sprite.setRotation(object.player.rotation);
            //self.otherPlayers[object.id].anims.play('left', true);
            
        });
        
         this.client.socket.on('addProjectileClient', function(projs){
            if(!(projs.id in self.otherProjectiles)){
                self.otherProjectiles[projs.id] = [];
            }
            
            //console.log("Doing some proj adding from " + projs);
            
            self.otherProjectiles[projs.id].push({sprite: (self.physics.add.sprite(projs.obj.x, projs.obj.y, 'projectile'))
                                               ,info: projs.obj});
            
            //console.log("len at add: " + self.otherProjectiles[projs.id].length);
            if(self.otherProjectiles[projs.id].length > 0){
                //console.log("len " + self.otherProjectiles[projs.id].length);
                self.otherProjectiles[projs.id][self.otherProjectiles[projs.id].length - 1].sprite.body.setAllowGravity(false);
                //self.otherProjectiles[projs.id][self.otherProjectiles[projs.id].length - 1].setCollideWorldBounds(false);
                self.otherProjectiles[projs.id][self.otherProjectiles[projs.id].length - 1].sprite.rotation = projs.obj.rotation;
                //console.log("rotation: " + projs.obj.rotation);
                self.physics.add.collider(self.otherProjectiles[projs.id][self.otherProjectiles[projs.id].length - 1].sprite, self.player.sprite);
            }
            
        });
        
         // update projectiles from other players
        this.client.socket.on('updateProjectileClient', function(server){
            var projs = server.objs;
            var id = server.id;
            if(!(id in self.otherProjectiles)){
                self.otherProjectiles[id] = [];
            }
            
            var i = 0;
            //console.log(self.otherProjectiles[id].length);
            for(i = 0; i < self.otherProjectiles[id].length; i++){
                //console.log("updating proj");
                self.otherProjectiles[id][i].sprite.x = projs[i].x;
                self.otherProjectiles[id][i].sprite.y = projs[i].y;
                self.otherProjectiles[id][i].sprite.rotation = projs[i].rotation;
            }
        });
          
    } 
    
    update()
      {
        var self = this;
          
        if (this.gameOver)
        {
            return;   
        }
 
        this.dummies.updateHealth();

        this.player.update(this);
        this.projectileHandler.moveProjectiles();

    

    }  
    
    pickUpWeapon(weapon, player_container)
    {
        if (weapon instanceof Knife)
        {
            this.player.weapon = "knife";
            weapon.destroy();
        }
    }
    
    meleeHit(player, container)
    {
        
        if (this.player.isMeleeing && this.player.hitCount == 1)
        {
            if (container === this.salt.myContainer)
            {
                this.salt.takeDamage(this.colliderHandler.meleeHit(this.salt, this.player)); 
            }
            else if (container === this.sour.myContainer)
            {
                this.sour.takeDamage(this.colliderHandler.meleeHit(this.sour, this.player));
            }
            else if (container === this.sweet.myContainer)
            {
                this.sweet.takeDamage(this.colliderHandler.meleeHit(this.sweet, this.player));
            }
            else if (container === this.spicy.myContainer) 
            {
                this.spicy.takeDamage(this.colliderHandler.meleeHit(this.spicy, this.player));
            }
            
            this.player.hitCount = 0;
          
        }
    }
    
    bulletHit(bullet, container)
    {
        if (container === this.salt.myContainer)
        {
            this.salt.takeDamage(this.colliderHandler.projectileHit(bullet, this.salt, this.player));
         
        }
        else if (container === this.sour.myContainer)
        {
            this.sour.takeDamage(this.colliderHandler.projectileHit(bullet, this.sour, this.player));
        }
        else if (container === this.sweet.myContainer)
        {
            this.sweet.takeDamage(this.colliderHandler.projectileHit(bullet, this.sweet, this.player));
        }
        else if (container === this.spicy.myContainer) 
        {
            this.spicy.takeDamage(this.colliderHandler.projectileHit(bullet, this.spicy, this.player));
        }
        
        bullet.destroy();
   
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