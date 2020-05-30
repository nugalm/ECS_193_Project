class HealthBar 
{
    constructor()
    {
        this.healthBar;
        this.max_value = 500;
    }
    
    
    initHealthBar(context)
    {
        this.healthBar = context.add.image(0, 50, 'green_bar');
        this.healthBar.setDisplaySize(80, 80);
    }
    
    update(_value)
    {
        this.updateScale(_value);
    }
    
    updatePosition(x, y)
    {
        this.healthBar.setPosition(x, y);
    }
    
    updateScale(_value)
    {
        this.healthBar.scaleX =   _value / this.max_value;
    }
    
}