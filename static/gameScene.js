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
        this.playerGroup;
        this.otherPlayersGroup;
        this.socketFunc = new SocketFunc();

        // variables using to test (e.g. damage system, collision, etc.)
        this.dummies;
        this.dummiesGroup;
        this.sour;
        this.sweet;
        this.spicy;
        this.salt;
        
        this.randomDropsHandler = new RandomDropsHandler(this);
        this.timedEvent;
        
        this.cooldownEvent;
        this.weaponRespawnEvent;
        this.meleeCooldownEvent;
        
        this.dropsPlayerOverlap;
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
        //this.player.printStat();

        this.username = data.username;
        console.log("Username in gamescene: ", this.username);
       
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        var info = {
            name: this.username,
            element:  this.player.element,
            position: {x: this.player.startPositionX, y: this.player.startPositionY}
        };
        
        this.sound.setVolume(0.1);
        this.sound.play('game_audio', {loop: 1});
        
        this.client.socket.emit('startPlayer', info);   
    }
    
    create()
    {   
        
        this.keyboardHandler.initCursors();
        this.projectileHandler.initProjectiles();

        // TiledMap
        this.map = this.add.tilemap("new_map");	
        this.tileset = this.map.addTilesetImage("kitchen_tileset","kitchen_tileset");
        this.floorLayer = this.map.createStaticLayer('Floor', this.tileset, 0, 0);
        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        this.hidableLayer.depth = 1000;
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        this.collidableLayer.setCollisionByProperty( {collides:true} );
        this.collidableLayer.depth = 500;
        
        this.player.username = this.add.text(-20,
            -50,
            this.username,
         { fontSize: '24px', fill: 'white' });
        

    
        this.drawer.drawCharacter();
        
       // dummies for testing
        this.dummies = new Dummies(this);
        this.dummies.initAllDummies();
        this.dummies.initGroup();
        
        
        // Player melee animation callback
        this.player.sprite.on('animationcomplete', this.animationComplete, this);
        
        this.physics.add.overlap(this.dummiesGroup, this.player.myContainer, this.playerMeleeHitDummy, null, this);
        
        
        
        this.keyboardHandler.initEvents(this);

        this.colliderHandler.initPlayerColliders();
        this.physics.world.enable(this.projectiles);
        

        this.physics.add.collider(this.projectiles, this.dummiesGroup, this.bulletHitDummy, null, this);
        
        //camera
        this.cameras.main.startFollow(this.player.myContainer, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
        // Fruit Respawn
        this.timedEvent = this.time.addEvent
        ({
            delay: 3000,
            callback: this.callbackFunction,
            callbackScope: this,
            loop: true
        });
    
        // Weapon Respawn
        this.weaponRespawnEvent = this.time.addEvent
        ({
            delay: 3000,
            callback: this.weaponCallbackFunction,
            callbackScope: this,
            loop: true
        });
        
        // Handles player's gun cooldown
        this.cooldownEvent = this.time.addEvent 
        ({
            delay: this.player.cooldown,  
            callback: this.cooldownFunc,
            callbackScope: this,
            loop: true
        });
        
        // Handles player's melee cooldown
        this.meleeCooldownEvent = this.time.addEvent 
        ({
            delay: this.player.meleeCooldown,  
            callback: this.meleeCooldownFunc,
            callbackScope: this,
            loop: true
        });
        
        
        this.randomDropsHandler.init();
        
         this.physics.add.overlap(this.randomDropsHandler.group, this.player.myContainer, this.pickUpDrop, null, this);
        
        this.player.myContainer.on("overlap", function() 
                                         {
                            alert("overlapping start");
        }, this);
        this.player.myContainer.off("overlap", function() 
                                         {
                            alert("overlapping end");
        }, this);
        
     
        //Multiplayer
        
        var self = this;
        
        this.playerGroup = this.physics.add.group();
        this.playerGroup.add(this.player.myContainer);
        
        this.otherPlayersGroup = this.physics.add.group();
        
        this.physics.add.collider(this.projectiles, this.otherPlayersGroup, this.bulletHitOther, null, this);
        
        this.physics.add.overlap(this.otherPlayersGroup, this.playerGroup, this.meleeHitPlayer, null, this);
    
        
        //Update client of all other players
        this.client.socket.on('updatePlayersClient', function(server){
            self.socketFunc.updatePlayers(self, server);
        });
        
        // Update the movement of all the other players
        // To update add .sprite to the end of otherPlayers[object.id]
        this.client.socket.on('moveUpdates', function(object){
            self.socketFunc.moveUpdates(self, object);
        });
        
        this.client.socket.on('addSaltProjectileClient', function(projs){
            self.socketFunc.addSaltProjectile(self, projs);     
        });
        
        
        this.client.socket.on('addBottleProjectileClient', function(projs){
            self.socketFunc.addBottleProjectile(self, projs);     
        });
        
        
        this.client.socket.on('addFrostingProjectileClient', function(projs){
            self.socketFunc.addFrostingProjectile(self, projs);     
        });
        
        this.client.socket.on('updateDamage', function(info){
            self.otherPlayers[info.id].takeDamage(info.damage);
            self.otherPlayers[info.id].updateHealth();
        });
        
        this.client.socket.on('updateAnim', function(player){
           self.socketFunc.updateAnim(self, player);
        });
        
        // Meant for disconnect
        this.client.socket.on('deleteTime', function(myId){
            for(var id in self.otherPlayers){
                if(id === myId){
                    console.log("deletion");
                    //self.otherPlayers[id].myContainer.destroy();
                    delete self.otherPlayers[id];
                }
            } 
        });
          
    } 
    
    update()
      {
        var self = this;
       // console.log("time event loop value: ",this.timedEvent.loop);
        if (this.gameOver)
        {
            return;   
        }
        this.dummies.updateHealth();
        //console.log("gun cooldown in milliseconds:",this.cooldownEvent.delay);
        //console.log("weapon cooldown:",this.meleeCooldownEvent.delay);
          

        this.player.update(this);
        this.projectileHandler.moveProjectiles();

        if(this.player.health <= 0){
            this.scene.start("menuScene", {});
        }

    }  
    
    /*
    pickUpWeapon(player_container, weapon)
    {
        if(this.player.isEquipping)
        {
            this.player.pickUpWeapon(weapon, this);	
            this.randomDropsHandler.updateAvailablePositions(weapon.x, weapon.y);
            weapon.destroy();
            this.player.initCooldown();
            this.cooldownEvent.delay = this.player.cooldown;
            this.meleeCooldownEvent.delay = this.player.meleeCooldown;
        }
    }*/
    
    pickUpDrop(player_container, drop)
    {
       // player.isCollidingWithDrop = true;
       // console.log("inside pickUpDrop");
        if (drop instanceof Weapon) {
            if(this.player.isEquipping)
            {
                this.player.pickUpWeapon(drop, this);	
                this.randomDropsHandler.updateAvailablePositions(drop.x, drop.y);
                drop.destroy();
                this.player.initCooldown();
                this.cooldownEvent.delay = this.player.cooldown;
                this.meleeCooldownEvent.delay = this.player.meleeCooldown;
            }
        }
        
        else 
        {
            this.player.pickUpFood(drop, this);
            this.randomDropsHandler.updateAvailablePositions(drop.x, drop.y);
            drop.destroy();
        }
    }
    
    playerMeleeHitDummy(player, container)
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
    

    otherMeleeHitDummy(otherPlayerContainer, container)
    {
        var id = otherPlayerContainer.data.my_id;
        
        var player = this.otherPlayers[id];
        
        if(player == null){
            console.log("Not found");
            return;
        }
        
        if (player.isMeleeing && player.hitCount == 1)
        {
            if (container === this.salt.myContainer)
            {
                this.salt.takeDamage(this.colliderHandler.meleeHit(this.salt, player)); 
            }
            else if (container === this.sour.myContainer)
            {
                this.sour.takeDamage(this.colliderHandler.meleeHit(this.sour, player));
            }
            else if (container === this.sweet.myContainer)
            {
                this.sweet.takeDamage(this.colliderHandler.meleeHit(this.sweet, player));
            }
            else if (container === this.spicy.myContainer) 
            {
                this.spicy.takeDamage(this.colliderHandler.meleeHit(this.spicy, player));
            }
            
            this.otherPlayers[id].hitCount = 0;
          
        }
    }
    
    meleeHitPlayer(otherPlayerContainer, player)
    {
            var id = otherPlayerContainer.getData("my_id");
                
            if(this.otherPlayers[id].isMeleeing && this.otherPlayers[id].hitCount == 1) {
                var damageAmount = this.colliderHandler.meleeHit(this.otherPlayers[id], this.player);
                var killer;
                var method;
                
                if(damageAmount >= this.player.health){
                    killer = this.otherPlayers[id].username;
                    method = this.otherPlayers[id].weapon;
                }
                
                this.player.takeDamage(damageAmount, killer, method);

                this.client.socket.emit("doDamage", damageAmount);
                
                this.otherPlayers[id].hitCount = 0;
            }
        
    }
    
    bulletHitDummy(bullet, container)
    {
        //alert("colliding with laher");
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
    
    bulletHitPlayer(bullet, player){
        
        var damageAmount = this.colliderHandler.projectileHit(bullet, this.player, this.player);
        
       
        if(damageAmount >= this.player.health){
            var killer = this.otherPlayers[bullet.id].username;
            var method;
            
            if(bullet.salt){
                method = "salt";
            }
            else if(bullet.bottle){
                method = "bottle";
            }
            else if (bullet.frosting){
                method = "frosting"
            }
        }
        
        this.player.takeDamage(damageAmount, killer, method);
        
        this.client.socket.emit("doDamage", damageAmount);
        
        bullet.destroy();
    }
    
    bulletHitOther(bullet, player){
        //this.player.takeDamage(this.colliderHandler.projectileHit(bullet, this.player, this.player));
        bullet.destroy();
    }
    
    animationComplete(animation, frame)
    {
        if (animation.key === 'fork_stab' || 
           animation.key === 'knife_swipe' ||
           animation.key === 'whisk_twirl')
        {
            this.player.meleeSprite.setVisible(true);
            this.player.isMeleeing = false;
            this.player.hitCount = 0;
        }
    
        if (animation.key === 'mouse_dash')
        {
            this.player.isDashing = false;
           
        }
    }

    callbackFunction() 
    {
        if (this.randomDropsHandler.group.getLength() < 9)
        { 
            this.randomDropsHandler.respawn();
        }
    }
    
    cooldownFunc()
    {
        if (this.player.canFire == false) 
        {
            this.player.canFire = true;
        }
    }
    
    meleeCooldownFunc()
    {
        if (this.player.canMelee == false)
        {
            console.log("Melee cooldown: " + this.player.meleeCooldown);
            this.player.canMelee = true;
        }
    }
    
}