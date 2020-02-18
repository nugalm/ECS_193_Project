/**
    Function that contains the @sprite within the @container.
    @container is assumed to have x, y, width, and height properties that define
    a rectangular object. 
    
    In our case, the rectangular object will be our 'stage' in the ElementalGame.html.
    @sprite is the player in this case, but the function can also be used for any sprite

    return value of @collided is left, right, bottom, or top depending which side
    of the @container the @sprite hit
*/


function containCharacter(sprite, container){
    
    let collided = undefined;  

    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }


    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }


    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
    
    
}