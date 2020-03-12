class Fork extends Weapon 
{
    constructor(_taste)
    {
        super(_taste);
        this.sprite;
        this.power = 20;
        this.speed = "medium";
        this.cooldown = 1;
        this.taste = _taste;
        this.name = "fork";
        this.hitbox;
    }

    createForkInstance(context)
    {
        var meleehitbox = context.meleeHitboxes.create(context.player.sprite.x, context.player.sprite.y, 'fork');
        meleehitbox.setDisplaySize(100, 50);
        meleehitbox.setSize(350, 350);
        meleehitbox.setOffset(60, 90);
        meleehitbox.body.setAllowGravity(false);
        meleehitbox.disableBody(true, true);
        return meleehitbox;
    }
    
    initHitbox(_width, _height, _x, _y)
    {
        
    }
    
    initSprite()
    {
       
    }
    
}