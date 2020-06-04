class gameScene extends Phaser.Scene {
    constructor()
    {
        super({key: 'gameScene'});
        
        // User's info
        this.player;
        this.username;
        this.score;
        this.scoreText;
        
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
        this.otherProjColliders = {};

        // variables using to test (e.g. damage system, collision, etc.)
       // this.dummies;
       // this.dummiesGroup;
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
        
        this.respawn_button = null;
        this.restart_button = null;
        this.killed_message;
        this.lastX;
        this.lastY;
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
        //this.player.printStat();

        this.username = data.username;
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        this.load.image('respawn_button', 'static/images/gameScene/btn_respawn.png');
        this.load.image('restart_button', 'static/images/gameScene/btn_restart.png');
        
        this.sound.setVolume(0.1);
        this.sound.play('game_audio', {loop: 1});
        
        var info = {
            name: this.username,
            element:  this.player.element,
            position: {x: this.player.startPositionX, y: this.player.startPositionY}
        };
        
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
        
        
        // Player melee animation callback
        this.player.sprite.on('animationcomplete', this.animationComplete, this);
        
        this.keyboardHandler.initEvents(this);

        this.colliderHandler.initPlayerColliders();
        this.physics.world.enable(this.projectiles);
        
        //camera
        this.cameras.main.startFollow(this.player.myContainer, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
    
        // Item Respawn
        this.timedEvent = this.time.addEvent
        ({
            delay: 5000,
            callback: this.callbackFunction,
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
        
        this.scene.launch('UIScene', {name: this.username});
     
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
            if(self.otherPlayers[info.id] == null){
                return;
            }
            
            self.otherPlayers[info.id].takeDamage(info.damage);
            self.otherPlayers[info.id].updateHealth();
        });
        
        this.client.socket.on('updateAnim', function(player){
           self.socketFunc.updateAnim(self, player);
        });
        
        this.client.socket.on("updateDropsServer", function(info){
            self.socketFunc.updateDrops(self, info);
        });
        
        this.client.socket.on('syncDropsServer', function(info){
            self.socketFunc.syncDrops(self, info);  
        });
        
        this.client.socket.on("updateMeleeSpriteAnim", function(info){
            if(self.otherPlayers[info.id] == null){
                return;
            }
            
            if(self.otherPlayers[info.id].meleeSprite.anims == null){
                return;
            }
            
            self.otherPlayers[info.id].meleeSprite.anims.play(info.anim);
        });
        
        this.client.socket.on("seeMeleeSpriteClient", function(info){
         
             if(self.otherPlayers[info.id] == null){
                return;
            } 
            self.otherPlayers[info.id].meleeSprite.setVisible(info.visible);
        });
        
        this.client.socket.on('statChangeClient', function(info){
            self.socketFunc.statUpdate(self, info);
        });
        
        this.client.socket.on("updateDeathScoreClient", function(player_id){
            self.socketFunc.updateKillScore(self, player_id);
        });
        
        this.client.socket.on('implementDeath', function(player_id){
            self.socketFunc.haveDied(self, player_id);
        });
        
        this.client.socket.on('respawnClient', function(info){
            self.socketFunc.haveRespawn(self, info); 
        });
        
        // Meant for disconnect
        this.client.socket.on('deleteTime', function(myId){
            if(!(self.otherPlayers[myId] == null)){
                self.otherPlayers[myId].myContainer.destroy();
                delete self.otherPlayers[myId];
            }
        });
        
    } 
    
    update()
      {
        var self = this;      
        this.player.update(this);
        this.projectileHandler.moveProjectiles();  
          
        if(this.player.health <= 0){
            this.lastX = this.player.myContainer.x
            this.lastY = this.player.myContainer.y
            this.player.myContainer.body.enable = false;
        }
    }  
    
    pickUpDrop(player_container, drop)
    {
        
        var info = {x: drop.x, y: drop.y};
        if (drop instanceof Weapon) {
            if(this.player.isEquipping)
            {
                this.sound.play('knife_pickup_audio');
                this.player.pickUpWeapon(drop, this);	
                this.randomDropsHandler.updateAvailablePositions(drop.x, drop.y);
                drop.destroy();
                this.player.initCooldown();
                this.cooldownEvent.delay = this.player.cooldown;
                this.meleeCooldownEvent.delay = this.player.meleeCooldown;
                this.client.socket.emit("updateDropsClient", info);
                this.events.emit("addScore");
               
            }
        }
        
        else 
        {
            this.sound.play('food_pickup_audio');
            this.player.pickUpFood(drop, this);
            this.randomDropsHandler.updateAvailablePositions(drop.x, drop.y);
            drop.destroy();
            this.client.socket.emit("updateDropsClient", info);
            this.events.emit("addScore");
            
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
                    
                    this.client.socket.emit("updateDeathScoreServer", id);
                }
                
                this.player.takeDamage(damageAmount, killer, method);

                this.client.socket.emit("doDamage", damageAmount);
                
                this.otherPlayers[id].hitCount = 0;
            }
        
    }
    
    bulletHitDummy(bullet, container)
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
            
            if(!this.gameOver) {
                this.client.socket.emit("updateDeathScoreServer", bullet.id);
            }
            
            this.gameOver = true;
        }
        
        this.player.takeDamage(damageAmount, killer, method);
        
        this.client.socket.emit("doDamage", damageAmount);
        
        bullet.destroy();
    }
    
    bulletHitOther(bullet, player){
        bullet.destroy();
    }
    
    animationComplete(animation, frame)
    {
        if (animation.key === 'fork_stab' || 
           animation.key === 'knife_swipe' ||
           animation.key === 'whisk_twirl')
        {
            this.player.meleeSprite.setVisible(true);
            this.client.socket.emit("seeMeleeSpriteServer", true);  
            this.player.isMeleeing = false;
            this.player.hitCount = 0;
        }
    
        if (animation.key === 'mouse_dash')
        {
            
            this.player.isDashing = false;
           
        }
        
        if (animation.key === 'mouse_death')
        {
            this.addAfterDeathButtons();
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
            this.player.canMelee = true;
        }
    }
    
    reconnectToMultiplayer(){
        if(!(this.client.socket.connected)){
            this.client.socket.connect();
        }
    }
    
    addAfterDeathButtons(){
        if(!(this.respawn_button == null)){
            return;
        }
        
        if(!(this.restart_button == null)){
            return;
        }
        
        this.setupDeathButtons();
    }
    
    setupDeathButtons(){
        
        this.client.socket.emit("died");
        
        this.respawn_button = this.add.sprite(this.lastX , this.lastY + 50, 'respawn_button');
        this.restart_button = this.add.sprite(this.lastX, this.lastY - 50, 'restart_button');
        this.killed_message = this.add.text(this.lastX - 75, this.lastY - 125, this.player.killed_text, {font: "16px Arial", fill: "#ffffff"});
        
        this.respawn_button.depth = 2000;
        this.restart_button.depth = 2000;
        this.killed_message.depth = 2000;
        this.respawn_button.setInteractive();
        this.restart_button.setInteractive();
        
        // Does respawn button stuff
        
        this.respawn_button.on('pointerup', function(p)
        {       
            this.events.emit("reset");
            
            this.player.health = this.player.maxHealth;
            this.player.myContainer.setVisible(true);
            this.player.myContainer.body.enable = true;
            this.player.updateHealth();
            
            this.restart_button.destroy();
            this.respawn_button.destroy();
            this.killed_message.destroy();
            this.restart_button = null;
            this.respawn_button = null;
            this.killed_message = null;
            
            this.gameOver = false;
            
            var info = {id: this.client.socket.id, health: this.player.maxHealth};
            this.client.socket.emit('respawnServer', info);
        }, this);
        
        this.respawn_button.on('pointerover', function (p) 
        {
            this.respawn_button.setTint(0x808080);
        }, this);
        
        this.respawn_button.on('pointerout', function (p)
        {
            this.respawn_button.setTint(0xffffff);
        }, this)
        
        // Does restart button stuff
        this.restart_button.on('pointerup', function(p)
        {
            window.location.reload();
        }, this);
        
        this.restart_button.on('pointerover', function (p) 
        {
            this.restart_button.setTint(0x808080);
        }, this);
        
        this.restart_button.on('pointerout', function (p)
        {
            this.restart_button.setTint(0xffffff);
        }, this)   
    }
    
    clearScene(){
        for(var id in this.otherPlayers){
            this.otherPlayers[id].myContainer.destroy();
            delete this.otherPlayers[id];
        }
        
        for(var id in this.otherProjectiles){
            this.otherProjectiles[id].destroy();
            delete this.otherProjectiles[id];
        }
        
        this.otherPlayersGroup.children.iterate(function(child){
            if(child == null){
                return;
            }
            child.destroy();
        });
        
        this.playerGroup.destroy();
    }
    
}