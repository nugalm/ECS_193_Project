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
    }
    
    initRespawnEvent()
    {
        
    }
    
}