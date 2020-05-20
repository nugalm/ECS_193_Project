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
        // 32 is the tile width/height of our tile map layers;
        this.characterDisplaySize = 5;
        this.tileWidth = 32;
        this.tileHeight = 32;
    }
    
    
    draw(){
        this.drawCharacter();
        
    };
    
    drawCharacter()
    {
        this.context.player.sprite = this.context.physics.add.sprite(0, 0, 'walk_no_weapon');
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
       
        // check surrounding tiles to take into account character display size
       // var tile = this.context.collidableLayer.getTileAtWorldXY(x, y, true);
        //original tile
        var tile_1 = this.context.collidableLayer.getTileAtWorldXY(x, y, true);  
        // tile to the bottom right of original tile
        var tile_2 = this.context.collidableLayer.getTileAtWorldXY(x + this.tileWidth, y + this.tileHeight, true);
        // tile to the right of original tile
        var tile_3 = this.context.collidableLayer.getTileAtWorldXY(x+ this.tileWidth, y, true);
        // tile to the bottom of original tile
        var tile_4 = this.context.collidableLayer.getTileAtWorldXY(x, y + this.tileHeight, true);
        //tile to the left of original tile
        var tile_5 = this.context.collidableLayer.getTileAtWorldXY(x - this.tileWidth, y, true);
        //tile to the bottom left of original tile
        var tile_6 = this.context.collidableLayer.getTileAtWorldXY(x - this.tileWidth, y + this.tileHeight, true);
        //tile above original tile
        var tile_7 = this.context.collidableLayer.getTileAtWorldXY(x, y - this.tileHeight, true);
        //tile to the top right of original tile
        var tile_8 = this.context.collidableLayer.getTileAtWorldXY(x + this.tileWidth, y - this.tileHeight, true);
        //tile to the top left of original tile
        var tile_9 = this.context.collidableLayer.getTileAtWorldXY(x - this.tileWidth, y - this.tileHeight, true);
        
        
   
            if (this.isViableTile(tile_1) && this.isViableTile(tile_2)  
                && this.isViableTile(tile_3) && this.isViableTile(tile_4)
               && this.isViableTile(tile_5) && this.isViableTile(tile_6)
                && this.isViableTile(tile_7) && this.isViableTile(tile_8)
                && this.isViableTile(tile_9)
               ) 
            {
                return true;
            
            }
            else 
            {
                return false;
            }
        
    }
    
    /**
        checks if tile at given world coordinates @x, @y has collides property
    
    */
    tileCollidesAtPosition(x, y) 
    {
       
        var tile = this.context.collidableLayer.getTileAtWorldXY(x, y, true);
        if (tile == null) 
        {
            return true;
        }
        
        if (tile.collides == true) 
        {
                return true;
            
        }
        else if (tile.collides == false) 
        {
                return false;
        }
    }
    /** 
        checks if tile is a viable tile by checking if it has a collides property
    **/
    isViableTile(tile)
    {
        if (tile.collides == true) 
        {
                return false;
            
        }
        else if (tile.collides == false) 
        {
                return true;
        }
    }

    
    
}