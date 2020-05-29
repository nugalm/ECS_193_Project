// base class for drops

class Drop extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.respawnTime;
        this.cooldownTime;
        this.type = config.key;
        this.initSize();
    }
    
    initRespawnEvent()
    {
        
    }
    
    initSize()
    {
        if (this.type == 'knife_drop_image') 
        {
            this.setDisplaySize(150, 150);
            this.setSize(90, 100);
            this.setOffset(70, 100);
            this.anims.play("knife_idle");
        }
        else if (this.type == "fork_drop_image")
        {
            this.setDisplaySize(150, 200);
            this.setSize(60, 110);
            this.setOffset(80, 85);
            this.anims.play("fork_idle");
            
        }
        else if (this.type == "whisk_drop_image") 
        {
            this.setDisplaySize(150, 200);
            this.setSize(70, 120);
            this.setOffset(80, 95);
            this.anims.play("whisk_idle");
        }
        
        else if (this.type == "salt_shaker_drop_image")
        {
            this.setDisplaySize(200, 250);
            this.setSize(50, 80);
            this.setOffset(85, 110);
            this.anims.play("salt_shaker_idle");
           
        }
        else if (this.type == "squirter_drop_image")
        {    
            this.setDisplaySize(200, 250);
            this.setSize(60, 90);
            this.setOffset(80, 110);
            this.anims.play("squirter_idle");
           
            
        }
        else if (this.type == "frosting_bag_drop_image")
        {
            this.setDisplaySize(200, 250);
            this.setSize(50, 90);
            this.setOffset(90, 100);
            this.anims.play("frosting_bag_idle");
        }
        else if (this.type == "avocado_drop_image")
        {
            this.setDisplaySize(100, 150);
            this.setSize(50, 90);
            this.setOffset(90, 100);
            this.anims.play("avocado_idle");
        }
        else if (this.type == "blueberry_drop_image") 
        {
            this.setDisplaySize(100, 150);
            this.setSize(60, 60);
            this.setOffset(85, 120);
            this.anims.play("blueberry_idle");
            
        }
        else if (this.type == "pepper_drop_image") 
        {
            this.setDisplaySize(100, 150);
            this.setSize(50, 100);
            this.setOffset(90, 100);
            this.anims.play("pepper_idle");
        }
        
    }
    
}