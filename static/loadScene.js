class loadScene extends Phaser.Scene 
{
    
    
    constructor()
    {
        super( 
            { key: 'loadScene',
              pack: {
                        files: [ 
                            {type: 'image', key: 'logo', url: 'static/images/loadingSceneArtwithlogo.png'}
                        ]
                    }  
            });
        this.loadingText;
        this.bg;
        this.start_button;
        this.tutorial_button;
        this.credits_button;
       
    }
    
    init(data)
    {
        this.socket = data.socket;
    }
    
    // Frontload all sprites/images in loading screen
    preload()
    {
        // background image
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'logo');
        this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
        
        this.preloaders();
       
        this.loadArmorySceneAssets();
        this.loadMeleeLayer();
        this.loadButtons();
        this.loadProjectiles();
        this.loadDrops();
        this.loadMenuSelect();
        this.loadAttackSpriteSheets();
        this.load.multiatlas('kitchenScene', 'static/images/atlas.json', 'static/images');
        this.loadTileMap();
        this.loadMovementAnims();
        this.loadIdleAnims();
        this.loadHealthBar();
        this.load.image('menu_background', 'static/images/menu_background.png');
        
        
        //audio
        this.load.audio('game_audio', 'static/Sound/kitchenSceneBGMV2.0.mp3');
        this.load.audio('selection_audio', 'static/Sound/armorySceneBGMV2.0.mp3');
        this.load.audio('m', 'static/images/armoryScene/m.mp3');
 
    }
    
    // Creating animations to be used in gameScene
    // prompt user to click to enter gameScene
    create()
    {
        this.sound.add('game_audio');
        this.sound.add('selection_audio');
        
        
        
        this.initButtons();
        this.initAttackAnimations();
        this.initMovementAnimations();
        this.initIdleAnimations();
        this.initDropsAnimations();
        this.initProjectileAnimations();
        this.initButtonInputs();
        this.initMeleeLayers();
        
       
        
        
        
        
    }
    
    initIdleAnimations()
    {
        this.anims.create({
            key: 'mouse_frosting_bag_idle',
            frames: this.anims.generateFrameNames('mouse_idle_frosting_bag', {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        })
        
        this.anims.create({
            key: 'mouse_salt_shaker_idle',
            frames: this.anims.generateFrameNames('mouse_idle_salt_shaker', {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        })
        
        this.anims.create({
            key: 'mouse_squirter_idle',
            frames: this.anims.generateFrameNames('mouse_idle_squirter', {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        })
        
    }
    
    initMovementAnimations()
    {
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
            key: 'mouse_salt_shaker_walk',
            frames: this.anims.generateFrameNames('salt_shaker_walk', {start: 0, end: 20}),
            frameRate: 25,
            repeat: -1
        });
        
        this.anims.create({
            key: 'mouse_squirter_walk',
            frames: this.anims.generateFrameNames('squirter_walk', {start: 0, end: 20}),
            frameRate: 25,
            repeat: -1
        });
        
        this.anims.create({
            key: 'mouse_frosting_bag_walk',
            frames: this.anims.generateFrameNames('frosting_bag_walk', {start: 0, end: 20}),
            frameRate: 25,
            repeat: -1
        });
        
        
        this.anims.create({
            key: 'mouse_dash',
            frames: this.anims.generateFrameNames('dash', {start: 0, end: 20} ),
            frameRate: 40,
            repeat: 0 
        });
    }
    
    initAttackAnimations()
    {
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
    }
    
    initProjectileAnimations()
    {
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
    }
    
    initDropsAnimations()
    {
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
    }
    
    initMeleeLayers() 
    {
        //knife
        this.anims.create({
            key: 'knife_dash',
            frames: this.anims.generateFrameNames('knife_layer', {start: 36, end: 56}),
            frameRate: 40,
            repeat: 0
        })
        
        this.anims.create({
            key: 'knife_layer_idle',
            frames: this.anims.generateFrameNames('knife_layer', {start: 0, end: 0}),
            frameRate: 0,
            repeat: -1
        })
        
         this.anims.create({
            key: 'knife_salt_shaker',
            frames: this.anims.generateFrameNames('knife_layer', {start: 2, end: 12}),
            frameRate: 15,
            repeat: 0
        })
        
         this.anims.create({
            key: 'knife_frosting_bag',
            frames: this.anims.generateFrameNames('knife_layer', {start: 14, end: 34}),
            frameRate: 20,
            repeat: 0
        })
        
        //fork
        this.anims.create({
            key: 'fork_dash',
            frames: this.anims.generateFrameNames('fork_layer', {start: 36, end: 56}),
            frameRate: 40,
            repeat: 0
        })
        
        this.anims.create({
            key: 'fork_layer_idle',
            frames: this.anims.generateFrameNames('fork_layer', {start: 0, end: 0}),
            frameRate: 0,
            repeat: -1
        })
        
         this.anims.create({
            key: 'fork_salt_shaker',
            frames: this.anims.generateFrameNames('fork_layer', {start: 2, end: 12}),
            frameRate: 15,
            repeat: 0
        })
        
         this.anims.create({
            key: 'fork_frosting_bag',
            frames: this.anims.generateFrameNames('fork_layer', {start: 14, end: 34}),
            frameRate: 20,
            repeat: 0
        })
        
        //whisk
        this.anims.create({
            key: 'whisk_dash',
            frames: this.anims.generateFrameNames('whisk_layer', {start: 36, end: 56}),
            frameRate: 40,
            repeat: 0
        })
        
        this.anims.create({
            key: 'whisk_layer_idle',
            frames: this.anims.generateFrameNames('whisk_layer', {start: 0, end: 0}),
            frameRate: 0,
            repeat: -1
        })
        
         this.anims.create({
            key: 'whisk_salt_shaker',
            frames: this.anims.generateFrameNames('whisk_layer', {start: 2, end: 12}),
            frameRate: 15,
            repeat: 0
        })
        
         this.anims.create({
            key: 'whisk_frosting_bag',
            frames: this.anims.generateFrameNames('whisk_layer', {start: 14, end: 34}),
            frameRate: 20,
            repeat: 0
        })
        
    }
    
    initButtonInputs()
    {
        //enter game scene
        this.start_button.on('pointerup', function(p)
        {       //if (p.leftButtonDown())
               // {  
                    this.scene.start('menuScene', {socket: this.socket}); 
                //}
        }, this);
        
        //tutorial pop-up
        this.tutorial_button.on('pointerup', function(p)
        {       
            //TODO: tutorial page
        }, this);
        
        //credits pop-up
        this.credits_button.on('pointerup', function(p)
        {      
            //TODO: credits page
        }, this);
        
        this.start_button.on('pointerover', function (p) 
        {
            this.start_button.setTint(0x808080);
        }, this);
        
        this.start_button.on('pointerout', function (p)
        {
            this.start_button.setTint(0xffffff);
        }, this)
        
        this.tutorial_button.on('pointerover', function (p) 
        {
            this.tutorial_button.setTint(0x808080);
        }, this);
        
        this.tutorial_button.on('pointerout', function (p)
        {
            this.tutorial_button.setTint(0xffffff);
        }, this)
        
        this.credits_button.on('pointerover', function (p) 
        {
            this.credits_button.setTint(0x808080);
        }, this);
        
        this.credits_button.on('pointerout', function (p)
        {
            this.credits_button.setTint(0xffffff);
        }, this)
    }
    
    initButtons()
    {
        this.start_button = this.add.sprite((this.game.config.width / 3) - 150, this.game.config.height - (this.game.config.height / 9), 'start_button');
        this.tutorial_button = this.add.sprite((this.game.config.width / 3) + 150, this.game.config.height - (this.game.config.height / 9), 'tutorial_button');
        this.credits_button =  this.add.sprite((this.game.config.width / 3) + 450, this.game.config.height - (this.game.config.height / 9), 'credits_button');
        
        this.initButton(this.start_button);
        this.initButton(this.tutorial_button);
        this.initButton(this.credits_button);
        
       
    }
    
    initButton(_button) 
    {
        _button.setScale(0.5);
        _button.setInteractive();
    }
    
    loadButtons() 
    {
        this.load.image('start_button', 'static/images/loadingScene/btn1_start.png');
        this.load.image('tutorial_button', 'static/images/loadingScene/btn2_tutorial.png');
        this.load.image('credits_button', 'static/images/loadingScene/btn3_credits.png');
    }
    
    loadMeleeLayer()
    {
        this.load.image('knife_layer_static',
                       'static/images/weapon_layer/knife/knife_layer_static.png');
        
        this.load.spritesheet('knife_layer','static/images/weapon_layer/knife/knife_layer.png', {frameWidth: 242, frameHeight: 332})
        
        
        
        
        this.load.image('whisk_layer_static', 
                       'static/images/weapon_layer/whisk/whisk_layer_static.png');
        this.load.spritesheet('whisk_layer', 
                       'static/images/weapon_layer/whisk/whisk_layer.png', {frameWidth: 242, frameHeight: 332});
        
        
        this.load.image('fork_layer_static', 'static/images/weapon_layer/fork/fork_layer_static.png');
        this.load.spritesheet('fork_layer',  'static/images/weapon_layer/fork/fork_layer.png', {frameWidth: 242, frameHeight: 332});
        
        
        
        
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
        this.load.image('fork_drop_image', 'static/images/drops_v2/fork/fork-drop-v2.0000.png');
        
        this.load.spritesheet('fork_drop', 
        'static/images/drops_v2/fork/fork_drop.png',{frameWidth:222, frameHeight: 332 });
        
        this.load.image('knife_drop_image', 'static/images/drops_v2/knife/knife-drop-v2.0000.png');
        
        this.load.spritesheet('knife_drop', 
        'static/images/drops_v2/knife/knife_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        this.load.image('whisk_drop_image', 'static/images/drops_v2/whisk/whisk-drop-v2.0000.png');
        
        this.load.spritesheet('whisk_drop', 
        'static/images/drops_v2/whisk/whisk_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        //ranged
        this.load.image('salt_shaker_drop_image', 'static/images/drops_v2/salt-shaker/salt-shaker-drop-v2.0000.png');
        this.load.spritesheet('salt_shaker_drop', 
        'static/images/drops_v2/salt-shaker/salt_shaker_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        this.load.image('squirter_drop_image', 'static/images/drops_v2/squirter/squirter-drop-v2.0000.png');
        this.load.spritesheet('squirter_drop', 
        'static/images/drops_v2/squirter/squirter_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        
        this.load.image('frosting_bag_drop_image', 'static/images/drops_v2/frostingbag/frosting-bag-drop-v2.0000.png');
        this.load.spritesheet('frosting_bag_drop', 
        'static/images/drops_v2/frostingbag/frosting_bag_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        // food
        this.load.image('blueberry_drop_image', 'static/images/drops_v2/blueberry/blueberry-drop-v2.0000.png');
        this.load.spritesheet('blueberry_drop', 
        'static/images/drops_v2/blueberry/blueberry_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        
        this.load.image('avocado_drop_image', 'static/images/drops_v2/avocado/avocado-drop-v2.0000.png');
        this.load.spritesheet('avocado_drop', 
        'static/images/drops_v2/avocado/avocado_drop.png', {frameWidth: 222 , frameHeight: 332});
        
        this.load.image('pepper_drop_image', 'static/images/drops_v2/pepper/pepper-drop-v2.0000.png');
        this.load.spritesheet('pepper_drop', 
        'static/images/drops_v2/pepper/pepper_drop.png', {frameWidth: 222 , frameHeight: 332});
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
        
        this.load.spritesheet('salt_shaker_walk',
        'static/images/Mouse_Walk_Animations/salt_shaker_walk/salt_shaker_walk.png',
                              {frameWidth: 242, frameHeight: 332});
        
        this.load.spritesheet('frosting_bag_walk',
        'static/images/Mouse_Walk_Animations/frosting_bag_walk/frosting_bag_walk.png',
                              {frameWidth: 242, frameHeight: 332});
        
        this.load.spritesheet('squirter_walk',
        'static/images/Mouse_Walk_Animations/squirter_walk/squirter_walk.png',
                              {frameWidth: 242, frameHeight: 332});
        
        
        
    }
    
    loadIdleAnims()
    {
        this.load.spritesheet('mouse_idle_frosting_bag', 'static/images/Mouse_Walk_Animations/frosting_bag_idle/frosting_bag_idle.png',
                              {frameWidth: 242, frameHeight: 332});
        
        this.load.spritesheet('mouse_idle_salt_shaker', 'static/images/Mouse_Walk_Animations/salt_shaker_idle/salt_shaker_idle.png',
                              {frameWidth: 242, frameHeight: 332});
        
        this.load.spritesheet('mouse_idle_squirter', 'static/images/Mouse_Walk_Animations/squirter_idle/squirter_idle.png',
                              {frameWidth: 242, frameHeight: 332});
    }
    
    loadHealthBar()
    {
        //healthbar
        this.load.image('red_bar', 'static/images/drops/RedBar.png');
        this.load.image('green_bar', 'static/images/drops/GreenBar.png');
        
        
    }
    
    loadArmorySceneAssets()
    {
        		// loading assets
		this.load.atlas('dice', 'static/images/armoryScene/dice.png', 'static/images/armoryScene/dice.json');
		this.load.image('block_0', 'static/images/armoryScene/block_0.png');
		this.load.image('block_1_1', 'static/images/armoryScene/meleeweapon_fork.jpg');
		this.load.image('block_1_2', 'static/images/armoryScene/meleeweapon_whisk.jpg');
		this.load.image('block_1_3', 'static/images/armoryScene/meleeweapon_knife.jpg');
		this.load.image('block_1_4', 'static/images/armoryScene/rangedweapon_bottlesquirter1.jpg');
		this.load.image('block_1_4_2', 'static/images/armoryScene/rangedweapon_bottlesquirter2.jpg');
		this.load.image('block_1_5', 'static/images/armoryScene/rangedweapon_saltshaker.jpg');
		this.load.image('block_1_6', 'static/images/armoryScene/rangedweapon_frostingbag.jpg');
		this.load.image('block_2_1', 'static/images/armoryScene/healthbooster_avocado.jpg');
		this.load.image('block_2_2', 'static/images/armoryScene/powerbooster_pepper.jpg');
		this.load.image('block_2_3', 'static/images/armoryScene/speedbooster_blueberry.jpg');
		this.load.image('block_18', 'static/images/armoryScene/block_18.png');
		this.load.image('question_mark1', 'static/images/armoryScene/question_mark1.jpg');
		this.load.image('question_mark2', 'static/images/armoryScene/question_mark2.jpg');
		this.load.image('question_mark3', 'static/images/armoryScene/question_mark3.jpg');
		this.load.image('start', 'static/images/armoryScene/start.png');
		this.load.image('role', 'static/images/armoryScene/role.png');
		this.load.image('w', 'static/images/armoryScene/w.png');
		this.load.image('layer1', 'static/images/armoryScene/layer1.png');
		this.load.image('layer2', 'static/images/armoryScene/dialogue_dice.png');

		this.load.image('block_1_1_layer', 'static/images/armoryScene/dialogue_fork.png');
		this.load.image('block_1_2_layer', 'static/images/armoryScene/dialogue_whisk.png');
		this.load.image('block_1_3_layer', 'static/images/armoryScene/dialogue_knife.png');
		this.load.image('block_1_4_layer', 'static/images/armoryScene/dialogue_bottlesquirter1.png');
		this.load.image('block_1_4_2_layer', 'static/images/armoryScene/dialogue_bottlesquirter2.png');
		this.load.image('block_1_5_layer', 'static/images/armoryScene/dialogue_saltshaker.png');
		this.load.image('block_1_6_layer', 'static/images/armoryScene/dialogue_frostingbag.png');

		this.load.image('layer1_btn1', 'static/images/armoryScene/layer1_btn1.png');
		this.load.image('layer1_btn2', 'static/images/armoryScene/layer1_btn2.png');
		this.load.image('layer2_btn1', 'static/images/armoryScene/layer2_btn1.png');
		this.load.image('layer2_btn2', 'static/images/armoryScene/layer2_btn2.png');
		this.load.image('close', 'static/images/armoryScene/close.png');
		this.load.image('enter', 'static/images/armoryScene/enter.png');
		this.load.image('propbar', 'static/images/armoryScene/propbar.png');
		this.load.image('statsbar', 'static/images/armoryScene/statsbar.png');
		this.load.image('background', 'static/images/armoryScene/background.jpg');
		
    }
    
    preloaders()
    {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((this.game.config.width / 2) - 150, this.game.config.height - (this.game.config.height / 9), 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        
        //text
        this.loadingText = this.make.text({
            x: width / 2,
            y: height - (height / 7),
            text: 'The Mice are getting ready...',
            style: {
                font: '30px monospace',
                fill: '#ffffff'
            }
        });
        console.log(this.loadingText.style.font);
        this.loadingText.setOrigin(0.5, 0.5);
        
        //percent 
        var percentText = this.make.text({
            x: width / 2,
            y: this.game.config.height - (this.game.config.height / 9) + 25,
            text: '0%',
            style: {
            font: '18px monospace',
            fill: '#ffffff'
            }
        }, this);
        percentText.setOrigin(0.5, 0.5);
        
        
        //preloaders
        this.load.on('progress', function (value) {
           // console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((this.game.config.width / 2) - 140, (this.game.config.height - (this.game.config.height / 9)) + 10, 300 * value, 30);
        }, this);

        this.load.on('fileprogress', function (file) {
           // console.log(file.src);
        });

        this.load.on('complete', function () {
          //  console.log('complete');
            progressBar.destroy();
            progressBox.destroy();
            percentText.destroy();
           // this.loadingText.text = 'The Mice Are Ready! Click to Enter the Marfare!';
            this.loadingText.destroy();
        }, this);
    }
    
}
