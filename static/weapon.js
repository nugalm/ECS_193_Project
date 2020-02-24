// base class for weapons

class Weapon 
{
    constructor()
    {
        // what sprite to use
        this.sprite;
        // how much dmg it will deal
        this.power;
        // how fast it will come out (slow, medium, fast; will affect the animation speed)
        this.speed;
        // how often it can be used
        this.cooldown;
        // what kind of weapon will it be? (e.g. whisk, fork, spoon)
        this.type;
        
    }
    
    printWeaponStats()
    {
        alert(     
				+ "power: " + this.power + "\n"
				+ "speed: " + this.speed + "\n"
                + "cooldown: " + this.cooldown + "\n"
                + "type: " + this.type + "\n"
        );
        
        
    }
    
    tempInitWeapon()
    {
        
    }
    
}