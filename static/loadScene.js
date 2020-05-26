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
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((this.game.config.width / 2) - 150, this.game.config.height / 2, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'The Mice are getting ready...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        
        this.load.image('logo', 'static/images/loadingSceneArtwithlogo.png');
        
        //preloaders
        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((this.game.config.width / 2) - 140, (this.game.config.height / 2) + 10, 300 * value, 30);
        }, this);

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', function () {
            console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
        
       // this.loadText = this.add.text(100, 100, 'The Mice are getting ready...', { fontSize: '24px', fill: 'white' });
        
        this.loadProjectiles();
        this.loadDrops();
        this.loadMenuSelect();
        this.loadAttackSpriteSheets();
        this.load.multiatlas('kitchenScene', 'static/images/atlas.json', 'static/images');
        this.loadTileMap();
        this.loadMovementAnims();
        this.loadHealthBar();
        
        
        
        //audio
        this.load.audio('game_audio', 'static/Sound/kitchenSceneBGMV2.0.mp3');
        this.load.audio('selection_audio', 'static/Sound/armorySceneBGMV2.0.mp3')
 
    }
    
    // Creating animations to be used in gameScene
    // prompt user to click to enter gameScene
    create()
    {
        this.sound.add('game_audio');
        this.sound.add('selection_audio');
        
        
       // this.loadText.setVisible(false);
        this.add.text(100, 150, 'Click to enter the Marfare!', { fontSize: '32px', fill: 'white' });
        
        
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');
        
        this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
        
            var frameNames = this.anims.generateFrameNames('kitchenScene', {
                start: 0, end: 19, zeroPad: 0, 
                prefix: 'mouse_walk/mouse_walk-', suffix:'.png'
            });

            var walkFrames = this.anims.generateFrameNames('walk_no_weapon', 
            {
                start: 0, end: 20                                  
            })
            
            this.anims.create({
                key: 'left',
                frames: walkFrames,
                frameRate: 25,
                repeat: -1
            });
                  
          this.anims.create({
                key: 'turn',
                frames: this.anims.generateFrameNames('idle_no_weapon',{start: 0, end: 19}),
                frameRate: 20,
                repeat: -1
            });
        
          this.anims.create({
                key: 'right',
                frames: frameNames,
                frameRate: 25,
                repeat: -1
            });
        
            this.anims.create({
               key: 'fork_stab',
                frames: this.anims.generateFrameNames('fork', {start: 0, end: 26}),
                frameRate: 33,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'whisk_twirl',
                frames: this.anims.generateFrameNames('whisk', {start: 0, end: 30}),
                frameRate: 25,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'bottle_squeeze',
                frames: this.anims.generateFrameNames('bottle', {start: 0, end: 20}),
                frameRate: 40,
                repeat: 0
                
            });
        
            this.anims.create({
                key: 'mouse_dash',
                frames: this.anims.generateFrameNames('dash', {start: 0, end: 20} ),
                frameRate: 40,
                repeat: 0
                
            });
        
            this.anims.create({
               key: 'knife_swipe',
                frames: this.anims.generateFrameNames('knife', {start: 0, end: 20}),
                frameRate: 26,
                repeat: 0
            });
        
            this.anims.create({
               key: 'frosting_bag_squeeze',
                frames: this.anims.generateFrameNames('frosting_bag', {start: 0, end: 20}),
                frameRate: 20,
                repeat: 0
            });
        
            this.anims.create({
               key: 'salt_shaker_shake',
                frames: this.anims.generateFrameNames('salt_shaker', {start: 0, end: 10}),
                frameRate: 15,
                repeat: 0
            });
        
            // drops
            this.anims.create({
               key: 'knife_idle',
                frames: this.anims.generateFrameNames('knife_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'fork_idle',
                frames: this.anims.generateFrameNames('fork_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'whisk_idle',
                frames: this.anims.generateFrameNames('whisk_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
             this.anims.create({
               key: 'salt_shaker_idle',
                frames: this.anims.generateFrameNames('salt_shaker_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'squirter_idle',
                frames: this.anims.generateFrameNames('squirter_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'frosting_bag_idle',
                frames: this.anims.generateFrameNames('frosting_bag_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'avocado_idle',
                frames: this.anims.generateFrameNames('avocado_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'blueberry_idle',
                frames: this.anims.generateFrameNames('blueberry_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
            this.anims.create({
               key: 'pepper_idle',
                frames: this.anims.generateFrameNames('pepper_drop', {start: 0, end: 3}),
                frameRate: 6,
                repeat: -1
            });
        
        
           this.anims.create({
               key: 'bottle_projectile_anim',
                frames: this.anims.generateFrameNames('ketchup', {start: 0, end: 5}),
                frameRate: 12,
                repeat: -1
            }); 
        
            this.anims.create({
               key: 'frosting_bag_projectile_anim',
                frames: this.anims.generateFrameNames('frosting', {start: 0, end: 4}),
                frameRate: 10,
                repeat: -1
            }); 
        
            this.anims.create({
               key: 'salt_shaker_projectile_anim',
                frames: this.anims.generateFrameNames('salt', {start: 0, end: 4}),
                frameRate: 10,
                repeat: -1
            }); 
        
            
        
        
        this.input.on('pointerdown', function(p)
        {       if (p.leftButtonDown())
                {  
                    this.scene.start('menuScene', {socket: this.socket}); 
                }
        }, this);   
    }
    
    loadProjectiles()
    {
        //projectiles
        this.load.image('bottle_projectile', 'static/images/projectiles/ketchup/bottle_projectile_anim1.png');
        this.load.image('frosting_bag_projectile',
        'static/images/projectiles/frost/frosting_bag_projectile_anim1.png');
        this.load.image('salt_projectile_1','static/images/projectiles/salt/salt_shaker_projectile_anim1.png');
         this.load.image('salt_projectile_2','static/images/projectiles/salt_shaker_bullet_2.png');
         this.load.image('salt_projectile_3','static/images/projectiles/salt_shaker_bullet_3.png');
        
         this.load.image('salt_projectile_4','static/images/projectiles/salt_shaker_bullet_4.png');
        this.load.image('salt_projectile_5','static/images/projectiles/salt_shaker_bullet_5.png');
        
        this.load.spritesheet('ketchup', "static/images/projectiles/ketchup/spritesheet.png", {frameWidth: 332, frameHeight: 242 } );
        
        this.load.spritesheet('frosting', "static/images/projectiles/frost/frosting_bag_projectile_spritesheet.png", {frameWidth: 332, frameHeight: 242 } );
        
        this.load.spritesheet('salt', "static/images/projectiles/salt/salt_shaker_projectile_spritesheet.png", {frameWidth: 332, frameHeight: 242 } );
    }
    
    loadDrops()
    {
        //melee 
        this.load.image('fork_drop_image', 'static/images/drops/fork/fork-drop.0000.png');
        
        this.load.spritesheet('fork_drop', 
        'static/images/drops/fork/fork_drop.png',{frameWidth:252, frameHeight: 332 });
        
        this.load.image('knife_drop_image', 'static/images/drops/knife_drop_still_2.png');
        
        this.load.spritesheet('knife_drop', 
        'static/images/drops/knife_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        this.load.image('whisk_drop_image', 'static/images/drops/whisk/whisk-drop.0000.png');
        
        this.load.spritesheet('whisk_drop', 
        'static/images/drops/whisk/whisk_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        //ranged
        this.load.image('salt_shaker_drop_image', 'static/images/drops/salt-shaker/salt-shaker-drop.0000.png');
        this.load.spritesheet('salt_shaker_drop', 
        'static/images/drops/salt-shaker/salt_shaker_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        this.load.image('squirter_drop_image', 'static/images/drops/squirter/squirter-drop.0000.png');
        this.load.spritesheet('squirter_drop', 
        'static/images/drops/squirter/squirter_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        
        this.load.image('frosting_bag_drop_image', 'static/images/drops/frosting-bag/frostbag-drop.0000.png');
        this.load.spritesheet('frosting_bag_drop', 
        'static/images/drops/frosting-bag/frosting_bag_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        // food
        this.load.image('blueberry_drop_image', 'static/images/drops/blueberry/blueberry.0000.png');
        this.load.spritesheet('blueberry_drop', 
        'static/images/drops/blueberry/blueberry_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        this.load.image('avocado_drop_image', 'static/images/drops/avocado/avocado.0000.png');
        this.load.spritesheet('avocado_drop', 
        'static/images/drops/avocado/avocado_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        this.load.image('pepper_drop_image', 'static/images/drops/pepper/pepper.0000.png');
        this.load.spritesheet('pepper_drop', 
        'static/images/drops/pepper/pepper_drop.png', {frameWidth: 222 , frameHeight: 332});
    }
    
    loadMenuSelect()
    {
        //menu scene chars
        this.load.image('loadingSpicy', 'static/images/spicyMouse.png');
        this.load.image('loadingSweet', 'static/images/sweetMouse.png');
        this.load.image('loadingSalty', 'static/images/saltyMouse.png');
        this.load.image('loadingSour', 'static/images/sourMouse.png');
    }
    
    loadAttackSpriteSheets()
    {
        //fork stab
        this.load.spritesheet('fork', 'static/images/Attack_Animations/fork_attack_anim.png',
                             {frameWidth: 242, frameHeight: 330 } );
        //whisk twirl
        this.load.spritesheet('whisk','static/images/Attack_Animations/whisk_attack_anim.png',
                             {frameWidth:280, frameHeight:370}
                             );
        
        //knife swipe
        this.load.spritesheet('knife',
        'static/images/Attack_Animations/knife_attack_anim.png',
                             {frameWidth: 242, frameHeight: 332});
                        
        //bottle squeeze
        this.load.spritesheet('bottle','static/images/Attack_Animations/bottle_attack_anim.png',
                             {frameWidth:280, frameHeight:370}
                             );
    
        
        //frosting bag squeeze 
        this.load.spritesheet('frosting_bag', 'static/images/Attack_Animations/frosting_bag_attack_anim.png',
                              {frameWidth: 280, frameHeight: 370});
        
        
        //salt shaker shake
        this.load.spritesheet('salt_shaker', 'static/images/Attack_Animations/salt_shaker_attack_anim.png',
                              {frameWidth: 280, frameHeight: 370});
        
    }
    
    loadTileMap()
    {
        this.load.image('kitchen_tileset', 'static/images/TileMap/kitchen_tileset.png');
        this.load.tilemapTiledJSON('new_map', 'static/images/TileMap/new_map.json')
    }
    
    loadMovementAnims()
    {
        //dash
        this.load.spritesheet('dash', 'static/images/dash/dash/dash_spritesheet.png',
                             {frameWidth: 242, frameHeight: 332 });
        
        //idle
        this.load.spritesheet('idle_no_weapon', 'static/images/Mouse_Walk_Animations/mouse_no_weapon_idle.png',
                              {frameWidth: 280, frameHeight: 370});
        
        //walk
        this.load.spritesheet('walk_no_weapon',
        'static/images/Mouse_Walk_Animations/mouse_walk_no_weapon.png',
                              {frameWidth: 242, frameHeight: 332});
    }
    
    loadHealthBar()
    {
        //healthbar
        this.load.image('red_bar', 'static/images/drops/RedBar.png');
        this.load.image('green_bar', 'static/images/drops/GreenBar.png');
        
        
    }
    
}
