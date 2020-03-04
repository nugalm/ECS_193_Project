class SaltyCharacter extends Character {
    
    constructor() {        
        super();
        this.health = 100;
        this.power = 60;
        this.mana = 70;
        this.speed = 60;
        this.element = "salty";
        this.weapon = new Fork(this.element);
    }
    

}