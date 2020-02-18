/**
    Function to determine what to do if a collision has happened.
    For now it takes in a boolean value @hit from @CollisionDetector.
    It assumes that that collision detected is between a projectile sprite and 
    a player sprite (@target).
    If a collision is detected, it turns the hit @target semi-transparent, else nothing happens.
    
    TODO: JavaScript does not have method overloading so we have to find out if the
    sprites are players, projectiles, etc. inside this one function. For now the function
    just assumes a projectile (whiteball png )and a player (the blue object png).
*/

function collisionAction(c, target){
    
    if (c) {
        //make target semi-transparent
        target.alpha = 0.5;
        
    }
    
    else {
        target.alpha = 1;
    }
    
    
}