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
        this.buttonPositionX = (config.width / 4) - (config.width  / 8);
        this.buttonPositionY = config.height / 2;
        this.buttonPositionOffset = config.width / 4;
        this.IMAGE_SCALE = 0.07;
        this.buttonTextOffsetY = 140;
        
        this.saltyButtonTint = 0x738F9E;
        this.sourButtonTint = 0x05DE49;
        this.sweetButtonTint = 0xFC00C4;
    }
    
    init(data)
    {
        this.socket = data.socket;
    }
    
    // loadScene should have loaded everything we need.
    preload()
    {
        this.load.html('username', 'static/data/username.html');
    }
    
    create()
    {
        this.add.text(100, 100, 'Choose your taste!', { fontSize: '24px', fill: 'white' });
        
        // Create the four different character selections
        this.addButtonSprites();

        this.scaleCharImages();
        this.tempSetTintforButtons();
        this.addButtonTexts();
        this.turnButtonsOn();       
        

    }
    
    addButtonSprites()
    {
        this.saltyButton = this.add.sprite(this.buttonPositionX, this.buttonPositionY, 'loadingSpicy');
     
        this.spicyButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset, this.buttonPositionY, 'loadingSpicy');

        this.sourButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset * 2, this.buttonPositionY, 'loadingSpicy');
        
        this.sweetButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset * 3, this.buttonPositionY, 'loadingSpicy');
    }
    
    tempSetTintforButtons()
    {
        this.saltyButton.setTint(this.saltyButtonTint);
        this.sourButton.setTint(this.sourButtonTint);
        this.sweetButton.setTint(this.sweetButtonTint);
    }
    
    
    scaleCharImages()
    {
        this.scaleCharImage(this.saltyButton);
        this.scaleCharImage(this.spicyButton);
        this.scaleCharImage(this.sourButton);
        this.scaleCharImage(this.sweetButton);
    }

    addButtonTexts()
    {
        this.add.text(this.saltyButton.x - 50, this.saltyButton.y - this.buttonTextOffsetY, 'Salty');
        
        this.add.text(this.spicyButton.x - 50, this.spicyButton.y - this.buttonTextOffsetY, 'Spicy');
        
        this.add.text(this.sourButton.x - 50, this.sourButton.y - this.buttonTextOffsetY, 'Sour');
        
        this.add.text(this.sweetButton.x - 50, this.sweetButton.y - this.buttonTextOffsetY, 'Sweet');
    }
    
    scaleCharImage(_button)
    {
        _button.setScale(this.IMAGE_SCALE);
    }

    turnButtonsOn()
    {
        var text = this.add.text(this.cameras.main.centerX - this.cameras.main.centerX/3.5, 
            this.cameras.main.centerY + 150, 
            'Please enter your name', 
            { color: 'white', fontSize: '24px '});

        // Prompt for the username
        var element = this.add.dom(this.cameras.main.centerX/2, this.cameras.main.centerY/2 + 100).createFromCache('username');

        element.addListener('click');

        // Username entry
        element.on('click', function (event) {
    
            if (event.target.name === 'playButton')
            {
                var username = this.getChildByName('userName');
    
                //  Have they entered anything?
                if (username.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click');
    
                    //  Hide the login element
                    this.setVisible(false);
    
                    //  Populate the text with whatever they typed in
                    text.setText('Welcome ' + username.value);
                    this.username = username.value;
                }
                else
                {
                    //  Flash the prompt
                    this.scene.add(username);
                }
            }
        });

        //salty
        this.saltyButton.setInteractive();
        this.saltyButton.on('pointerover', function()
        {
            this.saltyButton.setTint(0xf0ff00);
        }, this);
        
        this.saltyButton.on('pointerout', function()
        {
            this.saltyButton.setTint(this.saltyButtonTint);
        }, this);
        this.saltyButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){           
               // alert('everything tastes better with salt');
                this.scene.start('armoryScene', { player: new SaltyCharacter(), socket: this.socket});
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
                //alert('is it hot in here..or is it just you?');
                this.scene.start('armoryScene', { player: new SpicyCharacter(), socket: this.socket});
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
            this.sourButton.setTint(this.sourButtonTint);
        }, this);
        this.sourButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  
               // alert('here, have a token of sour gratitude');
                this.scene.start('armoryScene', { player: new SourCharacter(), socket: this.socket});
            }
        }, this);
        
        //sweet
        this.sweetButton.setInteractive();
        this.sweetButton.on('pointerover', function()
        {
            this.sweetButton.setTint(0xf0ff00);
        }, this);
        
        this.sweetButton.on('pointerout', function()
        {
            this.sweetButton.setTint(this.sweetButtonTint);
        }, this);
        this.sweetButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  
                //alert('mm.. the sweet smell of a winner');
                this.scene.start('armoryScene', { player: new SweetCharacter(), socket: this.socket});
            }
        }, this);   
    }
}