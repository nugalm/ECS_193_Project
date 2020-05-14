class loadScene extends Phaser.Scene 
{
    constructor()
    {
        super( {key: 'loadScene'} );
        this.loadText;
        this.bg;
    }
    
    init(data)
    {
        this.socket = data.socket;
    }
    
    // Frontload all sprites/images in loading screen
    preload()
    {
        // TODO: make this nice looking graphics
        this.loadText = this.add.text(100, 100, 'The Mice are getting ready...', { fontSize: '24px', fill: 'white' });
        this.load.image('projectile', 'static/images/whiteball.png');
        this.load.image('hitbox', 'static/assets/hitbox_square.png');
        
        this.load.image('bottle_projectile', 'static/images/projectiles/squirter_bullet.png');
        this.load.image('frosting_bag_projectile',
        'static/images/projectiles/frosting_bag_bullet.png');
        
        
        this.load.multiatlas('kitchenScene', 'static/images/atlas.json', 'static/images');
        
        //menu scene chars
        this.load.image('loadingSpicy', 'static/images/spicyMouse.png');
        this.load.image('loadingSweet', 'static/images/sweetMouse.png');
        this.load.image('loadingSalty', 'static/images/saltyMouse.png');
        this.load.image('loadingSour', 'static/images/sourMouse.png');
        
        // trying tile map
        this.load.image('map_sheet', 'static/images/TileMap/map_sheet.png');
        this.load.tilemapTiledJSON('Real_Map', 'static/images/TileMap/Real_Map.json');
        
        // new tile map
        this.load.image('kitchen_tileset', 'static/images/TileMap/kitchen_tileset.png');
        this.load.tilemapTiledJSON('new_map', 'static/images/TileMap/new_map.json')
        
        
        this.load.image('logo', 'static/images/loadingSceneArtwithlogo.png');   

        //fork stab
        this.load.spritesheet('fork', 'static/images/temp/mouse_fork_stab.png',
                             {frameWidth: 220.2, frameHeight: 331 } );

        //whisk twirl
        this.load.spritesheet('whisk','static/images/temp/mouse_whisk_twirl.png',
                             {frameWidth:262, frameHeight:332}
                             );
                        
        //bottle squeeze
        this.load.spritesheet('bottle','static/images/temp/mouse_bottle_squeeze.png',
                             {frameWidth:255.8, frameHeight:383}
                             );
        
        //dash
        this.load.spritesheet('dash', 'static/images/temp/mouse_dash.png',
                             {frameWidth: 220, frameHeight: 330 } );
        
        //knife swipe
        this.load.spritesheet('knife', 'static/images/temp/mouse_knife_swipe.png',
                             {frameWidth: 242, frameHeight: 332 });
        
        //frosting bag squeeze 
        this.load.spritesheet('frosting_bag', 'static/images/temp/mouse_frosting_bag_squeeze.png',
                              {frameWidth: 256.3, frameHeight: 383});
        
        
        //salt shaker shake
        this.load.spritesheet('salt_shaker', 'static/images/temp/mouse_salt_shaker_shake.png',
                              {frameWidth: 222, frameHeight: 332});
        
        
        //frosting bag drop
        
        
        //knife drop
        this.load.spritesheet('knife_drop', 'static/images/temp/knife_drop.png', 
                              {frameWidth: 222, frameHeight: 332});
        this.load.image('knife_drop_image', 'static/images/temp/knife_drop_still.png');
        
        //audio
        this.load.audio('game_audio', 'static/Sound/kitchenSceneBGMV2.0.mp3');
        this.load.audio('selection_audio', 'static/Sound/armorySceneBGMV2.0.mp3')
     
        //healthbar
        this.load.image('red_bar', 'static/images/temp/RedBar.png');
        this.load.image('green_bar', 'static/images/temp/GreenBar.png');
        
        //drops
        this.load.image('fork_drop_image', 'static/images/temp/fork_drop_still.png');
        
        this.load.image('blueberry_drop_image', 'static/images/temp/blueberry_drop_still.png');
        
        this.load.image('avocado_drop_image', 'static/images/temp/avocado_drop_still.png');
        
        this.load.image('pepper_drop_image', 'static/images/temp/pepper_drop_still.png');
        
        this.load.image('salt_shaker_drop_image', 'static/images/temp/salt_shaker_drop_still.png');
        
        this.load.image('squirter_drop_image', 'static/images/temp/squirter_drop_still.png');
        
        this.load.image('whisk_drop_image', 'static/images/temp/whisk_drop_still.png');
        
        this.load.image('frosting_bag_drop_image', 'static/images/temp/frosting_bag_still.png');
        
        // food
        this.load.image('blueberry_drop_image', 'static/images/temp/blueberry_drop_still.png');
        
        this.load.image('avocado_drop_image', 'static/images/temp/avocado_drop_still.png');
        
        this.load.image('pepper_drop_image', 'static/images/temp/pepper_drop_still.png');
 
    }
    
    // Creating animations to be used in gameScene
    // prompt user to click to enter gameScene
    create()
    {
        this.sound.add('game_audio');
        this.sound.add('selection_audio');
        
        
        this.loadText.setVisible(false);
        this.add.text(100, 150, 'Click to enter the Marfare!', { fontSize: '32px', fill: 'white' });
        
        
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');
        
        this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
        
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
        
        
            this.anims.create({
               key: 'fork_stab',
                frames: this.anims.generateFrameNames('fork', {start: 0, end: 4}),
                frameRate: 7,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'whisk_twirl',
                frames: this.anims.generateFrameNames('whisk', {start: 0, end: 15}),
                frameRate: 17,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'bottle_squeeze',
                frames: this.anims.generateFrameNames('bottle', {start: 0, end: 5}),
                frameRate: 10,
                repeat: 0
                
            });
        
            this.anims.create({
                key: 'mouse_dash',
                frames: this.anims.generateFrameNames('dash', {start: 0, end: 4} ),
                frameRate: 9,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'knife_swipe',
                frames: this.anims.generateFrameNames('knife', {start: 0, end: 10}),
                frameRate: 20,
                repeat: 0
            });
        
            this.anims.create({
               key: 'frosting_bag_squeeze',
                frames: this.anims.generateFrameNames('frosting_bag', {start: 0, end: 8}),
                frameRate: 10,
                repeat: 0
            });
        
            this.anims.create({
               key: 'salt_shaker_shake',
                frames: this.anims.generateFrameNames('salt_shaker', {start: 0, end: 5}),
                frameRate: 10,
                repeat: 0
            });
        
            // drops
            this.anims.create({
               key: 'knife_idle',
                frames: this.anims.generateFrameNames('knife_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
        
        
        this.input.on('pointerdown', function(p)
        {       if (p.leftButtonDown())
                {  
                    this.scene.start('menuScene', {socket: this.socket}); 
                }
        }, this);   
    }
}