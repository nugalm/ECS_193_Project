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
                
    }
    
    // If we ever need to load specific data from previous scene.
    init(data)
    {
        // From user selection in menu scene
        this.player = data.player;
        this.player.printStat();
    }
    
    // No need to preload here. We frontload all images/sprites/in loadScene 
    // and can refer to the keywords we initialized there as we like
    preload() 
    {

    }
    
    create()
    {   
        this.platforms = this.physics.add.staticGroup();
        // drawing sky, platforms, stars, player
        this.drawer.draw();     
    
        // Phaser's built-in Keyboard manager
        // populates cursors object with up, down left, right properties
        // the four directions are instances of Key objects
       // cursors = this.input.keyboard.createCursorKeys();
       this.cursors = this.input.keyboard.addKeys({'up': Phaser.Input.Keyboard.KeyCodes.W, 
                                     'down': Phaser.Input.Keyboard.KeyCodes.S,                     'left': Phaser.Input.Keyboard.KeyCodes.A,     
                                    'right': Phaser.Input.Keyboard.KeyCodes.D,
                                                    
        });
        
        this.projectileHandler.initProjectiles();
        this.bombs = this.physics.add.group();
          
        this.input.on('pointerdown', function(p)
        {       
            this.projectileHandler.createProjectile();       
        }, this);
          
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        // set up collision detection between objects
        this.colliderHandler.initColliders();
        
        this.cameras.main.startFollow(this.player.sprite, true, 0.05, 0.05);
        this.cameras.main.zoom = 1.5;

          
    } 
    update()
      {
          
        if (this.gameOver)
        {
            return;   
        }     
        this.player.update(this);            
        this.projectileHandler.moveProjectiles();


    }  
            
}