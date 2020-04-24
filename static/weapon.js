// base class for weapons

class Weapon extends Phaser.GameObjects.Sprite
{
    constructor(config)
    {
        super(config.scene, config.x, config.y, config.key);
        config.scene.add.existing(this);
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