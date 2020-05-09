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
    /**
        function to calculate damage from a projectile hit
    */
    projectileHit(target, projectile) 
    {
        //if salty & salty
        
        //if salty 
            
    }
    
    /**
        function to calculate damage from a melee hit
        @attacker is the person meleeing 
        @defender is the person who was hit
    */
    meleeHit(attacker, defender)
    {
        defender.takeDamage(attacker.weapon.damage);
        
      /*          if (attacker.weapon.taste == "salty")
        {
            switch(defender.element) 
            {
                case "salty":
                    defender.takeDamage(attacker.weapon.damage);
                    break;
                case "spicy":
                    defender.takeDamage(attacker.weapon.damage)
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "spicy")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "sour")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else if (attacker.weapon.taste == "sweet")
        {
            switch(defender.element) 
            {
                case "salty":
                    break;
                case "spicy":
                    break;
                case "sour":
                    break;
                case "sweet":
                    break;
                default:
                    alert("defender.element not found")             
            }
        }
        
        else 
        {
            alert("attacker.weapon not found")    
        }*/
    } // end meleeHit
    
    
    
    
}