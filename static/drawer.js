// Responsible for drawing the objects in the gameScene
// class should NOT know what the objects its drawing are, only
// the information needed to draw the objects are passed down and known
class Drawer 
{
    constructor(context)
    {
        this.context = context;
    }
    
    
    draw(){
        this.drawCharacter();
        
    };
    
    drawCharacter()
    {
        this.context.player.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
        this.context.player.initSprite(this.context);
    }
    
}