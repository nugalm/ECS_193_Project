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
        this.buttonPositionY = config.height / 2.5;
        this.buttonPositionOffset = config.width / 4;
        this.IMAGE_SCALE = 0.07;
        this.scale = 0.8;
        this.buttonTextOffsetY = 140;
        this.bg;
        
        this.saltyButtonTint = 0xffffff;
        this.sourButtonTint = 0xffffff;
        this.sweetButtonTint = 0xffffff;
        
        this.promptPositionX = (config.width / 4);
        this.promptPositionY = (config.height / 2);
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

        this.initBackground();
        // Create the four different character selections
        this.addButtonSprites();
        this.scaleCharImages();
        this.turnButtonsOn();
        this.userPrompt();
    }
    
    initBackground()
    {
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'menu_bg');
        this.bg.setDisplaySize(this.game.config.width, this.game.config.height);
    }
    addButtonSprites()
    {
        
        
        this.saltyButton = this.add.sprite(this.buttonPositionX, this.buttonPositionY, 'loadingSalty');
     
        this.spicyButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset, this.buttonPositionY, 'loadingSpicy');

        this.sourButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset * 2, this.buttonPositionY, 'loadingSour');
        
        this.sweetButton = this.add.sprite(this.buttonPositionX + this.buttonPositionOffset * 3, this.buttonPositionY, 'loadingSweet');
    }
    
    scaleCharImages()
    {
        this.saltyButton.setScale(0.7);
        this.spicyButton.setScale(0.7);
        this.sourButton.setScale(0.7);
        this.sweetButton.setScale(0.7);
    }

    
    scaleCharImage(_button)
    {
        _button.setScale(this.IMAGE_SCALE);
    }

    turnButtonsOn()
    {
        //salty
        this.saltyButton.setInteractive();
        this.saltyButton.on('pointerover', function()
        {
            this.saltyButton.setScale(0.9);
        }, this);
        
        this.saltyButton.on('pointerout', function()
        {
            this.saltyButton.setTint(this.saltyButtonTint);
            this.saltyButton.setScale(0.7);
        }, this);
        this.saltyButton.on('pointerup', function(p) 
        {
         
                this.scene.start('armoryScene', { player: new SaltyCharacter(), socket: this.socket});
        }, this);
        
        //spicy
        this.spicyButton.setInteractive();
        this.spicyButton.on('pointerover', function()
        {
          
            this.spicyButton.setScale(0.9);
        }, this);
        
        this.spicyButton.on('pointerout', function()
        {
            this.spicyButton.setTint(0xffffff);
            this.spicyButton.setScale(0.7);
        }, this);
        this.spicyButton.on('pointerup', function(p) 
        {
          
                this.scene.start('armoryScene', { player: new SpicyCharacter(), socket: this.socket});
        }, this);
        
        //sour
        this.sourButton.setInteractive();
        this.sourButton.on('pointerover', function()
        {
            this.sourButton.setScale(0.9);
        }, this);
        
        this.sourButton.on('pointerout', function()
        {
            this.sourButton.setScale(0.7);
        }, this);
        this.sourButton.on('pointerup', function(p) 
        {
                this.scene.start('armoryScene', { player: new SourCharacter(), socket: this.socket});
        }, this);
        
        //sweet
        this.sweetButton.setInteractive();
        this.sweetButton.on('pointerover', function()
        {
            this.sweetButton.setScale(0.9);
        }, this);
        
        this.sweetButton.on('pointerout', function()
        {
            this.sweetButton.setScale(0.7);
        }, this);
        this.sweetButton.on('pointerup', function(p) 
        {
            
                this.scene.start('armoryScene', { player: new SweetCharacter(), socket: this.socket});
           
        }, this);   
    }

    userPrompt()
    {
        var text = this.add.text(this.promptPositionX + 125, 
            this.promptPositionY + 220, 
            'Please enter your name and click the Enter button', 
            { color: 'white', fontSize: '24px '});

        // Prompt for the username
        var element = this.add.dom(this.promptPositionX, this.promptPositionY).createFromCache('username');

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
                    sessionStorage.setItem('username', this.username);
                }
                else
                {
                    //  Flash the prompt
                    this.scene.add(username);
                }
            }
        });
    }
}
