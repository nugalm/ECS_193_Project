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
    
    
    create()
    {  
        
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
                this.player.fire();
                this.projectileHandler.createProjectile();
            }
            
            else if (p.rightButtonDown())
            {
                this.player.updateMelee();
            }
            
        }, this);
          


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

        this.salt.updateHealth();  

        this.player.update(this);
        this.projectileHandler.moveProjectiles();

    

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