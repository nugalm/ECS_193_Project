// Scene where user picks his type of character / enters username
class menuScene extends Phaser.Scene
{
    
    constructor()
    {   
        super( {key: 'menuScene'} );
        this.saltyButton;
        this.spicyButton;
        this.sourButton;
        this.sweetButton;
        this.buttonPositionX = 250;
        this.buttonPositionY = 250;
    }
    
    // loadScene should have loaded everything we need.
    preload()
    {
        
        
    }
    
    create()
    {
        this.add.text(100, 100, 'Choose your taste!', { fontSize: '24px', fill: 'white' });
        
        // Create the four different character selections
        this.addButtonSprites();
        this.turnButtonsOn();       
        
    }
    
    addButtonSprites()
    {
        this.saltyButton = this.add.sprite(this.buttonPositionX, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.saltyButton.x - 50, this.saltyButton.y - 50, 'Salty');
        
        this.spicyButton = this.add.sprite(this.buttonPositionX + 100, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.spicyButton.x - 50, this.spicyButton.y - 50, 'Spicy');
        
        this.sourButton = this.add.sprite(this.buttonPositionX + 200, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.sourButton.x - 50, this.sourButton.y - 50, 'Sour');
        
        this.sweetButton = this.add.sprite(this.buttonPositionX + 300, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.sweetButton.x - 50, this.sweetButton.y - 50, 'Sweet');
        
        
        
    }
    
    turnButtonsOn()
    {
        //salty
        this.saltyButton.setInteractive();
        this.saltyButton.on('pointerover', function()
        {
            this.saltyButton.setTint(0xf0ff00);
        }, this);
        
        this.saltyButton.on('pointerout', function()
        {
            this.saltyButton.setTint(0xffffff);
        }, this);
        this.saltyButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){           
                alert('everything tastes better with salt');
                this.scene.start('armoryScene', { player: new SaltyCharacter()});
            }
        }, this);
        
        //spicy
        this.spicyButton.setInteractive();
        this.spicyButton.on('pointerover', function()
        {
            this.spicyButton.setTint(0xf0ff00);
        }, this);
        
        this.spicyButton.on('pointerout', function()
        {
            this.spicyButton.setTint(0xffffff);
        }, this);
        this.spicyButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  
                alert('is it hot in here..or is it just you?');
                this.scene.start('armoryScene', { player: new SpicyCharacter()});
            }
        }, this);
        
        //sour
        this.sourButton.setInteractive();
        this.sourButton.on('pointerover', function()
        {
            this.sourButton.setTint(0xf0ff00);
        }, this);
        
        this.sourButton.on('pointerout', function()
        {
            this.sourButton.setTint(0xffffff);
        }, this);
        this.sourButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  
                alert('here, have a token of sour gratitude');
                this.scene.start('armoryScene', { player: new SourCharacter()});
            }
        }, this);
        
        //sweet
        this.sweetButton.setInteractive();
        this.sweetButton.on('pointerover', function()
        {
            //alert('you chose salty mouse');
            this.sweetButton.setTint(0xf0ff00);
        }, this);
        
        this.sweetButton.on('pointerout', function()
        {
            this.sweetButton.setTint(0xffffff);
        }, this);
        this.sweetButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  
                alert('mm.. the sweet smell of a winner');
                this.scene.start('armoryScene', { player: new SweetCharacter()});
            }
        }, this);
            
            
        
    }
    
    
    
    
    
    
    
    
}