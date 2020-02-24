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
        this.drawSky();
        this.drawPlatforms();
        this.drawStars();
        this.drawCharacter();
        
    };
    
    drawSky() 
    {
        this.context.add.image(400, 300, 'sky');    
    }
    
    drawStars()
    {
        // creating dynamic physics group instead of static to make it bounce
        this.context.stars = this.context.physics.add.group({
            // any children created will be fiven the star texture by default
            key: 'star',
            // create 1 child then repeat 11 times = 12 stars total
            repeat: 11,
            // set the stars starting at 12, 0
            // first one at 12, 0  - second one 12+70, 0 => 82, 0
            // third at 152, 0 etc.
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
         this.context.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
    }
    
    drawCharacter()
    {
        this.context.player.sprite = this.context.physics.add.sprite(this.context.player.startPositionX, this.context.player.startPositionY, 'kitchenScene', 'mouse_walk/mouse_walk-2.png');
        this.context.player.initSprite();
    }
    
   
    
    drawPlatforms()
    {
        // refresh body tells Phaser we changed a Static physics body
        this.context.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.context.platforms.create(600, 400, 'ground');
        this.context.platforms.create (50, 250, 'ground');
        this.context.platforms.create(750, 220, 'ground');
    }
    
}