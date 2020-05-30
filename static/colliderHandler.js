class ColliderHandler 
{
    constructor(context)
    {
        this.context = context;
    }
    
    initColliders()
    {
       
    }
    
    initPlayerColliders()
    {
        this.context.physics.add.collider(this.context.player.myContainer, this.context.collidableLayer);
    }

    
    
    /*
        function to calculate damage from a melee hit
        @attacker is the person attacking
        @defender is the person being attacked
        returns @damage taken by defender
    */
    meleeHit(defender, attacker)
    {
        // Set it to be normally 1 so that we only have to check the conditions where it's not 1. 
        // Thus reduces our checks for more efficiency
        if (attacker == null || defender == null) 
        {
            return 0;
        }
        
        var multiplier = 1;
        
        if (attacker.element == "salty")
        {
            switch(defender.element) 
            {
                case "spicy":
                    multiplier = 1.25;
                    break;
                case "sour":
                    multiplier = 0.75;
                    break;
                default:
                    break;   
            }
        }
        
        else if (attacker.element == "spicy")
        {
            switch(defender.element) 
            {
                case "salty":
                    multiplier = 0.75;
                    break;
                case "sweet":
                    multiplier = 1.25;
                    break;
                default:
                    break;             
            }
        }
        
        else if (attacker.element == "sour")
        {
            switch(defender.element) 
            {
                case "salty":
                    multiplier = 1.25;
                    break;
                case "sweet":
                    multiplier = 0.75;
                    break;
                default:
                    break;             
            }
        }
        
        else if (attacker.element == "sweet")
        {
            switch(defender.element) 
            {
                case "spicy":
                    multiplier = 0.75;
                    break;
                case "sour":
                    multiplier = 1.25;
                    break;
                default:
                    break;            
            }
        }
        
        else 
        {
            //alert("attacker.element not found")    
        }
        
        var damage = 0.25 * attacker.power * multiplier;
        
      //  alert("player power: " + attacker.power + "\n multiplier: " + multiplier + "\n total damage taken: " + damage);
        return damage; 
        
    }
    
    
    
    
    /**
        function to calculate damage from a projectile hit
        @attacker is the bullet 
        @defender is the person who was hit
        returns @damage taken by defender
    */
    projectileHit(attacker, defender, player)
    {
        // Set it to be normally 1 so that we only have to check the conditions where it's not 1. 
        // Thus reduces our checks for more efficiency
        if (attacker == null || defender == null || player == null) 
        {
            return 0;
        }
        
        var multiplier = 1;
        
        if (attacker.element == "salty")
        {
            switch(defender.element) 
            {
                case "spicy":
                    multiplier = 1.25;
                    break;
                case "sour":
                    multiplier = 0.75;
                    break;
                default:
                    break;   
            }
        }
        
        else if (attacker.element == "spicy")
        {
            switch(defender.element) 
            {
                case "salty":
                    multiplier = 0.75;
                    break;
                case "sweet":
                    multiplier = 1.25;
                    break;
                default:
                    break;             
            }
        }
        
        else if (attacker.element == "sour")
        {
            switch(defender.element) 
            {
                case "salty":
                    multiplier = 1.25;
                    break;
                case "sweet":
                    multiplier = 0.75;
                    break;
                default:
                    break;             
            }
        }
        
        else if (attacker.element == "sweet")
        {
            switch(defender.element) 
            {
                case "spicy":
                    multiplier = 0.75;
                    break;
                case "sour":
                    multiplier = 1.25;
                    break;
                default:
                    break;            
            }
        }
        
        else 
        {
            //alert("attacker.element not found")    
        }
        
        
        var damage = 0.25 * player.power * multiplier;
        
        if (attacker.salt == true) 
        {
            damage = damage * 0.33;
        }
        console.log("player power: " + player.power + "\n multiplier: " + multiplier + "\n total damage taken: " + damage);
        return damage; 
        
        
        
    } // end projectileHit
    
    
    
    
}