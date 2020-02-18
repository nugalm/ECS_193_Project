/**
    Collision detection function. Uses width and height of @rec1 and @rec2
    in order to detect a collision. rec1 and rec2 are assumed to have width 
    and height values.
    
*/

function collisionDetector (rec1, rec2) {
    
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    
    //boolean value to detect collision.
    hit = false;
    
    //Find center points of sprites
    rec1.centerX = rec1.x + rec1.width / 2; 
    rec1.centerY = rec1.y + rec1.height / 2; 
    rec2.centerX = rec2.x + rec2.width / 2; 
    rec2.centerY = rec2.y + rec2.height / 2; 

    //Find half-widths and half-heights sprites
    rec1.halfWidth = rec1.width / 2;
    rec1.halfHeight = rec1.height / 2;
    rec2.halfWidth = rec2.width / 2;
    rec2.halfHeight = rec2.height / 2;

    //Calculate distance vector between sprites
    vx = rec1.centerX - rec2.centerX;
    vy = rec1.centerY - rec2.centerY;

    //Find combined half-widths and half-heights
    combinedHalfWidths = rec1.halfWidth + rec2.halfWidth;
    combinedHalfHeights = rec1.halfHeight + rec2.halfHeight;

    //Check collision on x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //Check collision on y axis
        if (Math.abs(vy) < combinedHalfHeights) {
        //collision happening
            hit = true;
        } else {
            hit = false;
        }
    //end first 'if'
    } else {
        //no collision on x axis
        hit = false;
    }
    //if (hit == true){
       // alert("Collision detected!");
   // }
        return hit;
}
    