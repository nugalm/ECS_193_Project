class SaltyCharacter extends Character {
    
    constructor() {        
        super();
        this.health = 500;
        this.power = 300;
        this.mana = 70;
        this.speed = 200;
        this.element = "salty";
        //this.weapon = new Fork(this.element);
        this.weapon = "fork";
        this.gun = "salt_shaker";
    }
    

}