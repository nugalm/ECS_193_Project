class HealthBar 
{
    constructor(x, y)
    {
        this.healthBar;
        this.backgroundBar;
        this.healthBar;
        this.positionX = x;
        this.positionY = y;
        this.DISPLAY_WIDTH = 80;
        this.DISPLAY_HEIGHT = 60;
        this.max_value = 100;
    }
    
    
    initHealthBar(context)
    {
        //this.backgroundBar = context.add.image(this.positionX, this.positionY, 'red_bar').setOrigin(0,0);
        this.healthBar = context.add.image(this.positionX, this.positionY, 'green_bar')
        this.initDisplay();
    }
    
    initDisplay()
    {
       // this.backgroundBar.scaleY = 0.5;
       // this.backgroundBar.scaleX = 0.5
      //  this.healthBar.scaleY = 0.5;
      //  this.healthBar.scaleX = 1;
       // this.backgroundBar.displayWidth = this.DISPLAY_WIDTH;
       // this.backgroundBar.displayHeight = this.DISPLAY_HEIGHT;
       // this.healthBar.displayWidth = this.DISPLAY_WIDTH;
       // this.healthBar.displayHeight = this.DISPLAY_HEIGHT;
    }
    
    update(x, y, _value)
    {
        this.updatePosition(x, y);
        this.updateScale(_value);
    }
    
    updatePosition(x, y)
    {
        this.healthBar.setPosition(x, y);
      //  this.backgroundBar.setPosition(x, y);
    }
    
    updateScale(_value)
    {
        //console.log(_value)
        this.healthBar.scaleX =   _value / this.max_value;
       // this.healthBar.scaleX = 0.5;
    }
    
}