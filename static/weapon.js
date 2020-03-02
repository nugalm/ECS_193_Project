// base class for weapons

class Weapon 
{
    constructor(_taste)
    {
        // what sprite to use
        this.sprite;
        // how much base dmg this weapon will deal
        this.power;
        // how fast it will come out (slow, medium, fast; will affect the animation speed)
        this.speed;
        // how often it can be used (int)
        this.cooldown;
        // what taste is the character who is using the weapon (used for damage calculation)
        this.taste = _taste;
        // name of the weapon
        this.name;
        
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