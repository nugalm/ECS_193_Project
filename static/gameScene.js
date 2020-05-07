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
        
        this.dropsGroup;
        
        this.fork;
        this.salt_shaker;
        this.squirter;
        this.whisk;
        this.frosting_bag;
        
        this.randomDropsHandler = new RandomDropsHandler(this);
        this.timedEvent;
        
        this.cooldownEvent;
        this.weaponRespawnEvent;
        this.meleeCooldownEvent;
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
        this.player.printStat();

        this.username = data.username;
       
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
        
       // dummies for testing
        this.dummies = new Dummies(this);
        this.dummies.initAllDummies();
        this.dummies.initGroup();
        
        
        // Player melee animation callback
        this.player.sprite.on('animationcomplete', this.animationComplete, this);
        

        
        
        this.physics.add.overlap(this.dummiesGroup, this.player.myContainer, this.playerMeleeHitDummy, null, this);
        
        
        
        this.keyboardHandler.initEvents(this);

        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        
        this.hidableLayer.depth = 1000;
        
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        this.collidableLayer.setCollisionByProperty( {collides:true} );

        this.colliderHandler.initPlayerColliders();
        //this.physics.world.enable(this.projectiles);
        

        this.physics.add.collider(this.projectiles, this.dummiesGroup, this.bulletHitDummy, null, this);

       // this.physics.add.collider(this.projectiles, this.dummiesGroup, this.bulletHit, null, this);
        

        
        //camera
        this.cameras.main.startFollow(this.player.myContainer, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;
        
        //trying drops
       // this.knife = new Knife({scene: this, x:200, y:1000, key:"knife_drop_image"});
       // this.fork = new Weapon({scene: this, x:400, y:1000, key:"fork_drop_image"});
       // this.whisk = new Weapon({scene: this, x:600, y:1000, key:"whisk_drop_image"});

     
        
       // this.dropsGroup = this.physics.add.group();
        
        
      //  this.dropsGroup.add(this.knife);
     //   this.dropsGroup.add(this.fork);
       // this.dropsGroup.add(this.whisk);
        
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
        
        
        
        
        
      //  this.hi = this.physics.add.overlap(this.dropsGroup, this.player.myContainer, this.pickUpWeapon, null, this);
        
        this.randomDropsHandler.init();
        
        this.physics.add.overlap(this.randomDropsHandler.weapon_group,
                                this.player.myContainer, this.pickUpWeapon, null, this)
        
        this.physics.add.overlap(this.randomDropsHandler.group, this.player.myContainer, this.pickUpFood, null, this);
        
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
        
        this.playerGroup = this.physics.add.group();
        this.playerGroup.add(this.player.myContainer);
        
        this.otherPlayersGroup = this.physics.add.group();
        
        this.physics.add.collider(this.projectiles, this.otherPlayersGroup, this.bulletHitOther, null, this);
        
        //this.physics.add.overlap(this.dummiesGroup, this.otherPlayersGroup, this.otherMeleeHitDummy, null, this);
        
        this.physics.add.overlap(this.otherPlayersGroup, this.playerGroup, this.meleeHitPlayer, null, this);
        
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
                        //Add in other player characte
                        console.log("x: " + server[id].position.x + " y: " + server[id].position.y);
                        self.otherPlayers[id].startPositionY = server[id].position.y;
                        self.otherPlayers[id].startPositionX = server[id].position.x;
                        
                        self.otherPlayers[id].username = self.add.text(-20, -70, (server[id].name), { fontSize: '24px', fill: 'white' });
                        self.otherPlayers[id].sprite = self.physics.add.sprite(0,
                            0,
                            'kitchenScene', 'mouse_walk/mouse_walk-2.png');
                        
                        self.otherPlayers[id].initSprite(self);
                        
                        
                                            
                        self.otherPlayersGroup.add(self.otherPlayers[id].myContainer);
                        
                        self.physics.add.collider(self.otherPlayers[id].myContainer, self.collidableLayer);
                        
                        self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id].myContainer, self.otherMeleeHitDummy, null, self);
                        
                        //self.physics.add.overlap(self.dummiesGroup, self.otherPlayers[id].sprite, self.meleeHit, null, self);
                        
                        //self.physics.add.collider(self.projectiles, self.otherPlayersGroup, self.bulletHitOther, null, self);
                    }      
                }
            }
        });
        
        // Update the movement of all the other players
        // To update add .sprite to the end of otherPlayers[object.id]
        this.client.socket.on('moveUpdates', function(object){ 
            
            self.otherPlayers[object.id].myContainer.body.setVelocityX(object.player.velocity.x);
            self.otherPlayers[object.id].myContainer.body.setVelocityY(object.player.velocity.y);
            self.otherPlayers[object.id].sprite.setRotation(object.player.rotation);
            
            var id = object.id;
            var pos = object.player.position;
            
            function truncate(value)
            {
                if (value < 0) {
                   return Math.ceil(value);
                }

                return Math.floor(value);
            }
            
            if(object.player.oldPosition.x === pos.x && object.player.oldPosition.y === pos.y){
                return;
            }
            
            // If player still moving don't correct using abosolute position
            if(self.otherPlayers[id].myContainer.body.velocity.x !== 0 && self.otherPlayers[id].myContainer.body.velocity.y !== 0){
                return;
            }
            
            // pos is absolute position of the other players
            if(truncate(self.otherPlayers[id].myContainer.x) !== truncate(pos.x)){                
                if(truncate(self.otherPlayers[id].myContainer.x) === truncate(pos.x)){
                    self.otherPlayers[id].myContainer.body.setVelocityX(0);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.x) > truncate(pos.x)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityX(-160);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.x) < truncate(pos.x)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityX(160);
                }
                        
            }
            
            if(truncate(self.otherPlayers[id].myContainer.y) !== truncate(pos.y)){
                if(truncate(self.otherPlayers[id].myContainer.y) ===  truncate(pos.y)){
                    self.otherPlayers[id].myContainer.body.setVelocityY(0);
                }
                
                else if(truncate(self.otherPlayers[id].myContainer.y) >  truncate(pos.y)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityY(-160);
                }
                
                 else if(truncate(self.otherPlayers[id].myContainer.y) <  truncate(pos.y)) { 
                    self.otherPlayers[id].myContainer.body.setVelocityY(160);
                }      
            }
            
            
            //self.physics.arcade.moveToXY(self.otherPlayers[id].myContainer.body,pos.x, pos.y, 160 , );
            
           
            
            
        });
        
         this.client.socket.on('addProjectileClient', function(projs){
            if(!(projs.id in self.otherProjectiles)){
                self.otherProjectiles[projs.id] = self.physics.add.group();
                
                self.physics.add.collider(self.otherProjectiles[projs.id], self.dummiesGroup, self.bulletHitDummy, null, self);
                self.physics.add.collider(self.otherProjectiles[projs.id], self.playerGroup, self.bulletHitPlayer, null, self);
            }
            
            var projectile = self.otherProjectiles[projs.id].create(projs.obj.x, projs.obj.y, 'projectile');
            projectile.setCollideWorldBounds(false);
            projectile.body.setAllowGravity(false); 
            projectile.rotation =  projs.obj.rotation;//this.context.player.sprite.rotation - (Math.PI / 2);
            projectile.element = self.otherPlayers[projs.id].element;
             
             
        });
        
        this.client.socket.on('updateDamage', function(info){
            
            
            self.otherPlayers[info.id].takeDamage(info.damage);
            self.otherPlayers[info.id].updateHealth();
        });
        
        this.client.socket.on('updateAnim', function(player){
            self.otherPlayers[player.id].isMeleeing = player.info.melee;
            self.otherPlayers[player.id].hitCount = player.info.hitCount;
            
            if(player.info.anims === 'left'){
                self.otherPlayers[player.id].sprite.anims.play(player.info.anims, true);
            }
            else {
                self.otherPlayers[player.id].sprite.anims.play(player.info.anims);
            }
           
        });
        
        this.client.socket.on('deleteTime', function(myId){
            for(var id in self.otherPlayers){
                if(id === myId){
                    console.log("deletion");
                    self.otherPlayers[id].myContainer.destroy();
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

    

    }  
    
    pickUpWeapon(player_container, weapon)
    {
      
        if (weapon instanceof Knife)
        {
            this.player.weapon = "knife";
            weapon.disableBody(true, true);
        }
        else if (weapon == this.randomDropsHandler.fork){
            this.player.weapon = "fork";
            weapon.disableBody(true, true);
        }
        else if (weapon == this.randomDropsHandler.whisk) {
            this.player.weapon = "whisk";
            weapon.disableBody(true, true);
        }
        else if (weapon == this.randomDropsHandler.salt_shaker){
            this.player.gun = "salt_shaker";
            weapon.disableBody(true, true);
        }
        else if (weapon == this.randomDropsHandler.bottle){    
            this.player.gun = "bottle";
            weapon.disableBody(true, true);
        }
        else if (weapon == this.randomDropsHandler.frosting_bag){
            this.player.gun = "frosting_bag";
            weapon.disableBody(true, true);
        }
        this.player.initCooldown();
        this.cooldownEvent.delay = this.player.cooldown;
        this.meleeCooldownEvent.delay = this.player.meleeCooldown;
    }
    
    pickUpFood(player_container, food)
    {
        if (food == this.randomDropsHandler.avocado) 
        {
            this.player.health = this.player.health + 100;
            food.disableBody(true, true);
        } 
        else if (food == this.randomDropsHandler.pepper)
        {
            this.player.power = this.player.power + 50;
            food.disableBody(true, true);
        }
        else if (food == this.randomDropsHandler.blueberry)
        {
            this.player.speed = this.player.speed + 50;
            food.disableBody(true, true);
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
        for(var id in this.otherPlayers){
            if(this.otherPlayers[id].myContainer === otherPlayerContainer){
                var player = this.otherPlayers[id];
            }
        }
        
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
        for(var id in this.otherPlayers){
            if(!(this.otherPlayers[id].myContainer === otherPlayerContainer)){
                continue;
            }
            
            console.log("found container");
                
            if(this.otherPlayers[id].isMeleeing && this.otherPlayers[id].hitCount == 1) {
                var damageAmount = this.colliderHandler.meleeHit(this.otherPlayers[id], this.player);
        
                this.player.takeDamage(damageAmount);

                this.client.socket.emit("doDamage", damageAmount);
                
                this.otherPlayers[id].hitCount = 0;
            }
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
        
        this.player.takeDamage(damageAmount);
        
        this.client.socket.emit("doDamage", damageAmount);
        
        bullet.destroy();
    }
    
    bulletHitOther(bullet, player){
        //this.player.takeDamage(this.colliderHandler.projectileHit(bullet, this.player, this.player));
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

    callbackFunction() 
    {
        var context = this;
        this.randomDropsHandler.group.children.iterate(function (child) 
        {
            if (!child.active)
            {  
                context.randomDropsHandler.respawn(child);
            }
        })
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
    
    weaponCallbackFunction()
    {
        var context = this;
        this.randomDropsHandler.weapon_group.children.iterate(function(child)
        {
            if (!child.active) 
            {
                context.randomDropsHandler.respawnWeapon(child);
            }
        })
    }
    
}