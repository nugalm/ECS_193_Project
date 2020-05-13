class Projectile extends Phaser.Physics.Arcade.Sprite
{
    constructor(config, type)
    {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        
        this.context = config.scene;
        this.type = type;
        this.deletionTime;
        this.initTimedEvent(type);
    }
    
    initTimedEvent(bullet_type)
    {
        if (bullet_type == "salt")
        {
           // alert("hi");
            this.deletionTime = this.context.time.addEvent 
            ({
                delay: 500,
                callback: this.callbackFunction,
                callbackScope: this.context,
                loop: false
            });
        }
        else if (bullet_type == "bottle") 
        {
            
        }
        else if (bullet_type == "frosting")
        {

        }
    }
    
    callbackFunction()
    {
        
      //  this.body.destroy();
       // this.deletionTime.remove();
    }
}