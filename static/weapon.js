// base class for weapons

class Weapon extends Phaser.Physics.Arcade.Sprite
{
    constructor(config)
    {
        super(config.scene, config.x, config.y, config.key);
        //this.setSize(31,115);
       // this.setInteractive();
        config.scene.physics.world.enable(this);
        
        config.scene.add.existing(this);
      //  this.setSize(31,115);
       // this.setSize(220, 332);
    }
    
    printWeaponStats()
    {
        alert(     
                "weapon: "+ this.name + "\n"
				+ "power: " + this.power + "\n"
				+ "speed: " + this.speed + "\n"
                + "cooldown: " + this.cooldown + "\n"
                + "taste: " + this.taste + "\n"
        
        );
        
        
    }
    
    tempInitWeapon()
    {
        
    }
    
}