// base class for weapons

class Weapon extends Drop
{
    constructor(config)
    {
        super(config);
 
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