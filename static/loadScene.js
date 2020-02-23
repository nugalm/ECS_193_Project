class loadScene extends Phaser.Scene 
{
    constructor()
    {
        super( {key: 'loadScene'} );
        this.loadText;
    }
    
    // Frontload all sprites/images in loading screen
    preload()
    {

        // TODO: make this nice looking graphics
        this.loadText = this.add.text(100, 100, 'The Mice are getting ready...', { fontSize: '24px', fill: 'white' });
        this.load.image('sky', 'static/assets/sky.png')
        this.load.image('ground', 'static/assets/platform.png');
        this.load.image('star', 'static/assets/star.png');
        this.load.image('bomb', 'static/assets/bomb.png');
        this.load.image('projectile', 'static/images/whiteball.png');
        this.load.image('hitbox', 'static/assets/hitbox_square.png');
        this.load.spritesheet('mouse', 'static/images/mouse_walk.png',
                              {frameWidth: 34, frameHeight: 48 } );
        this.load.spritesheet('dude', 'static/assets/dude.png',
                              {frameWidth: 32, frameHeight: 48 }  );
         
        this.load.multiatlas('kitchenScene', 'static/images/atlas.json', 'static/images');
        
        

        
    }
    
    // Creating animations to be used in gameScene
    // prompt user to click to enter gameScene
    create()
    {
        this.loadText.setVisible(false);
        this.add.text(100, 150, 'Click to enter the Marfare!', { fontSize: '32px', fill: 'white' });        
        
            var frameNames = this.anims.generateFrameNames('kitchenScene', {
                start: 0, end: 19, zeroPad: 0, 
                prefix: 'mouse_walk/mouse_walk-', suffix:'.png'
            });

            this.anims.create({
                key: 'left',
                frames: frameNames,
                frameRate: 25,
                repeat: -1
            });
                  
          this.anims.create({
                key: 'turn',
                frames: frameNames,
                frameRate: 0,
                //repeat: -1
            });
          
          this.anims.create({
                key: 'right',
                frames: frameNames,
                frameRate: 25,
                repeat: -1
            });
        
        
        this.input.on('pointerdown', function(p)
        {       
                this.scene.start('menuScene'); 
        }, this);
        
    }
    
    
    
}