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
        this.client = new Client();
        this.otherPlayers = {};

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
        this.socket = data.socket;
       
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {
        
        
    }
    
    create()
    {  
        
        
        this.keyboardHandler.initCursors();
        this.projectileHandler.initProjectiles();

        // TiledMap
       // this.map = this.add.tilemap("Real_Map");
        //this.tileset = this.map.addTilesetImage("real_tile", "map_sheet");
        //this.floorLayer = this.map.createStaticLayer('Floor', this.tileset, 0, 0);
        
        this.map = this.add.tilemap("new_map");
        this.tileset = this.map.addTilesetImage("kitchen_tileset","kitchen_tileset")
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
        
        this.physics.add.overlap(this.dummiesGroup, this.player.myContainer, this.meleeHit, null, this);
        
        
        this.keyboardHandler.initEvents(this);

        this.hidableLayer = this.map.createStaticLayer('Hidable', this.tileset, 0, 0);
        this.collidableLayer = this.map.createStaticLayer('Collidable', this.tileset, 0, 0);
        this.collidableLayer.setCollisionByProperty( {collides:true} );

        this.colliderHandler.initPlayerColliders();
        this.physics.world.enable(this.projectiles);
        
        this.physics.add.collider(this.projectiles, this.dummiesGroup, this.bulletHit, null, this);
        
        //this.physics.add.collider(this.collidableLayer, this.projectiles, this.destroyBullet, null, this);
        this.physics.add.collider(this.projectiles, this.collidableLayer);
        
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
    
    pickUpWeapon(player_container, weapon)
    {
     
        this.player.pickUpWeapon(weapon, this);
        weapon.disableBody(true, true);
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
            this.player.power = this.player.power + 100;
            alert("power after pickup: "+this.player.power)
            this.player.pepper_time(this);
            //console.log(this.player.power);
            food.disableBody(true, true);
        }
        else if (food == this.randomDropsHandler.blueberry)
        {
            this.player.speed = this.player.speed + 50;
            food.disableBody(true, true);
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
    
    destroyBullet(bullet, container) 
    {
        var count;
        this.projectiles.children.iterate(function(child){
            count = count + 1;
        })
        console.log("num projectiles: ", count);
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