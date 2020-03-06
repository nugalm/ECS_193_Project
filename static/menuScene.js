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
        this.username;
        this.playerType;
        this.buttonPositionX = 250;
        this.buttonPositionY = 250;
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
        this.userPrompt();
        this.turnButtonsOn();
    }
    
    addButtonSprites()
    {
        console.log("addButton");
        this.saltyButton = this.add.sprite(this.buttonPositionX, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.saltyButton.x - 50, this.saltyButton.y - 50, 'Salty');
        
        this.spicyButton = this.add.sprite(this.buttonPositionX + 100, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.spicyButton.x - 50, this.spicyButton.y - 50, 'Spicy');
        
        this.sourButton = this.add.sprite(this.buttonPositionX + 200, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.sourButton.x - 50, this.sourButton.y - 50, 'Sour');
        
        this.sweetButton = this.add.sprite(this.buttonPositionX + 300, this.buttonPositionY, 'kitchenScene', 'blueObject.png');
        this.add.text(this.sweetButton.x - 50, this.sweetButton.y - 50, 'Sweet');
    }
    
    userPrompt()
    {
        var text = this.add.text(this.cameras.main.centerX - this.cameras.main.centerX/3.5, 
            this.cameras.main.centerY + 50, 
            'Please enter your name', 
            { color: 'white', fontSize: '24px '});

        // Prompt for the username
        var element = this.add.dom(this.cameras.main.centerX/2, this.cameras.main.centerY/2).createFromCache('username');

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
            if (p.leftButtonDown())
            {           
                alert('everything tastes better with salt');
                this.playerType = new SaltyCharacter();
                this.scene.start('armoryScene', { 
                    player: new SaltyCharacter(),
                    socket: this.socket, 
                });
                //return;
                //console.log("Sending to GameScene ", this.username);
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
                this.playerType = new SpicyCharacter();
                this.scene.start('armoryScene', { 
                    player: new SpicyCharacter(), 
                    socket: this.socket,
                    username: this.username
                });
                //return;
                //console.log("Sending to GameScene ", this.username);
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
                this.playerType = new SourCharacter();
                this.scene.start('armoryScene', {
                    player: new SourCharacter(),
                    socket: this.socket,
                    username: this.username
                });
                //return;
                //console.log("Sending to GameScene ", this.username);
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
            this.sweetButton.setTint(0xffffff);
        }, this);
        this.sweetButton.on('pointerdown', function(p) 
        {
            if (p.leftButtonDown()){  

                alert('mm.. the sweet smell of a winner');
                this.playerType = new SweetCharacter();
                this.scene.start('armoryScene', {
                    player: new SweetCharacter(), 
                    socket: this.socket,
                    username: this.username
                });
                //return;
                //console.log("Sending to GameScene ", this.username);
            }
        }, this);   
    }
/*
    startGame()
    {
        this.scene.start('armoryScene', {
            player: this.playerType, 
            socket: this.socket,
            username: this.username
        });

    }
    */
}