// Responsible for drawing the objects in the gameScene
// class should NOT know what the objects its drawing are, only
// the information needed to draw the objects are passed down and known
class Drawer 
{
    constructor(context)
    {
        this.context = context;
        this.xMapLimit = 2560;
        this.yMapLimit = 2560;
        
    }
    
    
    draw(){
        this.drawCharacter();
        
    };
    
    drawCharacter()
    {
        this.context.player.sprite = this.context.physics.add.sprite(0, 0, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
        this.initSpawnPoint(this.context.player);
        this.context.player.initSprite(this.context);
    }
    
    initSpawnPoint(player)
    {
        var x;
        var y;
        while (true) {
            x = Phaser.Math.Between(0, this.xMapLimit);
            y = Phaser.Math.Between(0, this.yMapLimit);
            
            //found good spawn point
            if (this.isViableSpawnPoint(x,y))
            {
                break;
            }
        }
        
        player.startPositionX = x;
        player.startPositionY = y;
        console.log("random x found: ", x);
        console.log("random y found: ", y);
        
    }
    
    /**
        checks if world coordinates @x, @y, collides with collidable objects in collidable layer. 
        returns @true if spawn point is viable (i.e. does not coincide with collidable object)
        returns @false otherwise
    */
    isViableSpawnPoint(x, y)
    {
        var tile = this.context.collidableLayer.getTileAtWorldXY(x, y, true);
        console.log("tile belongs to layer: ", tile.layer.name);
        console.log("tile.collides: ", tile.collides);
        if (tile.collides == true) 
        {
            return false;
            
        }
        else if (tile.collides == false) 
        {
            console.log("tile.index: ", tile.index);
            return true;
        }
    }
    
    
}