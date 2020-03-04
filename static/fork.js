class Fork extends Weapon 
{
    constructor(_taste)
    {
        super(_taste);
        this.sprite;
        this.power = 20;
        this.speed = "medium";
        this.cooldown = 1;
        this.taste = _taste;
        this.name = "fork";
    }
    
    
}